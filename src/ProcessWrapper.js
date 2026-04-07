import * as vscode from "vscode"
import {spawn} from "node:child_process"
import {EventEmitter} from "node:events"

/**
 * @import {ChildProcess} from "node:child_process"
 * @import {Terminal} from "vscode"
 */

/**
 * ProcessWrapper - Manages a child process with VSCode terminal integration
 *
 * This class provides a wrapper around Node.js child processes that can be
 * controlled from a VSCode extension. It supports both direct process spawning
 * and terminal-based execution with proper cleanup and signal handling.
 *
 * @example Basic usage with terminal
 * ```javascript
 * const wrapper = new ProcessWrapper({
 *   command: "npm",
 *   args: ["run", "watch"],
 *   terminalName: "Build Watcher"
 * })
 *
 * await wrapper.start()
 * // Process runs in terminal...
 * await wrapper.stop() // Sends SIGTERM
 * ```
 *
 * @example Direct process spawn with output handling
 * ```javascript
 * const wrapper = new ProcessWrapper({
 *   command: "./build.sh",
 *   args: ["--watch"],
 *   useTerminal: false
 * })
 *
 * wrapper.on("stdout", data => console.log(data))
 * wrapper.on("stderr", data => console.error(data))
 * wrapper.on("exit", code => console.log(`Exited with ${code}`))
 *
 * await wrapper.start()
 * ```
 *
 * @example With environment variables
 * ```javascript
 * const wrapper = new ProcessWrapper({
 *   command: "node",
 *   args: ["server.js"],
 *   env: {
 *     NODE_ENV: "development",
 *     PORT: "3000"
 *   }
 * })
 * ```
 *
 * @example Check if process is running
 * ```javascript
 * if (wrapper.isRunning()) {
 *   await wrapper.stop()
 * }
 * ```
 */
export default class ProcessWrapper extends EventEmitter {
  /** @type {ChildProcess?} */
  #process = null

  /** @type {Terminal?} */
  #terminal = null

  /** @type {boolean} */
  #busy = false

  /** @type {Array<import("vscode").Disposable>} */
  #disposables = []

  /** @type {string} */
  #command

  /** @type {Array<string>} */
  #args

  /** @type {boolean} */
  #useTerminal

  /** @type {string?} */
  #terminalName

  /** @type {string?} */
  #cwd

  /** @type {{[key: string]: string}?} */
  #env

  /** @type {number?} */
  #pid = null

  /**
   * Create a new process wrapper
   *
   * @param {object} options - Configuration options
   * @param {string} options.command - Command to execute
   * @param {Array<string>} [options.args] - Command arguments
   * @param {boolean} [options.useTerminal] - Use VSCode terminal instead of spawn
   * @param {string?} [options.terminalName] - Name for terminal (if useTerminal=true)
   * @param {string?} [options.cwd] - Working directory
   * @param {{[key: string]: string}?} [options.env] - Environment variables
   */
  constructor(options) {
    super()

    this.#command = options.command
    this.#args = options.args || []
    this.#useTerminal = options.useTerminal ?? true
    this.#terminalName = options.terminalName || "Process"
    this.#cwd = options.cwd
    this.#env = options.env
  }

  /**
   * Start the process
   *
   * @returns {Promise<void>}
   */
  async start() {
    if(this.#isAlive())
      throw new Error("Process is already running")

    if(this.#useTerminal)
      await this.#giveBirthInTerminal()
    else
      await this.#giveBirthDirect()
  }

  /**
   * Stop the process by sending SIGTERM
   *
   * @param {number} [timeout] - Milliseconds to wait before SIGKILL (default: 5000)
   * @returns {Promise<void>}
   */
  async stop(timeout = 5000) {
    if(!this.#isAlive())
      return

    if(this.#useTerminal) {
      await this.#murderTheTerminalBaby()

      return
    }

    await this.#murderTheBaby(timeout)
  }

  /**
   * Check if process is currently running
   *
   * @returns {boolean} True if process is running
   */
  isRunning() {
    return this.#isAlive()
  }

  /**
   * Check if this process wrapper has a living child
   *
   * @returns {boolean} True if process is alive and kicking
   */
  #isAlive() {
    if(this.#useTerminal)
      return this.#busy

    return this.#process !== null && !this.#process.killed
  }

  /**
   * Dispose all event listener subscriptions
   *
   * @private
   */
  #disposeListeners() {
    for(const disposable of this.#disposables) {
      disposable.dispose()
    }

    this.#disposables = []
  }

  /**
   * Get the process ID
   *
   * @returns {number?} The process ID or null
   */
  getPid() {
    return this.#pid
  }

  /**
   * Get the terminal instance (if using terminal mode)
   *
   * @returns {Terminal?} The terminal instance or null
   */
  getTerminal() {
    return this.#terminal
  }

  /**
   * Murder the baby (send SIGTERM, then SIGKILL if needed)
   *
   * @param {number} timeout - Milliseconds to wait before SIGKILL
   * @returns {Promise<void>}
   */
  async #murderTheBaby(timeout) {
    return new Promise((resolve, reject) => {
      if(!this.#process)
        return resolve()

      let killed = false
      const killTimer = setTimeout(() => {
        if(!killed && this.#process) {
          this.#process.kill("SIGKILL")
          killed = true
        }
      }, timeout)

      const cleanup = () => {
        clearTimeout(killTimer)
        this.#process = null
        this.#pid = null
        resolve()
      }

      this.#process.once("exit", cleanup)
      this.#process.once("error", err => {
        clearTimeout(killTimer)
        reject(err)
      })

      try {
        this.#process.kill("SIGTERM")
      } catch(error) {
        clearTimeout(killTimer)
        reject(error)
      }
    })
  }

  /**
   * Give birth to a process in VSCode terminal
   *
   * @returns {Promise<void>}
   */
  async #giveBirthInTerminal() {
    const existing = vscode.window.terminals.find(
      t => t.name === this.#terminalName
    )

    if(existing) {
      this.#terminal = existing
    } else {
      this.#terminal = vscode.window.createTerminal({
        name: this.#terminalName,
        cwd: this.#cwd,
        env: this.#env
      })
    }

    this.#terminal.show(true)

    const commandLine = [
      this.#command,
      ...this.#args
    ].join(" ")

    this.#terminal.sendText(commandLine)
    this.#busy = true

    this.#pid = await this.#terminal.processId

    this.#disposables.push(
      vscode.window.onDidEndTerminalShellExecution(event => {
        if(event.terminal === this.#terminal) {
          this.#busy = false
          this.emit("exit", event.exitCode)
        }
      })
    )

    this.#disposables.push(
      vscode.window.onDidCloseTerminal(terminal => {
        if(terminal === this.#terminal) {
          this.#terminal = null
          this.#pid = null
          this.#busy = false
          this.#disposeListeners()
          this.emit("exit", null)
        }
      })
    )
  }

  /**
   * Murder the terminal baby
   *
   * @returns {Promise<void>}
   */
  async #murderTheTerminalBaby() {
    if(!this.#terminal || !this.#pid)
      return

    try {
      process.kill(this.#pid, "SIGTERM")
    } catch(error) {
      if(error.code !== "ESRCH")
        throw error
    }

    this.#terminal = null
    this.#pid = null
    this.#busy = false
    this.#disposeListeners()
  }

  /**
   * Give birth directly using spawn
   *
   * @returns {Promise<void>}
   */
  async #giveBirthDirect() {
    /** @type {import("node:child_process").SpawnOptions} */
    const spawnOptions = {
      cwd: this.#cwd,
      env: {...process.env, ...this.#env},
      stdio: ["ignore", "pipe", "pipe"]
    }

    this.#process = spawn(this.#command, this.#args, spawnOptions)
    this.#pid = this.#process.pid

    this.#process.stdout?.on("data", data => {
      this.emit("stdout", data.toString())
    })

    this.#process.stderr?.on("data", data => {
      this.emit("stderr", data.toString())
    })

    this.#process.on("exit", (code, signal) => {
      this.#process = null
      this.#pid = null
      this.emit("exit", code, signal)
    })

    this.#process.on("error", error => {
      this.emit("error", error)
    })
  }
}

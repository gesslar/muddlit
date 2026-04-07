import os from "node:os"

export default class {
  /**
   * Get the operating system
   *
   * @returns {string} - The operating system
   */
  static getOs = () => os.platform()
}

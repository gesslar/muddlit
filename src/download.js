const vscode = require('vscode')
const https = require('https')
const tar = require('tar')
const fs = require('fs')
const path = require('path')
const config = require("./config")

const msg = vscode.window.showInformationMessage

/**
 * Download and extract Muddler binaries
 * @param {Object} context - The extension context
 */
function downloadMuddler(context) {
  msg('Downloading Muddler...')
  console.info('[muddlit] Downloading Muddler...')
  determineLatestVersion((err, assets) => {
    if (err) {
      console.error('[muddlit] Error determining latest version:', err)
      msg('Error determining latest version:', err)
    } else {
      doDownload(context, {
        version: assets.version,
        url: assets.url,
      })
    }
  })
}

/**
 * Download a file from a URL
 * @param {Object} context - The extension context
 * @param {Object} resource - The resource to download
 */

function doDownload(context, resource) {
  const { version, url } = resource;
  const filename = `muddle-shadow-${version}.tar`;

  const folderPath = context.globalStoragePath;
  const filePath = path.join(folderPath, filename);

  console.info(`Downloading ${filename}...`);
  console.info(`URL: ${url}`);
  console.info(`File path: ${filePath}`);
  console.info(`Folder path: ${folderPath}`);

  vscode.window.showInformationMessage(`Downloading ${filename}...`);

  // Ensure folder exists, create it if not
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.info(`Created folder path: ${folderPath}`);
  }

  const file = fs.createWriteStream(filePath);

  // Function to handle errors and clean up the file
  const handleError = (err) => {
    console.error(`Error downloading ${filename}: ${err.message}`);
    vscode.window.showErrorMessage(`Error downloading ${filename}: ${err.message}`);

    file.close(() => {
      // Unlink the file only after closing the file stream
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error removing incomplete file: ${unlinkErr.message}`);
        }
      });
    });
  };

  // Function to handle the download request and follow redirects
  const handleRequest = (url) => {
    https.get(url, (response) => {
      // Handle redirection (301, 302)
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.info(`Redirecting to ${redirectUrl}`);
        handleRequest(redirectUrl); // Follow the redirect
        return;
      }

      if (response.statusCode !== 200) {
        handleError(new Error(`Failed to get '${url}' - ${response.statusCode} - ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close(() => {
          console.info(`${filename} downloaded successfully.`);

          extract(filePath, folderPath)
          .then((extractedDir) => {
            console.info(`Extracted to ${extractedDir}`);
            const os = config.getOs();
            if(os === "win32")  // Windows
              config.updateBinaryPath(`${extractedDir}\\bin`);
            else
              config.updateBinaryPath(`${extractedDir}/bin`);

            vscode.window.showInformationMessage(`Muddler v${version} downloaded successfully.`);
          })
          .catch((err) => {
            console.error(`Error extracting ${filename}: ${err.message}`);
            vscode.window.showErrorMessage(`Error extracting ${filename}: ${err.message}`);
          });
        });
      });

      // Catch stream errors during piping
      file.on('error', handleError);
    }).on('error', handleError); // Handle https.get errors
  };

  // Start the download request
  handleRequest(url);
}

/**
 * Get the latest version's assets
 * @param {function} callback
 */
function determineLatestVersion(callback) {
  const options = {
    hostname: 'api.github.com',
    path: '/repos/demonnic/muddler/releases/latest',
    method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0' }, // GitHub requires a user-agent
  }

  https.get(options, res => {
    let data = ''

    console.log('[muddlit] Response status code:', res.statusCode)

    // A chunk of data has been received.
    res.on('data', chunk => {
      console.info('[muddlit] Received data chunk (size: %d)', chunk.length)
      data += chunk
    })

    // The whole response has been received.
    res.on('close', () => {
      console.info('[muddlit] Finished receiving data')

      const releaseInfo = JSON.parse(data)

      // Define the regex patterns for the file names
      const pattern = /^muddle-shadow-.*\.tar$/

      const asset = releaseInfo.assets.find(asset => pattern.test(asset.name))

      if(asset) {
        // Return the asset URLs and version
        callback(null, {
          url: asset.browser_download_url,
          version: releaseInfo.tag_name
        })
      } else {
        console.error('[muddlit] Desired assets not found')
        callback(new Error('Desired assets not found'))
      }
    })

    res.on('error', (err) => {
      console.error('[muddlit] Error getting release info:', err)
      callback(err)
    })
  })
}

/**
 * Extract .tar files
 * @param {string} filePath
 * @param {string} targetDirectory
 */
function extract(filePath, targetDirectory) {
  return tar.x({ file: filePath, C: targetDirectory }).then(() => {
    console.log(`Extraction complete to ${targetDirectory}`);

    // Check for the contents of the target directory to find the extracted folder
    return new Promise((resolve, reject) => {
      fs.readdir(targetDirectory, (err, files) => {
        if (err) {
          return reject(err);
        }

        // Assuming the tar contains a single folder at the top level
        const extractedDir = files.find(file => fs.lstatSync(path.join(targetDirectory, file)).isDirectory());
        if (extractedDir) {
          resolve(path.join(targetDirectory, extractedDir));
        } else {
          resolve(targetDirectory); // No top-level folder, just files extracted directly
        }
      });
    });
  });
}


module.exports = downloadMuddler

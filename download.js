// const http = require('http')
// const fs = require('fs')

// const file = fs.createWriteStream("dataset/dataset.BIN");
// const request = http.get("http://geolocation-dataset.s3.amazonaws.com/IP2LOCATION-LITE-DB11.IPV6.BIN", function(response) {
//   console.log('fetching...')
//   response.pipe(file);
// });

const { parse } = require('url')
const http = require('https')
const fs = require('fs')
const { basename } = require('path')

const TIMEOUT = 10000

function download(url, path) {
  const uri = parse(url)
  if (!path) {
    path = basename(uri.path)
  }
  const file = fs.createWriteStream(path)

  return new Promise(function(resolve, reject) {
    const request = http.get(uri.href).on('response', function(res) {
      const len = parseInt(res.headers['content-length'], 10)
      let downloaded = 0
      let percent = 0
      res
        .on('data', function(chunk) {
          file.write(chunk)
          downloaded += chunk.length
          percent = (100.0 * downloaded / len).toFixed(2)
          process.stdout.write(`Downloading ${percent}% ${downloaded} bytes\r`)
        })
        .on('end', function() {
          file.end()
          console.log(`${uri.path} downloaded to: ${path}`)
          resolve()
        })
        .on('error', function (err) {
          reject(err)
        })
    })
    request.setTimeout(TIMEOUT, function() {
      request.abort()
      reject(new Error(`request timeout after ${TIMEOUT / 1000.0}s`))
    })
  })
}

var dir = './dataset'
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

const url = 'https://geolocation-dataset.s3.amazonaws.com/IP2LOCATION-LITE-DB11.IPV6.BIN'
console.log('Downloading ' + url)
console.log('Downloading file')
try {
    download(url, 'dataset/dataset.BIN')
} catch (e) {
    console.log('Download failed')
    console.log(e.message)
}

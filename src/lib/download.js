const fs = require('fs');
const request = require('request');
const progress = require('request-progress');

module.exports = function (uri, path, onProgress, onResponse, onError, onEnd) {
    progress(request(uri))
    .on('progress', onProgress)
    .on('response', onResponse)
    .on('error', onError)
    .on('end', onEnd)
    .pipe(fs.createWriteStream(path))
};
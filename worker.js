// worker.js
const { parentPort, workerData } = require('worker_threads');
const ffmpeg = require('fluent-ffmpeg');

function resizeVideo({ inputPath, size, parentPort }) {
  const outputPath = 'public/compressed/' + Date.now() + size + '.mp4';
  // console.log(workerData); // "workerData!" FROM MAIN THREAD
  ffmpeg(inputPath)
    .audioCodec('libmp3lame')
    .videoCodec('libx264')
    .size(size)
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      // NOTE - RETURNS THE RESULT TO MAIN THREAD.
      parentPort.postMessage(outputPath);
    })
    .save(outputPath);
}

// NOTE - MESSAGES SENT FROM THE PARENT THREAD USING worker.postMessage() WILL BE AVAILABLE IN THIS THREAD USING parentPort.on('message');
parentPort.on('message', (param) => {
  resizeVideo({ ...param, parentPort });
});

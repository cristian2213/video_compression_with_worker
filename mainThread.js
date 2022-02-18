// mainThread.js
// LINK - MORE INFO: https://nodejs.org/docs/latest-v10.x/api/worker_threads.html#worker_threads_worker_threads

const { StaticPool } = require('node-worker-threads-pool');
const { join } = require('path');

const filePath = join(__dirname, 'worker.js');
const pool = new StaticPool({
  size: 4,
  task: filePath,
  workerData: 'workerData!',
});

const videoSizes = ['1920x1080', '1280x720', '854x480', '640x360'];

// module.exports = async function compressVideo(inputPath) {
async function compressVideo(inputPath) {
  const compressedVideos = [];
  videoSizes.forEach(async (size) => {
    const video = await pool.exec({ inputPath, size });
    compressedVideos.push(video);
  });

  console.log('compressed videos: ', compressedVideos);
}

compressVideo(join(__dirname, 'public', 'terminal.mp4'));

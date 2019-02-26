const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const path = require('path');

const directory = process.argv[2];
const outputName = process.argv[3];

const videoInfo = [];
const checkVideoDuration = [];

new Promise((resolve, reject) => {
  return fs.readdir(directory, (err, files) => {
    if (err) {
      console.log('error:', err);
      process.exit(1);
    }

    files.forEach((file, index) => {
      const video = {};

      video.file = path.basename(file);
      video.name = path.parse(file).name;
      videoInfo.push(video);
      
      checkVideoDuration.push(getVideoDurationInSeconds(directory + '/' + video.file).then(duration => {
        videoInfo[index].duration = duration;
      }));
    });
    return resolve();
  });
}).then(() => {
  Promise.all(checkVideoDuration).then(() => {
    fs.writeFile('./output/' + outputName + '.json', JSON.stringify(videoInfo, null, 2), (err) => {
      if(err) {
        console.error(err);
      } else {
        console.info('The file was saved');
      }
    });
  });
});

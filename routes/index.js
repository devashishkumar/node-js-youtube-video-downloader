const { resolveNaptr } = require('dns');
var express = require('express');
const fs = require('fs')
const youtubedl = require('youtube-dl-exec');
const ytdl = require('ytdl-core');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Download You Tube Videos' , videoData: '', url: '', mimeTypes: []});
});

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

router.post('/', async function (req, res, next) {
  if (ytdl.validateURL(req.body.url)) {
    try {
      const result = await ytdl.getBasicInfo(req.body.url);
      const mimeTypes = [];
      const allMimeTypes = ['mp4', 'webm'];
      if (result &&
        result.player_response &&
        result.player_response.streamingData &&
        result.player_response.streamingData.adaptiveFormats) {
          result.player_response.streamingData.adaptiveFormats.forEach((f, index) => {
            let mimeType = '';
            if (!f.mimeType.includes('audio')) {
              mimeTypes.push({
                qualityLabel: f.qualityLabel,
                mimeType: (f.mimeType.includes('mp4')) ? 'mp4' : 'webm',
                length: bytesToSize(f.contentLength),
                recordIndex: index
              });
            }
          })
      }
      res.render('index', {
        title: 'Download You Tube Video',
        videoData: result,
        url: req.body.url,
        mimeTypes: mimeTypes
      });
    } catch(e) {
      console.error(e);
    }
    // ytdl.getBasicInfo(req.body.url).then(res => res).then(
    //   json => {
    //     // console.log(json)
    //     res.render('index', {
    //       title: 'Download You Tube Video',
    //       videoData: json,
    //       url: req.body.url
    //     });
    //   }
    // );
  } else {
    res.render('index', { title: 'Download You Tube Videos' , videoData: '', url: '', mimeTypes: []});
  }

});

router.post('/download', async function (req, res, next) {
  req.body.format = JSON.parse(req.body.format);
  let mimeType = '';
  const mimeTypes = ['mp4', 'webm'];
  mimeTypes.forEach(mt => {
    if (req.body.format.mimeType.includes(mt)) {
      mimeType = mt;
    }
  });
  // res.send(req.body.format);
  const fileName = `${req.body.title}-${req.body.format.qualityLabel}.${mimeType}`;
  try {
    res.header('Content-Disposition', `attachment; filename=${fileName}`);
    // await ytdl.downloadFromInfo(req.body.url, req.body.format).pipe(res);
    await ytdl(req.body.url, { filter: 'audioandvideo',
    qualityLabel: req.body.format.qualityLabel,
    width: req.body.format.width,
    height: req.body.format.height,
    bitrate: req.body.format.bitrate,
    itag: req.body.format.itag,
    // quality: req.body.format.quality,
    container: mimeType}).pipe(res);
  } catch(e) {
    console.log(e);
  }

  // res.header('Content-Disposition', `attachment; filename=${fileName}`);

  // res.header('Content-Disposition', `attachment; filename=${fileName}`);
  // ytdl(req.body.url, { filter: 'audioandvideo',
  // qualityLabel: req.body.format.qualityLabel,
  // width: req.body.format.width,
  // height: req.body.format.height,
  // bitrate: req.body.format.bitrate,
  // itag: req.body.format.itag,
  // // quality: req.body.format.quality,
  // container: mimeType}).pipe(res);

});

router.post('/downloadvideo', function(req, res, next) {
  // res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  // ytdl(req.body.url, {
  //   format: 'mp4'
  //   }).pipe(res);
  // res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  // const info = {
  //   vid: '',
  //   uid: ''
  // };
  // const options = {
  //   quality: 'highest',
  //   filter: 'audioandvideo',
  //   format: {
  //     itag: req.body.itag,
  //     url: ''
  //   }
  // };

});

module.exports = router;

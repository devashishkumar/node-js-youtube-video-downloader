const { resolveNaptr } = require('dns');
var express = require('express');
const fs = require('fs')
const youtubedl = require('youtube-dl-exec');
const ytdl = require('ytdl-core');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Download You Tube Videos' , videoData: '', url: ''});
});

router.post('/', function (req, res, next) {
  // res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  // ytdl(req.body.url, {
  //   format: 'mp4'
  //   }).pipe(res);
  if (ytdl.validateURL(req.body.url)) {
    ytdl.getBasicInfo(req.body.url).then(res => res).then(
      json => {
        // console.log(json)
        res.render('index', {
          title: 'Download You Tube Video',
          videoData: json,
          url: req.body.url
        });
      }
    );
  } else {
    res.render('index', { title: 'Download You Tube Videos' , videoData: '', url: ''});
  }

});

router.post('/download', function (req, res, next) {
  req.body.format = JSON.parse(req.body.format);
  let mimeType = '';
  const mimeTypes = ['mp4', 'webm'];
  mimeTypes.forEach(mt => {
    if (req.body.format.mimeType.includes(mt)) {
      mimeType = mt;
    }
  });
  const fileName = `${req.body.title}-${req.body.format.qualityLabel}.${mimeType}`;

  // res.header('Content-Disposition', `attachment; filename=${fileName}`);

  res.header('Content-Disposition', `attachment; filename=${fileName}`);
  ytdl(req.body.url, { filter: 'audioandvideo',
  qualityLabel: req.body.format.qualityLabel,
  width: req.body.format.width,
  height: req.body.format.height,
  bitrate: req.body.format.bitrate,
  itag: req.body.format.itag,
  // quality: req.body.format.quality,
  container: mimeType}).pipe(res);

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

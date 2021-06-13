var express = require('express');
const fs = require('fs')
const youtubedl = require('youtube-dl-exec');
const ytdl = require('ytdl-core');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Download You Tube Video' , videoData: '', url: ''});
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
    res.render('index', { title: 'Download You Tube Video' , videoData: '', url: ''});
  }

});

router.post('/download', function (req, res, next) {
  // res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  // ytdl(req.body.url, {
  //   format: 'mp4'
  //   }).pipe(res);
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  const info = {
    vid: '',
    uid: ''
  };
  const options = {
    quality: 'highest',
    filter: 'audioandvideo',
    format: {
      itag: '',
      url: ''
    }
  };
  ytdl.downloadFromInfo(info, options).pipe(res);

});

module.exports = router;

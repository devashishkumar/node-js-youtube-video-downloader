var express = require('express');
const ytdl = require('ytdl-core');
var router = express.Router();

/* GET home page. */
router.get('/getvideodetails/:videoUrl', function(req, res, next) {
  res.json({name: 'Ashish'});
});

module.exports = router;

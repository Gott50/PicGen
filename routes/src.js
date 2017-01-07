var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('src', { src: "http://"+ req.headers.host+'/?length=10'});
});

module.exports = router;

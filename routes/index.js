var express = require('express');
var router = express.Router();

let paste = require("../public/javascripts/paste");
/* GET home page. */
router.get('/', function(req, res, next) {
  paste(["backgrounds", "5 min home 3 min AMRAP", "filter", "foreground elements"]);
  res.render('index', {});
});

module.exports = router;

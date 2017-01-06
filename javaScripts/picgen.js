var express = require('express');
var router = express.Router();
let paste = require("./paste");

/* GET home page. */
router.get('/', function(req, res, next) {
    paste.reduce(["backgrounds", "5 min home 3 min AMRAP", "filter", "foreground elements"]);
    res.render('index', {});
});

module.exports = router;
var express = require('express');
var router = express.Router();
let paste = require("./paste");
let config = require("./config").config;
let async = require("async");
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query);

    async.each(config, function (item, callback) {
        if (req.query[item.key] == item.value){
            paste.reduce(item.then); //TODO add Promise
            callback("found the key");
        }
        else callback;
    }, function (err) {
        console.log(err);
        // res.sendFile(path.join(__dirname + "/../public/paste.png"));
    });
});

module.exports = router;
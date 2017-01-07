var express = require('express');
var router = express.Router();
let paste = require("./paste");
let config = require("../config");
let async = require("async");
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query);

    let sendFile = function (err) {
        let file = path.join(__dirname + "/../public/" + err);
        res.sendFile(file, () => fs.unlink(file));
    };

    async.each(config, function (item, callback) {
        console.log("try: " + item.key + ": " + item.value);
        if (req.query[item.key] == item.value){
            paste.reduce(item.then, callback);
        }
        else {
            callback(null);
        }
    }, function (err) {
        console.log("send: "+ err);
        if (!err) {
            paste.reduce(config[0].then, function (err) {
                sendFile(err);
            });
        } else if (err.endsWith(".png")) {
            sendFile(err);
        }
    });
});

module.exports = router;
var express = require('express');
var router = express.Router();
let paste = require("./paste");
let config = require("./config");
let async = require("async");
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query);

    let sendFile = function (img) {
        let file = path.join(__dirname + "/" + img);
        res.sendFile(file, () => fs.unlink(file, () => console.log("send dele:" + img)));
    };
    let sendFileSave = function (img) {
        let file = path.join(__dirname + "/" + img);
        res.sendFile(file, () => console.log("send save: " + img));
    };

    let sendEntry = function (entry) {
        let dir = "./public/queue/" + entry.key + "=" + entry.value;
        let files = fs.readdirSync(dir);
        if (files[1])
            sendFile(dir + "/" + files[1]);
        else sendFileSave(dir + "/" + files[0]);
    };
    async.each(config, function (item, callback) {
        let folder = item.key + "=" + item.value;
        console.log("try: " + folder);
        if (req.query[item.key] == item.value){
            sendEntry(item);
            paste.reduce(item.then, callback, folder);
        }
        else {
            callback(null);
        }
    }, function (err) {
        console.log("write: " + err);
        if (!err) {
            paste.reduce(config[0].then);
            sendEntry(config[0]);
        } else if (err.endsWith(".png")) {
            // sendFile(err);
        }
    });
});

module.exports = router;
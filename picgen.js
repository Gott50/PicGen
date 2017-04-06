const express = require('express');
const router = express.Router();
let paste = require("./paste");
let config = require("./config");
const async = require("async");
const path = require('path');

router.get('/ping', function (req, res) {
    res.send('pong');
});

/* GET home page. */
router.get('/', function (req, res) {
    console.log(req.query);

    let sendFile = function (img) {
        if(img === undefined) throw new Error("Image not in queue");
        let file = path.join(__dirname + "/" + img);
        res.sendFile(file, () => fs.unlink(file, () => console.log("send dele: " + img)));
    };
    let sendFileSave = function (img) {
        let file = path.join(__dirname + "/" + img);
        res.sendFile(file, () => console.log("send save: " + img));
    };

    let sendEntry = function (entry) {
        let keyValue = entry.key + "=" + entry.value;
        try {
            let dir = "./public/queue/" + keyValue;
            let files = fs.readdirSync(dir);
            sendFile(dir + "/" + files[0]);

        } catch (err) {
            console.log("send save Pic because of: " + err);
            sendFileSave("./public/save/" + keyValue + "/!first.png")
        }
    };
    async.each(config, function (item, callback) {
        let folder = item.key + "=" + item.value;
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
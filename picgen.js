const express = require('express');
const router = express.Router();
let paste = require("./paste");
let config = require("./config");
const async = require("async");
const path = require('path');

router.get('/ping', function (req, res) {
    res.send('pong');
});

let buildFolder = function (item) {
    return item.type + "/" + item.location + "/" + item.duration;
};
router.get('/', function (req, res) {
    console.log(req.query);

    let sendFile = function (img) {
        let file = path.join(__dirname + "/" + img);
        res.sendFile(file, () => fs.unlink(file, () => console.log("send dele: " + img)));
    };
    let sendFileSave = function (img) {
        let file = path.join(__dirname + "/" + img);
        res.sendFile(file, () => console.log("send save: " + img));
    };

    let sendEntry = function (entry) {
        let folder = buildFolder(entry);
        try {
            let dir = "./public/queue/" + folder;
            let files = fs.readdirSync(dir);
            if(files.length < 1) throw new Error("no Image in queue");
            sendFile(dir + "/" + files[0]);

        } catch (err) {
            console.log("send save Pic because of: " + err);
            let dir = "./public/save/" + folder;
            sendFileSave(dir + "/" + fs.readdirSync(dir)[0])
        }
    };

    let type = req.query.type;
    let location = req.query.location;
    let duration = req.query.duration;
    let catalog = config;
    if (type)
        catalog = config.filter(el => filterType(el, type));
    console.log(catalog)
    let item = catalog[getCIndex(location, duration, catalog)];
    let folder = buildFolder(item);
    if (item) {
            paste.reduce(item.src, folder);
            sendEntry(item);
    } else {
        console.log("not Found in config.js, sending default for: ", type, location, duration);
        paste.reduce(catalog[0].src, buildFolder(catalog[0]));
        sendEntry(catalog[0]);
    }
});
function filterType(element, type) {
    return element.type === type;
}

function getCIndex(location, duration, config = config) {
    location = parsLocation(location);
    duration = parsDuration(duration);
    console.log(location, duration);
    for (let i = 0; i < config.length; i++) {
        let item = config[i];
        if (location === item.location &&
            ((Array.isArray(item.duration) && item.duration.includes(duration))
            || duration === item.duration))
            return i;
    }
    return 0;

}

function parsDuration(duration) {
    if (!duration || duration === "")
        return 30;

    duration = Number.parseInt(duration, 10);
    return duration <= 5 ? 5 : duration <= 60 ?
        Math.floor(duration / 5) * 5 : 60;
}

function parsLocation(location) {
    if (location)
        switch (location) {
            case "home":
            case "gym":
            case "outdoor":
                return location;
            default:
                return "home";
        }
    else return "home";
}

module.exports = router;
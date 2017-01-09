/**
 * Example for using LWIP to blend two images.
 */

var path = require('path'),
    async = require('async'),
    lwip = require('lwip');
fs = require('fs');
config = require("./config");
path = require("path");


let reduce = (arr, done, folder) => {
    done = done || function (name) {
            console.log("done: " + name);
        };
    folder = folder || config[0].key + "=" + config[0].value;
    return async.map(arr, open, (err, result) => async.reduce(result, 0, pasteAsync, writeFile));

    function getFiles(dir) {
        try {
            fileList = [];
            let files = fs.readdirSync(dir);
            for (let i in files) {
                if (!files.hasOwnProperty(i)) continue;
                let name = dir + '/' + files[i];
                if (!fs.statSync(name).isDirectory() && name.toLocaleLowerCase().endsWith(".png")) {
                    fileList.push(name);
                }
            }
        } catch (err) {
            let folder = path.join(__dirname);
            console.log(err, "folder: "+ folder);
        }
        return fileList;
    }

    function open(folder, callback) {
        let files = getFiles('./images/' + folder);
        let file = files[getRandomInt(0, files.length)];
        if (file)
            lwip.open(file, function (err, image) {
                console.log("open: "+  file);
                callback(err, image);
            });
        else logError(folder + " is empty");
    }
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function pasteAsync(image, next, callback) {
        if (image != 0)
            image.paste(0, 0, next, (err, image) => callback(null, image));
        else
            callback(null, next);
    }
    function writeFile(err, image) {
        if (!err)
            {
                let name = new Date() + 'paste.png';
                image.writeFile('./public/queue/' + folder + "/" + name, function (err) {
                                logError(err);
                                done(name);
                            });
            }
        else logError(err);
    }

    function logError(err) {
        if (err) console.log(err);
    }
};

async.eachSeries(config, generateInQueue);

function generateInQueue(entry, callback) {
    let folder = entry.key + "=" + entry.value;
    fs.mkdir(path.join(__dirname + "/public/queue"),
        () => fs.mkdir(path.join(__dirname + "/public/queue/" + folder),
            () => reduce(entry.then, err => {
                 console.log(folder + ": " + err);
                 callback(null);
            }, folder)
        )
    );
}

exports.reduce = reduce;



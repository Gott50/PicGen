/**
 * Example for using LWIP to blend two images.
 */

var path = require('path'),
    async = require('async'),
    lwip = require('lwip');
fs = require('fs');


let reduce = arr => async.map(arr, open, (err, result) => async.reduce(result, 0, pasteAsync, writeFile));
// reduce(["backgrounds", "5 min home 3 min AMRAP", "filter", "foreground elements"]);
exports.reduce = reduce;

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
        logError(err);
    }
    return fileList;
}


function open(folder, callback) {
    let files = getFiles('../images/workouts/' + folder);
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
        image.writeFile('../public/paste.png', function (err) {
            logError(err);
            console.log("Generated!");
        });
    else logError(err);
}

function logError(err) {
    if (err) console.log(err);
}

/**
 * Example for using LWIP to blend two images.
 */

var path = require('path'),
    async = require('async'),
    lwip = require('lwip');


let reduce = arr => async.map(arr, open, function (err, result) {
    result.reduce(paste).writeFile('paste111.jpg', err => console.log(err));
});
reduce(["backgrounds", "5 min home 3 min AMRAP", "backgrounds", "filter", "foreground elements"]);

function paste(image, next, index) {
    if (image)
        image.paste(0, 0, next, function (err, image) {
            if (err)
                console.log(err);
            else console.log("past: " + index);
            return image;
        });
    else {
        console.log("not: " + index);
        return next;
    }
}
function open(folder, callback) {
    lwip.open('../images/workouts/' + folder + '/1.png', function (err, image) {
        if (err)
            console.log(err);
        else console.log("open:" + folder);
        callback(err, image);
    });
}


// async.waterfall([
//         function (next) {
//             lwip.open('../images/workouts/backgrounds/1.png', next);
//         },
//         (reduce, next) => lwip.open('../images/workouts/5 min home 3 min AMRAP/1.png', (err, clone) => reduce.paste(0, 0, clone, () => next(err, reduce))),
//         (reduce, next) => lwip.open('../images/workouts/filter/1.png', (err, clone) => reduce.paste(0, 0, clone, () => next(err, reduce))),
//         (reduce, next) => lwip.open('../images/workouts/foreground elements/1.png', (err, clone) => reduce.paste(0, 0, clone, () => next(err, reduce))),
//     ],
//     function (err, reduce) {
//         reduce.writeFile('paste111.jpg', function (err) {
//             if (err) return console.log(err);
//             else console.log('done');
//         });
//     });


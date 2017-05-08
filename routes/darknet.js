const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const async = require('async');
const sleep = require('sleep');
const exec = require('child_process').exec;
const darknet_home = "/home/ubuntu/CNN/Animo_darknet/Animo_Darknet/Animo_Darknet";

router.get('/', function(req, res) {
    res.send("received");
    asyncLoop(10, function(loop) {
      res.redirect
        execCNN(req, res, function(result) {
            console.log(loop.iteration());
            loop.next();
        });
    });
});


function execCNN(req, res, callback) {
    // 1) 맨 마지막 raw image를 불러온다 & 명령행 인자 선언
    var raw_image = getMostRecentFileName('/home/ubuntu/CNN/motion');
    var arg_darknet = "./darknet detector test cfg/voc.data cfg/tiny-yolo-voc.cfg tiny-yolo-voc.weights " + raw_image;
    var arg_mv = "mv " + darknet_home + "/predictions.png /home/ubuntu/CNN/dt_image/" + Date.now() + ".png";



    async.series([
        // 2) 다크넷에 파일 인자를 넣어 실행.
        function(callback) {
            child = exec(arg_darknet, {
                cwd: darknet_home
            }, function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    allback('darknet err');
                }
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                callback(null, '200 darknet');

            });
            //  console.log('darknet!');
            //  callback(null, '200 darknet');
        },
        // 3) output은 해당 경로로 이동시켜 준다.
        function(callback) {

            //console.log(arg_mv);
            child = exec(arg_mv, {
                cwd: darknet_home
            }, function(error, stdout, stderr) {
                //child = exec(arg_test, function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                    callback('mv err');
                }
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                callback(null, 'successed');
            });
            //console.log('mv!');
            //callback(null, '200 darknet');
        }
    ], function(err, result) {
        if (err)
            console.log(err);
        //else
        //res.send("successed");
    });
    sleep.sleep(5);
    callback();
}



function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max
    // 가장 최근에 변경된 파일을 리턴해줌
    return path.join(dir, _.max(files, function(f) {
        var fullpath = path.join(dir, f); // 경로+파일 이름

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    }));
}

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);
            } else {
                // found smth ..
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}





//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

/*
var fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

// Return only base file name without dir
function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    });
}
*/
module.exports = router;

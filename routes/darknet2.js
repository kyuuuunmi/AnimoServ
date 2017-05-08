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
    var count = 0;
    async.whilst(function (){ return count < 5; },
        execCNN(req,res,count,cb),
        function (err) {
          if(err)
          console.log("[whilst err]");
          console.log(err);
        }
    );
});

function execCNN(req, res, count,cb) {
    count++;
    // 1) 맨 마지막 raw image를 불러온다 & 명령행 인자 선언
    var raw_image = getMostRecentFileName('/home/ubuntu/CNN/motion');
    var arg_darknet = "./darknet detector test cfg/voc.data cfg/tiny-yolo-voc.cfg tiny-yolo-voc.weights " + raw_image;
    var arg_mv = "mv " + darknet_home + "/predictions.png /home/ubuntu/CNN/dt_image/" + Date.now() + ".png";

    async.series([
        // 2) 다크넷에 파일 인자를 넣어 실행.
        function(callback) {
            child = exec(arg_darknet,{cwd: darknet_home}, function(error, stdout, stderr) {
                if (error) {
                    console.log('exec error: ')
                    console.log(error);
                    callback('darknet err');
                }
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                callback(null, '200 darknet');

            });
            console.log('darknet!');
            //  callback(null, '200 darknet');
        },
        // 3) output은 해당 경로로 이동시켜 준다.
        function(callback) {
            console.log("mv : "+arg_mv);
            child = exec(arg_mv, {cwd: darknet_home}, function(error, stdout, stderr) {
                if (error) {
                    console.log('exec error: ' + error);
                    callback('mv err');
                }
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                callback(null, 'successed');
            });
            //callback(null, '200 darknet');
        }
    ], function(err, result) {
        if (err)
            console.log(err);
        else
            console.log(good);
        //res.send("successed");
    });
    setTimeout(callback, 1000);
    cb();
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

module.exports = router;

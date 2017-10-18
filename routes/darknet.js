const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const async = require('async');
const sleep = require('sleep');
const exec = require('child_process').exec;
const darknet_home = "/home/ubuntu/CNN/Animo_darknet/Animo_Darknet/Animo_Darknet";

var target;

router.get('/test', function(req, res) {
    /*  var data ={
        code : 1,
        content : "content of response"
      };
    */
    res.send("1");
});

router.get('/find', function(req, res) {
    target = req.query.target;
    var time = new Date().getTime();
    console.log("[ " + time + " ] target '" + target + "' requested'");
    res.status(200).send(target);

});

router.get('/', function(req, res) {
    //res.send("received");
    execCNN(function(err, result) {
        /*
        response result code
        0 : found you want
        1 : found smth but not you want(default)
        -1 : error
        */
        var data = {
            code: 1
        };

        if (err) {
            console.error("err");
            data.code = -1;
            res.status(500).send();

        } else {
            console.log("[detection fin]");
        }
        data.code = result;
        res.status(200).send(data);
        //        res.status(200).send(result+" " + target);
    });
});

function execCNN(callback) {
    // 1) 맨 마지막 raw image를 불러온다 & 명령행 인자 선언
    var raw_image = getMostRecentFileName('/home/ubuntu/CNN/motion');
    var arg_darknet = "./darknet detector test cfg/voc.data cfg/tiny-yolo-voc.cfg tiny-yolo-voc.weights " + raw_image;
    var arg_mv = "mv " + darknet_home + "/predictions.png /home/ubuntu/CNN/dt_image/" + Date.now() + ".png";
    var label_path = "/home/ubuntu/CNN/label_data/labelsave.txt";

    console.log('[darknet] detect ' + raw_image);

    async.series([
        // 2) 다크넷에 파일 인자를 넣어 실행.
        function(cb) {
            child = exec(arg_darknet, {
                cwd: darknet_home
            }, function(error, stdout, stderr) {
                if (error) {
                    console.log('exec error: ' + error);
                    cb('darknet err');
                }
                console.log('[darknet stdout] : ' + stdout);
                cb(null, '200 darknet');
            });

        },
        // 3) output은 해당 경로로 이동시켜 준다.
        function(cb) {
            child = exec(arg_mv, {
                cwd: darknet_home
            }, function(error, stdout, stderr) {
                if (error) {
                    console.log('exec error: ' + error);
                    cb('mv err');
                }
                console.log('[mv stdout]: ' + stdout);
                cb(null, '200 mv ');
            });
        },
        function(cb) {

          /*
          var -> let 선언

          */
            //var flag = 1;
            // labelList Load
            var labelList = fs.readFileSync(label_path).toString().split("\n");

            //  labelList
            for (var i = 0; i < labelList.length; i++) {
            //    console.log('label : ' + labelList[i]);
                if (labelList[i] == target) {
                    cb(null, 0);
                    break;
                    //flag = 0
                }
                if(i == labelList.length-1 )
                  cb(null, 1);
            }
            //if(flag)
            //    cb(null, 1);
        },
        function(cb) {
            // labelList reset
            var labelList = fs.writeFileSync(label_path, '', {
                flag: 'w'
            }, function(error) {
                if (error) {
                    console.log(error);
                    cb('file write error');
                }
            });
            cb(null, '0');
        }
    ], function(err, result) {
        if (err) {
            console.log(err);
            callback(err, "-1");
        } else {
            callback(null, result[2]);
        }
    });

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

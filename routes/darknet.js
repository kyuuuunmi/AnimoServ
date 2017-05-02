const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const async = require('async');

var exec = require('child_process').exec, child;

router.get('/', function(req, res){

  var darknet_home ="/home/ubuntu/CNN/Animo_darknet/Animo_Darknet/Animo_Darknet";

  // 1) 맨 마지막 raw image를 불러온다 & 명령행 인자 선언
  var raw_image = getMostRecentFileName('/home/ubuntu/CNN/raw_image');
  /*var arg_darknet = darknet_home + "/darknet detector test "+
                    darknet_home + "/cfg/voc.data " +
                    darknet_home + "/cfg/tiny-yolo-voc.cfg " +
                    darknet_home + "/tiny-yolo-voc.weights " + raw_image;
*/
  var arg_darknet = "./darknet detector test /cfg/voc.data cfg/tiny-yolo-voc.cfg tiny-yolo-voc.weights " + raw_image;


  var arg_mv = "mv "+ darknet_home + "/predictions.png /home/ubuntu/CNN/dt_image/"+ Date.now() + ".png";


  async.series([
    function(callback){
      var arg_cd = "cd "+darknet_home;

      child = exec(arg_cd, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
              console.log('exec error: ' + error);
          }
      });
    },

    // 2) 다크넷에 파일 인자를 넣어 실행.
    function(callback){

      child = exec(arg_darknet, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
              console.log('exec error: ' + error);
          }
      });
    },
    // 3) output은 해당 경로로 이동시켜 준다.
    function(callback){

      child = exec(arg_mv, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
              console.log('exec error: ' + error);
          }
      });
    }], function(err, result){
      if (err)
        console.log(err);
      else
        res.send("successed");
  });
});
function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max
    // 가장 최근에 변경된 파일을 리턴해줌
    return path.join(dir, _.max(files, function (f) {
        var fullpath = path.join(dir, f); // 경로+파일 이름

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    }));
}


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

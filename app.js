const express = require('express');
const index = require('./routes/index');
const screens = require('./routes/screen');
const darknet = require('./routes/darknet');
const darknet2 = require('./routes/darknet2');
//const filestest = require('./routes/filestest');
const app = express();


app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public')); // 정적인 파일이 위치할 디렉토리를 지정하는 기능

app.use('/', index);
app.use('/screen', screens);
app.use('/darknet', darknet);
app.use('/darknet2', darknet2);
//app.use('/test',filestest);

module.exports = app;

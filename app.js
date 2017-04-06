const express = require('express');
const path = require('path');
const index = require('./routes/index');
const screens = require('./routes/screen');

const app = express();


app.set('views', './views');
app.set('view engine', 'ejs');

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public')); // 정적인 파일이 위치할 디렉토리를 지정하는 기능


app.use('/', index);
app.use('/screen', screens);



module.exports = app;

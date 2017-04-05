const express = require('express');
const index = require('./routes/index');


const app = express();

app.use('/',index);





//
//
// app.listen(3000, function(){
//   console.log('PORT 3000 is connected');
// })

module.exports = app;

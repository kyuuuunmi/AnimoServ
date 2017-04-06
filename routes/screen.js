const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
  res.render('screen');
  //res.send('hihi');
});


module.exports = router;

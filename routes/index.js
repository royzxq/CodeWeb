var express = require('express');
var request = require("request");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // var url = "../items.json";
  //console.log(url);
  res.render('index');
  // request(url, function(err, resp, body){
  //     if(!err){
  //         res.json(body);
  //     } else{
  //         res.status(500).json({status:"fail"});
  //     }
  // });
});

module.exports = router;

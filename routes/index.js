var express = require('express');
var request = require("request");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var url = "http://localhost:3000/items.json";
  console.log(url);
  request(url, function(err, resp, body){
      if(!err){
          res.json(body);
      } else{
          res.status(500).json({status:"fail"});
      }
  });
});

module.exports = router;

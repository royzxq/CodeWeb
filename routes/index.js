var express = require('express');
var request = require("request");
var probService = require("../service/prob-service");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // var url = "../items.json";
  //console.log(url);
  var vm = {
    title : "OJ Integration",
    firstName: req.user ? req.user.firstName : null,
    error : req.flash('error')
  }
  res.render('index', vm);
  // request(url, function(err, resp, body){
  //     if(!err){
  //         res.json(body);
  //     } else{
  //         res.status(500).json({status:"fail"});
  //     }
  // });
});

router.get('/probs', function(req, res, next) {
    probService.getProbs(function(err, probs){
      if (err) {
        return res.status(500).json({error:"Failed"});
      }
      // console.log(probs);
      res.json(probs);
    })
})
module.exports = router;

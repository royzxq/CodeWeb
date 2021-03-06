var express = require('express');
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

});

router.get('/probs', function(req, res, next) {
    res.setHeader("Cache-Control", "public, max-age=25920");
    res.setHeader("Expires", new Date(Date.now() + 25920000).toUTCString());
    
    if (req.session.flash.probs) {
      // console.log("cached");
      return res.json(req.session.flash.probs);

    }
    probService.getProbs(function(err, probs){
      if (err) {
        return res.status(500).json({error:"Failed"});
      }
      // console.log(probs);
      req.session.flash.probs = probs;
      res.json(probs);
    })
})

router.get('/probs/:title', function(req,res,next){
    probService.getProb(req.params.title, function(err, prob){
      if (err) {
        return res.status(500).json({error:"Failed"});
      }
      res.json(prob);
    })
})
module.exports = router;

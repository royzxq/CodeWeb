var Prob = require("../models/prob").Prob;

exports.getProbs = function(next){
    Prob.find({}, function(err,probs){
        if (err) {
          return next(err);
        }
        // for(var i in probs){
        //     console.log(i);
        // }
        next(null,probs);
    });
}
var Prob = require("../models/prob");

exports.getProbs = function(next){
    Prob.find({}, function(err,probs){
        if (err) {
          return next(err);
        }
        next(null,probs);
    });
}

exports.getProb = function(title, next){
	Prob.findOne({title: title}, function(err, prob){
		if (err) {
			return next(err);
		}
		next(null, prob);
	});
}
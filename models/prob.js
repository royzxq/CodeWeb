var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var probSchema = new Schema({
    title: String,
    link: String,
    content: [],
    difficulty: String
}, { collection : 'question_collection' });

var Prob = mongoose.model("Prob", probSchema);
module.exports = {
    Prob : Prob
};
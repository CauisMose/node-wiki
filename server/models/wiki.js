var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wikiSchema = new mongoose.Schema({
    title: String,
    author: String,
    password: String,
    contents: Object,
    number: { type: Number, default: 0},
    date: { type: Date, default: Date.now },
    deleted : {type: Boolean, default:false}
})

module.exports = mongoose.model('Wikis', wikiSchema);

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var CorrectSchema = new mongoose.Schema({
	right: Number,
	wrong: Number
});

CorrectSchema.plugin(passportLocalMongoose);

// Points back to Excuse and in server.js
var Correct = mongoose.model('Correct', CorrectSchema);

module.exports = Correct;

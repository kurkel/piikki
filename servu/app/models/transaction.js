// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
<<<<<<< HEAD
module.exports = mongoose.model('Transaction', new Schema({
    username: String,
    amount: Number,
    date: Date,
}));

/**
 * Created by barte_000 on 2015-12-28.
 */
'use strict';

var mongoose = require('mongoose');
var config = require('../config/config');

var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    fullname:{type: String, required: true},
    password: {type: Date, required: true}
}, {
    collection: "Users"
});

var User = mongoose.model('User', userSchema);
module.exports = User;


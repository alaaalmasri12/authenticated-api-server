'use strict';
const mongoose = require('mongoose');

const usersinfo= mongoose.Schema({
  username : {type: String, required: true},
  password: {type: String, required: true},
  role:{type:String,required:true},
});

module.exports = mongoose.model('userinfo', usersinfo);

'use strict';

const mongoose = require('mongoose');

const categories = mongoose.Schema({
  name : {type: String, required: true},
  displayname: {type: String, required: true},
  description: {type: String},
});

module.exports = mongoose.model('categories', categories);


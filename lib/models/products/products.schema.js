'use strict';

const mongoose = require('mongoose');

const products = mongoose.Schema({
  name : {type: String, required: true},
  displayname: {type: String, required: true},
  description: {type: String, require:true},
  categorie: {type: String},

});

module.exports = mongoose.model('products',products);

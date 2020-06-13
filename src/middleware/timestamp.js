'use strict';
module.exports = (req, res, next) => {
  var d = new Date();
  var n = d.toLocaleTimeString();
   
  req.requestTime=n;
  next();
};
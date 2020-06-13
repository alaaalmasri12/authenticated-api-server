'use strict';

module.exports = (req, res, next) => {
  console.log('time stamp is',req.requestTime);
  console.log('__REQUEST__', req.method, req.path);
  next();
};
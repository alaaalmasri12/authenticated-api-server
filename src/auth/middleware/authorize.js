'use strict';
const users=require('../models/user-model');
module.exports = (capability)=> {
  return (req, res, next) => {
    try {
      let bearerToken = req.headers.authorization.split(' ').pop();

      users.presmission(bearerToken).then(validUser => {
        res.send('worked');
        next();
      })
        .catch(err => next('Invalid Login!!'));
        
        
    } catch(e) {
      // report an error
      next('Invalid Login');
    }
  };
};
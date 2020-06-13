'use strict';

const users = require('../models/user-model');
const base64 = require('base-64');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    next('invalid Login');
    return;
  }
  console.log('req.headers.authorization >>>> ',req.headers.authorization);
  let basic = req.headers.authorization.split(' ').pop();
  console.log(basic);
  let [user, pass] = base64.decode(basic).split(':');
  users.authenticateBasic(user, pass).then(async validUser => {
    req.token = await users.generateTokenin(validUser);
    console.log(req.token);
    next();
  })
    .catch(err => next('Invalid Login!!'));

};

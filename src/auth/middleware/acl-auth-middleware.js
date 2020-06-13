'use strict';
module.exports = (capability)=> {
  return (req, res, next) => {
    try {
      console.log('req.user.capabilites >>> ',req.user.capabilities);
      if (req.user.capabilities.includes(capability)) {
        next();
      } else {
        next('Access Denied');
      }
    } catch(e) {
      // report an error
      next('Invalid Login');
    }
  };
};
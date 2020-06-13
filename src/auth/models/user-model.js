'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET; // place this in your .env
const usersschema = require('./user-schema');
const Module = require('./model');
const modulesq = new Module(usersschema);
// console.log(modulesq);
let users = {};
let roles = {
  user: ['read'],
  editor: ['read', 'update', 'create'],
  admin: ['read', 'update', 'create', 'delete'],
};
users.save = async function (record) {
  console.log('ented');
  let userdata = await modulesq.read(record.username);
  console.log('alaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',userdata);
  if (!userdata[0]) {
    console.log('enterrrrrrrrrrrrrrrrrrr',userdata);
    record.password = await bcrypt.hash(record.password, 5);
    console.log('recording data',record);
    await modulesq.create(record);
    console.log('recording daata',record);
    // .then(Data => {
    //   console.log(Data);
    // }).catch(e=>{
    //   console.log(e.message);
    // });
    return record;
  }
  return Promise.reject('errorrrrrrrr');
};

users.authenticateBasic = async function (username, password) {
  console.log('username',username);
  console.log('password',password);
  let userdata = await modulesq.read(username);
  console.log('userdata',userdata[0].password);
  let valid = await bcrypt.compare(password, userdata[0].password);
  return valid ? username : Promise.reject();
};

users.generateToken =  function (user) {
  console.log('mmmmmmmmmmmmmmmmmmmmmmm',user);
  let token =  jwt.sign({ username: user.username,
    capabilities: roles[user.role],
  }, SECRET,{expiresIn:900});
  console.log('user-model tokennnnnnnnnnnnnn',token);
  return token ;
};

users.generateTokenin =  async function (user) {
  console.log('mmmmmmmmmmmmmmmmmmmmmmm',user);

  let usersdata = await modulesq.read(user);
  console.log(usersdata[0].role);
  let token =  jwt.sign({ username: user,
    capabilities: roles[usersdata[0].role],
  }, SECRET,{expiresIn:900});
  console.log('user-model tokennnnnnnnnnnnnn',token);
  return token ;
};
users.list = async function () {
  let usersdata = await modulesq.read(undefined);
  return usersdata;
};

users.verifyToken = function (token) {
  console.log('user-module tokennnnnnnnnnnnnnnnnn',token);
  return jwt.verify(token, SECRET,function(err, decoded) {
    console.log('decode',decoded);
    if (err) {
      console.log('err>>> ', err);
      return Promise.reject(err);
    }
    let username = decoded['username'];
    let usertoken= modulesq.read(username);
    if (usertoken) {
      return Promise.resolve(decoded);
    } 
    return Promise.reject();
  });
};
users.presmission =  function (capability) {
  return (req, res, next) => {
    try {
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
module.exports = users;
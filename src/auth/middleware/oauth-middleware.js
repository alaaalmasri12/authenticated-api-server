'use strict';
require('dotenv').config();
const users = require('../models/user-model');
const superagent = require('superagent');


module.exports = async (req, res, next)=> {
  try {
    let code = req.query.code;
    console.log('1- CODE: ', code);

    let remoteToken = await exchangeCodeForToken(code);

    let remoteUser = await getRemoteUserInfo(remoteToken);

    let [user , token] = await getUser(remoteUser);
    console.log('user',user);
    console.log('token',token);
    req.user = user; 
    req.token = token;
    // console.log('local user ... ', token);
    next();

  } catch (e) {
    console.log(`ERROR: ${e}`);
    next('error');
  }

};

//
async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(process.env.tokenServerUrl).send({
    client_id : process.env.CLIENT_ID,
    client_secret : process.env.CLIENT_SECRET, 
    redirect_uri: process.env.API_SERVER,
    code: code,
  });
  let access_token = tokenResponse.body.access_token;
  console.log('______STEP 2 ____access_token ------>>>> ', access_token);
  return access_token;
}

// curl -H "Authorization: token OAUTH-TOKEN" https://api.github.com/user
async function getRemoteUserInfo(token) {
  let userResponse = await superagent
    .get(process.env.remoteUserApi)
    .set('Authorization', `token ${token}`)
    .set('user-agent', 'express-app');

  let user = userResponse.body; // will return user obj + repos
  console.log('_____STEP 3____ ', user);
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login, // this will be my email
    password: 'oauthpassword',
  };
  let savedUser = await users.save(userRecord);
  let myServerToken = users.generateToken(userRecord);
  return [savedUser, myServerToken]; // {user: user, token: token}
}




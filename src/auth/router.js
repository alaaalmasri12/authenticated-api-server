'use strict';
const express = require('express');
const router = express.Router();
const users = require('../auth/models/user-model');
const basicAuth = require('./middleware/basic');
const oath = require('../auth/middleware/oauth-middleware');
const bearerMiddleware=require('./middleware/bearer-auth');
const acl=require('./middleware/acl-auth-middleware');
const athorize=require('../auth/middleware/authorize');
router.post('/signup', (req, res)=> {
  let user = req.body;
  users.save(user).then(result => {
    let token = users.generateToken(result);
    res.status(200).send(token);
  }).catch(err=> {
    console.log('ERR!!');
    res.status(403).send('Invalid Signup! email is taken');
  });
});

router.get('/secret',bearerMiddleware, (req,res) => {
  res.status(200).json(req.user);
} );
router.post('/signin', basicAuth, (req, res)=> {
  res.send({ token: `${req.token}`,
  });
});
router.get('/users',(req, res)=> {
  users.list().then(result => {
    console.log(result);
    res.status(200).send(result);
  }).catch(err=> {
    console.log('ERR!!');
    res.status(403).send('listing error');
  });});

router.get('/oauth',oath, (req, res)=> {
  res.status(200).send(req.token);
});
router.get('/:model', bearerMiddleware, acl('read'),(req, res,next)=> {
  console.log('asdasdad',req.model);
  req.model.read()
    .then(result => {
      let count = result.length;
      res.json({count, result});
    }).catch(next);});


router.post('/:model', bearerMiddleware, acl('create'),(req, res,next)=> {
  req.model
    .create(req.body)
    .then(record =>
      res.json(record))
    .catch(next);
});
router.put('/:model/:id', bearerMiddleware, acl('update'), (req, res,next)=> {
  let id = req.params.id;
  req.model
    .update(id,req.body)
    .then(record => res.json(record))
    .catch(next);});
router.delete('/:model/:id', bearerMiddleware, acl('delete'), (req, res,next)=> {
  let id=req.params.id;
  req.model
    .delete(id)
    .then(record=>res.status(200).json(record))
    .catch(next);});
router.param('model', getModel);
const catagories = require('../../lib/models/categories/categories.model');
const products = require('../../lib/models/products/products.model');
function getModel(req, res, next) {
  let model = req.params.model;
  switch(model) {
  case 'products':
    console.log('alaaaa');
    console.log(model);
    req.model = products;
    next();
    return;
  case 'catagories':
    req.model = catagories;
    next();
    return;
  default:
    next('Invalid Model entry');
    return;
  }
}
module.exports = router;

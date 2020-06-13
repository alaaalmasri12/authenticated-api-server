'use strict';

const express = require('express');
const app = express();

app.use(express.static('./src/public'));
const morgan = require('morgan');

app.use(express.json()); // body
app.use(morgan('dev'));
const routeapi=require('./router');
app.use(routeapi);
module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => { console.log(`Listening on port ${port}`); });
  },
};
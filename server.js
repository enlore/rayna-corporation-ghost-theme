/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

var path = require('path');
var ghost = require('./ghost-middleware.js');

const express = require('express')
const app = express()

//ghost({
  //config: path.join(__dirname, 'config.js')
//}).then(function (ghostServer) {
  //ghostServer.start();
//});

app.post('/ask-rayna', (req, res, next) => {
    if (req.body['domo-arigato-mr-roboto'] !== void 0)
        return res.end()

    return res.end()
})

app.use('/', ghost({
    config: path.join(__dirname, 'config.js')
}))

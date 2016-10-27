/*jshint  esnext: true */
'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config();
const winston = require('winston');

var env = process.env;
winston.level = 'info';

// CORS without domain restriction
io.origins('*:*');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Scokets
io.on('connection', function(socket){
  winston.info('a user connected');

  socket.on('CLIENT_MESSAGE', function(msg){
    winston.info(msg);
    socket.broadcast.emit('SERVER_MESSAGE', msg);
  });

  socket.on('disconnect', function(){
    winston.info('a user disconnected');
  });

});

// Bring up the server
http.listen(env.APP_PORT, function(){
  winston.info('listening on '+env.APP_PORT);
});


/*
msg = {
  type: 'group',
  id: '67',
  payload: {
    type: 'text',
    data: 'this is a clipboard example'
  }
}
*/

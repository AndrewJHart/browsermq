#!/usr/bin/env node
var broker = require('../lib/broker').subscribe;
var config = require('../lib/config').config;

var io = require('socket.io').listen(config.port);


io.sockets.on('connection', function (socket) {
  socket.on('subscribe_queue', function(data) {
    subscribe(socket, io.sockets, data);
  });
});


console.log(io.sockets);

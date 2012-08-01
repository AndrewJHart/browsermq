#!/usr/bin/env node
var broker = require('../lib/broker');
var config = require('../lib/config').config;

var io = require('socket.io').listen(config.port);

broker.init()

io.sockets.on('connection', function (socket) {
  socket.on('subscribe_queue', function(data) {
    broker.subscribe(socket, io.sockets, data);
  });
});


console.log(io.sockets);

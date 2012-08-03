#!/usr/bin/env node
var broker = require('../lib/broker');
var config = require('../lib/config').config;
var app = require('express').createServer()
var io = require('socket.io').listen(app, config.port);

app.listen(config.monitor_port);

app.get('/health-check', function(req, res){
  console.log(broker.ready);
  if(broker.ready){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('ok');
    res.end();
  }
  else {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('broker not ready');
    res.end();
  }
});

app.get('/monitor', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(Object.keys(io.sockets.manager.open).length.toString());
  res.end();
});

broker.init();

io.sockets.on('connection', function (socket) {
  socket.on('subscribe_queue', function(data) {
    broker.subscribe(socket, io.sockets, data);
  });
});

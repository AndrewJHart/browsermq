#!/usr/bin/env node
var http = require('http')
var socket = require('socket.io')
var fs = require('fs')

var subscribe = require('../lib/subscribe').subscribe

var app = http.createServer(handler)
app.listen(8000);
var io = socket.listen(app)


function handler (req, res) {
  console.log(__dirname)
  fs.readFile(__dirname + '/../static/index.html',
  function (err, data){
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


io.sockets.on('connection', function (socket) {
  socket.on('subscribe_queue', function(data) {
    subscribe(socket, io.sockets, data);
  });
});


console.log(io.sockets);

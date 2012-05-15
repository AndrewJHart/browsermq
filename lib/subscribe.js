var socket = require('socket.io');
var util = require('util');
var qlib = require('./queue');

var queues = {};

exports.subscribe = function (socket, sockets, routing_key) {
  socket.join(routing_key);
  //if this is the first time we see this queue add it
  if(!queues[routing_key]){
    queues[routing_key] = qlib.create_queue(routing_key);
    q = queues[routing_key];
    q.subscribe(function(message, headers, deliveryInfo){
      util.debug("recieved a message for queue: " + q.name + "/nMessage " + message + "/nDinfo: " + deliveryInfo);
      sockets.in(routing_key).emit(routing_key, message);
    });
  }
};

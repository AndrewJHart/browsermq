var socket = require('socket.io');
var util = require('util');
var amqp = require('amqp');

var config = require('./config');

// for now just hardcode the conn here
var conn = amqp.createConnection();
conn.on('ready', function(){ console.log("amqp connection ready");});


// for now just one topic exchange
// we'll eventually want more but how they're structured
// won't really make sense until work begins on the producer
var exchange_name = "browsermq_global";
var exchange;


conn.on('ready', function(){
    console.log("created exchange");
    //TODO: check if the exchange exists
    exchange = conn.exchange(exchange_name, function(exch){
      console.log("created exchange");
    });
});

//I don't intend to use this but it will make testing easier for now
publish = function(routing_key, message){
  exchange.publish(routing_key, [message], {contentType: "application/json"});
};



// this will create a new queue each time it's called
// TODO fix that
create_queue = function(routing_key){
  return conn.queue("browsermq_" + routing_key, function(q){
    q.bind(exchange, routing_key);
    console.log("created " + q.name + " and bound to " + routing_key);
  });
};
var queues = {};

subscribe = function (socket, sockets, routing_key) {
  socket.join(routing_key);
  //if this is the first time we see this queue add it
  if(!queues[routing_key]){
    queues[routing_key] = create_queue(routing_key);
    q = queues[routing_key];
    q.subscribe(function(message, headers, deliveryInfo){
      util.debug("recieved a message for queue: " + q.name + "/nMessage " + message + "/nDinfo: " + deliveryInfo);
      sockets.in(routing_key).emit(routing_key, message);
    });
  }
};

exports.subscribe = subscribe
exports.create_queue = create_queue
exports.publish = publish

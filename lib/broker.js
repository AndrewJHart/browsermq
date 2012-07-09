var socket = require('socket.io');
var util = require('util');
var amqp = require('amqp');

var config = require('./config').config;

// for now just hardcode the conn here
var conn;
var exchanges = {};
var queues = {};

// this sets up the ampq exception and default exchange.
// UNTESTED
exports.init = function (){
    conn = amqp.createConnection({url: config.broker_url});
    conn.on('ready', function(){ util.debug("amqp connection ready");});

    // set up the default exchange when the connection is ready
    conn.on('ready', function(){
        //Set this twice so both ways of accessing it get the same object
        console.log(config.exchange);
        exchanges['default'] = exchanges[config.exchange] = conn.exchange(config.exchange, function(exch){
          util.debug("created default exchange");
        });
    });
};

//I don't intend to use this but it will make testing easier for now
var publish = function(routing_key, message){
  exchange = exchanges.default;
  exchange.publish(routing_key, [message], {contentType: "application/json"});
};


// this will create a new queue each time it's called
// TODO fix that
var create_queue = function(routing_key){
  exchange = exchanges['default'];
  console.log(exchange);
  return conn.queue("browsermq_" + routing_key, function(q){
    console.log("ABOUT TO BIND");
    console.log(exchange);
    q.bind(exchange, routing_key);
    util.debug("created " + q.name + " and bound to " + routing_key);
  });
};

var subscribe = function (socket, sockets, routing_key) {
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
exports.exchanges = exchanges

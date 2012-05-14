var amqp = require('amqp');

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
exports.publish = function(routing_key, message){
  exchange.publish(routing_key, message);
};

// this will create a new queue each time it's called
// TODO fix that
exports.create_queue = function(routing_key){
  return conn.queue("browsermq_" + routing_key, function(q){
    q.bind(exchange, routing_key);
    console.log("created " + q.name + " and bound to " + routing_key);
  });
};

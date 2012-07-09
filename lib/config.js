// This will not play well with other packages but it will work for now.
var _ = require('underscore');
var config_file = process.env.BROWSERMQ_SETTINGS;
var config = {
  exchange: 'browsermq_global',
  broker_url: 'amqp://guest:guest@localhost:5672/',
  port: '8008'
};

if(config_file){
  _.each(require(config_file).config, function (val, key) {config[key]=val;})
}

exports.config = config;


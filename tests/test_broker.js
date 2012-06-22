var nodemock = require('nodemock');
var sandboxed = require('sandboxed-module');

module.exports = {
  setUp: function (cb){
    this.broker = sandboxed.require('../lib/broker', {
      requires: {'socket.io': {fake: 'socket.io module',}, amqp: {fake: 'amqp module'}}})
    }
}

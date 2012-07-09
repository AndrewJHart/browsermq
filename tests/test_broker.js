var nodemock = require('nodemock');
var sandboxed = require('sandboxed-module');

var fake_ampq = {};
var fake_socketio = {};

// I'm not sure if this is a good way to deal with mocks but let's try it out/
// addMock takes and object and a name a 
var addMock = function addMock (obj, name, ) {
    mock_name = "mock_" + name;
    obj[mock_name] = nodemock.mock(name);
    obj[name] = obj[mock_name][name];
}

addMock(fake_ampq, 'createConnection');
fakeqmpq.return

module.exports = {
  setUp: function (cb){
    var fake_amqp = {};
    addMock(fake_amqp, 'createConnection');
    addMock(fake_amqp, '
    this.broker = sandboxed.require('../lib/broker', {
      requires: {'socket.io': {fake: 'socket.io module',}, amqp: {fake: 'amqp module'}}})
}

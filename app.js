var app = require('./index.js');
var express = require("express")
var debug = require('debug')('mean-app:server');
var http = require('http');
var normalizePort = require('normalize-port');
var path = require('path');


var port = normalizePort(process.env.PORT || '4300');

// app.use(express.static(__dirname + '/dist/my-app'));
// app.get('/*',(req, res) => res.sendFile(path.join(__dirname)));
// app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  debug('Listening on ' + port);
}
var express = require('express');
var amqp = require('amqplib/callback_api');
var http = require('http');
var server = http.createServer(function(request, response) {});

var queue = 'GIG';
var count = 0;
var clients = {};

server.listen(8282, function() {
    console.log('Publisher started on port 8282');
});

var WebSocketServer = require('websocket').server;
	wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(req){
	var connection = req.accept('echo-protocol', req.origin);
	var id = count++;
	clients[id] = connection
	console.log('Connection accepted [' + id + ']');
});


amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
    
    ch.assertQueue(queue, {durable: false});
    ch.consume(queue, function(data) {
	  var message = data.content;
	  console.log("Queue [%s] - Received message %s", queue, message);
	  publishMessage(message);      
    }, {noAck: true});
  });
  });

function publishMessage(message) {
	console.log("Publishing message: %s", message);	
	for(var i in clients){
		clients[i].sendUTF(message);
	}
}





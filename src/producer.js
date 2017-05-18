var express = require('express');
var amqp = require('amqplib/callback_api');
var app = express();
var channel = null;
var queue = 'GIG';

app.post('/send/:message', function (req, res) {
   var message = req.params.message;
   sendMessageToQueue(message);
})

var server = app.listen(8081, function () {
  var port = server.address().port
  console.log("Producer started on port: %s", port)

})

amqp.connect('amqp://localhost', function(err, conn) {
	channel = conn.createChannel(function(err, ch) {    
    ch.assertQueue(queue, {durable: false});
  });
});

function sendMessageToQueue(message) {
	if (channel != null) {		
		channel.sendToQueue(queue, new Buffer(message.toString()));
		console.log("Queue [%s] - Sending message %s", queue, message);
	} else {
		console.log("Error: Channel not initialised");
	}
};



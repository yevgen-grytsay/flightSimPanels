/*jshint devel:true, node:true, strict:false */
/*global require:true */

var express = require("express"),
	path = require("path"),
	dgram = require('dgram'),
	http = require("http"),
	MeasureFactory = require('./services/MeasureFactory'),
	notFound = require('./lib/middleware/notFound'),
	app = express();

var server;
var measures = {};
var socket;
// var sio = require('socket.io');
var io;
var setting;

app.configure(function() {
	app.use(express.logger("dev")); //short,tiny,dev
	app.use(express.bodyParser());
	app.use(express['static'](path.join(__dirname, 'public')));
});

app.get('/heartbeat',  function(req, res) {
	res.json(200, 'OK');
});
app.use(notFound.index);

server = http.createServer(app);
// io = sio.listen(server);

require('./routes/assetsRoutes').init(app);
require('./routes/widgetsRoutes').init(app);
// require('./routes/testMessages').init(app, io);

//Initialise Measures Factory
MeasureFactory.init();

//Create Receiving UDP Socket
// socket = dgram.createSocket('udp4', onMessage);
// socket.bind(49100);

// for (setting in app.settings.socketIO) {
// 	if (app.settings.socketIO.hasOwnProperty(setting)) {
// 		io.set(setting, app.settings.socketIO[setting]);
// 	}
// }
// io.on('connection', onSIOConnect);

if (!module.parent) {
    var port = process.env.PORT || 3000;
    server.listen(port);
	console.log("FlighSimPanels server listening on port %d within %s environment", port, app.settings.env);
}

module.exports = app;

function onSIOConnect (socket) {
	socket.emit("connected", {});
	//handle client messages (if any)
}

// function onMessage ( message ) {
// 	io.sockets.emit("data:measures", {data:MeasureFactory.decodeMessage(message)});
// }

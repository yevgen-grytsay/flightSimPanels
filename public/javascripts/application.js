// place your application-wide javascripts here
tash.namespace( 'Gauges.Widgets' );

(function(){
	var id = 0;
	Gauges.Widgets.nextId = function() {
		return "widget_" + id++;
	};

	Gauges.data = {
		measures: {}  //will contain data(array of measures)
	};

}());

jQuery(document).ready( function($) {
	// Gauges.socket = io.connect( document.location.protocol, '//' + document.location.hostname );


	var exampleSocket = new WebSocket("ws://localhost:3001");
	exampleSocket.onopen = function (event) {
		Gauges.events.AppReady.publish({
			widgetsContext:'#widgets'
		});

		setInterval(function () {
			exampleSocket.send("ping");
		}, 500);

	};

	// Gauges.socket.on('connected', function (data) {
	//     //emit inited application signal
	//     Gauges.events.AppReady.publish({
	//     	widgetsContext:'#widgets'
	//     });
	// });

	exampleSocket.onmessage = function (event) {

		if (event.data.indexOf('data:measures') === -1) {
			return;
		}

		// try {
			const message = JSON.parse(event.data);
		// } catch (e) {
		// 	console.log(event.data);
		// 	return;
		// }
		// console.log(data);

		if (message.name !== 'data:measures') {
			return;
		}

		Gauges.data.measures = message.args[0].data;
		Gauges.events.MeasuresUpdate.publish(Gauges.data.measures);
	};

	// Gauges.socket.on('data:measures', function(data) {
	//   	//put the measures in a global bus and signal all widgets
	//   	Gauges.data.measures = data.data;
	//   	Gauges.events.MeasuresUpdate.publish(Gauges.data.measures);
	// });
});
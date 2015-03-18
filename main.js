/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
/*global */

var mraa = require("mraa"),
five = require("johnny-five"),
Edison = require("edison-io"),
events = require('events'),
_button = require('./button'),
_led = require('./display'),
_stateManager = require('./state-manager');

var board = new five.Board({	
	io: new Edison()
});

var event_emitter = new events.EventEmitter();
var button = new _button(mraa, board, event_emitter);
var led = new _led(five, board, event_emitter);
var manager = new _stateManager(event_emitter);

console.log("MRAA Version: " + mraa.getVersion()); 

/* Poll button for clockwise / counterclockwise turn events 
 * as well as button clicks and long presses
 */
function pollButton() {
	button.poll();
	setTimeout(pollButton, 10); 
}

/* Update display when led's are initialized
 */
function updateDisplay() {
	if(led.ready) {
		manager.display();
	}
	setTimeout(updateDisplay, 500);
}

updateDisplay();
pollButton();







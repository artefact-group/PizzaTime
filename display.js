var five,
moment = require('moment'),
_ascii = require('./ascii');

function Display(_five, _board, _event_emitter) {
	five = _five;
	var self = this;
	this.event_emitter = _event_emitter;
	this.ready = false;
	this.board = _board;
	
	this._display =  [];
	this.led_0 = null;
	this.led_1 = null;
	this.led_2 = null;
	this.led_3 = null;
	
	this.ascii = new _ascii();
	this._addresses = [0x70, 0x71, 0x72, 0x73];

	this._led = [
		new five.Led.Matrix({ addresses: [this._addresses[3]], controller: "HT16K33", dims: "8x16", rotation: 4 }),
		new five.Led.Matrix({ addresses: [this._addresses[2]], controller: "HT16K33", dims: "8x16", rotation: 4 }),
		new five.Led.Matrix({ addresses: [this._addresses[1]], controller: "HT16K33", dims: "8x16", rotation: 4 }),
		new five.Led.Matrix({ addresses: [this._addresses[0]], controller: "HT16K33", dims: "8x16", rotation: 4 })
	];

	// When the board is ready, update the ready variable to know when we can start displaying pixels
	this.board.on("ready", function() {
		self.ready = true;
	});

	/* updateDisplay
	 * Draw what ever pixels are sent in bitArray. Make sure the bitArray
	 * is valid for the led matrix ( sets a value for every pixel ).
	 */
	this.event_emitter.on('updateDisplay', function(bitArray) {
		self.draw(bitArray);
	});

};

/* draw
 * Given a valid bit array (16 x 32) assign bits to each led display and draw them. 
 */
Display.prototype.draw = function(bitArray) {
	this._display = this._display.concat(bitArray);
	
	this.led_3 = this._display.splice(0-8);
	this.led_2 = this._display.splice(0-8);
	this.led_1 = this._display.splice(0-8);
	this.led_0 = this._display.splice(0-8);

	this._led[0].draw(this.led_3);
	this._led[1].draw(this.led_2);
	this._led[2].draw(this.led_1);
	this._led[3].draw(this.led_0);
};

module.exports = Display;
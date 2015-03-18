var mraa, board;

function Button(_mraa, _board, _event_emitter) {
	mraa = _mraa;
	board = _board;
	this.event_emitter = _event_emitter;
	
	this.ap3 = new mraa.Gpio(4);
	this.ap2 = new mraa.Gpio(3);
	this.ap1 = new mraa.Gpio(2);
	
	this.last_encoded = 0
	this.encoder_value = 0;
	this.debounce = 0;

	this.beingPushed = false;
	this.holdThreshold = 40;
	this.hold = 0;

	this.ap1.dir(mraa.DIR_IN);
	this.ap2.dir(mraa.DIR_IN);
	this.ap3.dir(mraa.DIR_IN);
};

/* poll
 * Poll the button to sense if / when a button click is detected, a long press (home) is detected
 * a clockwise turn or counterclockwise turn is detected.
 */
Button.prototype.poll = function() {

	var push = this.ap3.read();

	/* If no push is sensed then button is currently being pushed
	 * While being pushed increment the hold 
	 */
	if(!push) {
		this.hold++;
		this.beingPushed = true;
	} else if( this.beingPushed ) {
		// The button has been released if hold is beyond a given threshold
		// detect a hold (home), otherwise detect a click. 
		this.beingPushed = false;
		if( this.hold >= this.holdThreshold ) {
			this.event_emitter.emit('home');
			this.hold = 0;
		} else if (this.hold < this.holdThreshold ){
			this.event_emitter.emit('click');
			this.hold = 0;
		}
	}

	var MSB = this.ap1.read();
	var LSB = this.ap2.read();
	//converting the 2 pin value to single number
	var encoded = (MSB << 1) |LSB; 
	//adding it to the previous encoded value
  var sum  = (this.last_encoded << 2) | encoded; 

	if(sum == 13 || sum == 4 || sum == 2 || sum == 11) {
		if( this.debounce > 0 ) {
			this.event_emitter.emit('clockwise');
			this.encoder_value ++;
			this.debounce = 0;
		} else {
			this.debounce++;
		}
	} 
	
	if(sum == 14 || sum == 7 || sum == 1 || sum == 8 ) {
		if( this.debounce < 0 ) {
			this.event_emitter.emit('counterclockwise');
			this.encoder_value --;
			this.debounce = 0;
		} else {
			this.debounce--;
		}
	}
	this.last_encoded = encoded;
};

module.exports = Button;

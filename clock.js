var moment = require('moment');

function Clock(_event_emitter, _ascii) {
	var self = this;
	this.event_emitter = _event_emitter;
	this.type = "Clock";
	this.states = [];
	this.ascii = _ascii;
	this.current_time = null;
	this.time = null;
	// Update utc offset depending on location
	this._utc_offset = -420;
	
	/* displayHomeScreen
	 * Update the current time and update the display with the current time. 
	 */
	this.displayHomeScreen = function() {

		self.time = moment().utcOffset(self._utc_offset).format('hh:mm A').toLowerCase();
		if(!self.current_time || self.current_time !== self.time) { 
			self.current_time = self.time; 
		}
		
		/* self.ascii.displayTime transform a date string such as '12:30 pm' into the 
		 * correct bitarray. Then send that bit array to the display. 
		 */
		self.event_emitter.emit('updateDisplay', self.ascii.displayTime(self.time));
	};

	this.home = function () {};
	this.click = function() {};
	this.clockwise = function() {};
	this.counterclockwise = function() {};
};

module.exports = Clock;

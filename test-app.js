var app = require('./app');

function TestApp(_event_emitter, _ascii) {
	var self = this;
	this.app = new app(this);
	this.event_emitter = _event_emitter;
	this.type = "testApp";
	this.ascii = _ascii;
	/* Create app states here. Each state should have an identifying name, along with a pixels value
	 * which corresponds to a valid bitArray that will be drawn for that state. 
	 * 
	 * States can have nested states if you want to drill down to multiple levels. On a device like
	 * this it is recommended to keep apps fairly shallow. 
	 * 
	 * Each state can also have a disableDial attribute which defaults to false, which will disable
	 * clockwise and counterclockwise events at that state level. 
	 */
	this.states = [{
			name: 'option 1',
			pixels: this.ascii.test_app_option_1,
			states: []
		},{
			name: 'option 2',
			pixels: this.ascii.test_app_option_2,
			states: []
		},{
			name: 'option 3',
			pixels: this.ascii.test_app_option_3,
			states: [{
				name: 'test',
				pixels: this.ascii.test_app_option_3_test
			}]
	}];
	
	/* onHome
	 * Calls app.homeUpdateState which will iterate through all 'active' or visited states, 
	 * clear their app state and then redirect back to the home screen. 
	 */
	this.event_emitter.on('home', function() {
		self.app.homeUpdateState();
	});
	
	/* displayHomeScreen
	 * Broadcast home screen bitArray to the display. 
	 */
	this.displayHomeScreen = function() {
		self.event_emitter.emit('updateDisplay', self.ascii.test_app);
	};
	
	/* click
	 * Calls app.updateState() which iterates through all 'active' or visited states, determines
	 * if the state the user is on has a nested state. If it does have a nested state it sends that
	 * back as activeState if not it sends back the deepest 'active' state the user has navigated to. 
	 */
	this.click = function() {
		this.app.updateState('click', function (activeState) {
			self.event_emitter.emit('updateDisplay', activeState.pixels);
		});
	};

	/* clockwise
	 * Calls app.updateState() which iterates through all 'active' or visited states, determines
	 * if the state the user is on has any peer states that are available to cycle through. Returns
	 * the next available peer state. If none are available it returns the current state. 
	 */
	this.clockwise = function() {
		self.app.updateState('clockwise', function (activeState) {
			self.event_emitter.emit('updateDisplay', activeState.pixels);
		});
	};

	/* counterclockwise
	 * Calls app.updateState() which iterates through all 'active' or visited states, determines
	 * if the state the user is on has any peer states that are available to cycle through. Returns
	 * the next available peer state. If none are available it returns the current state. 
	 */
	this.counterclockwise = function() {
		self.app.updateState('counterclockwise', function (activeState) {
			self.event_emitter.emit('updateDisplay', activeState.pixels);
		});
	};
};

module.exports = TestApp;

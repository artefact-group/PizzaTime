var _clock = require('./clock');
var _pizza = require('./pizza');
var _testApp = require('./test-app');
var _ascii = require('./ascii');


/* State Manager
 * Manage root navigation - switching between all available apps and delegating events to active 
 * apps. It manages the navigation state for the clock. 
 */

function StateManager(_event_emitter) {
	var self = this;
	this.event_emitter = _event_emitter;
	this.ascii = new _ascii;
	/* Initialize applications here and add them to the apps array. 
	 * 
	 * If an applicaiton is active then a user has clicked into that app while it was visible
	 * all events are delegated to the app if this is the case. 
	 * 
	 * Otherwise loop through apps array displaying one visible app at a time. A visible app
	 * displays it's homescreen until it is clicked into. 
 	 */
	var testApp = new _testApp(_event_emitter, this.ascii);
	var clockApp = new _clock(_event_emitter, this.ascii);
	var pizzaApp = new _pizza(_event_emitter, this.ascii);

	this.apps = [clockApp, pizzaApp, testApp];
	this.activeApp = null;
	this.visibleApp = this.apps[0];
	this.currentAppIndex = 0;
	
	
	/* onClockwise
	 * On clockwise event if we have an active app - an app that we have clicked into
	 * then delegate the clockwise event handling to that app, otherwise update the 
	 * visible app and display the homescreen for that app. 
 	 */
	this.event_emitter.on('clockwise', function() {
		if( self.activeApp ) {
			self.activeApp.clockwise();
		} else {
			self.currentAppIndex = ( self.currentAppIndex + 1 >= self.apps.length ) ? 0 : self.currentAppIndex + 1;
			self.visibleApp = self.apps[self.currentAppIndex];
		}
		self.display();
	});
	
	
	/* onCounterClockwise
	 * On counterclockwise event if we have an active app - an app that we have clicked into
	 * then delegate the counterclockwise event handling to that app, otherwise update the 
	 * visible app and display the homescreen for that app. 
 	 */
	this.event_emitter.on('counterclockwise', function() {
		if( self.activeApp ) {
			self.activeApp.counterclockwise();
		} else {
			self.currentAppIndex = ( self.currentAppIndex - 1 < 0 ) ? self.apps.length - 1 : self.currentAppIndex - 1;
			self.visibleApp = self.apps[self.currentAppIndex];
		}
		self.display();
	});
	
	
	/* onClick
	 * On click event if we have an active app then delegate the event handling to that app. 
	 * Otherwise if the visible app is valid - meaning it has multiple states to 'click' into then 
	 * set the visible app to the active app and delegate the click event. 
 	 */
	this.event_emitter.on('click', function () {

		if( !self.activeApp ) {
			var validApp = self.visibleApp.states && self.visibleApp.states.length > 0;
			if( validApp ) {
				self.activeApp = self.visibleApp;
				self.activeApp.click();
			}
		} else {
			self.activeApp.click();
		}
		
	});
	
	
	/* onHome
	 * On home event clear the active app and reset state to point to the visible app - in this case
	 * point it to the clock as the home app.
 	 */
	this.event_emitter.on('home', function () {
		self.activeApp = null;
		self.currentAppIndex = 0;
		self.visibleApp = self.apps[self.currentAppIndex];
	});
	
	
	/* display
	 * If there is no active app - we are on the root level displaying all apps then delegate 
	 * to the visible app to display it's home screen. 
	 */
	this.display = function() {
		if( !this.activeApp ) {
			this.visibleApp.displayHomeScreen();
		}
	};
};


module.exports = StateManager;

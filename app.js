function App(instance) {
	var appInstance = instance;
	
	/* updateState
	 * takes an event name as a string and a callback function. 
	 * i.e. ( updateState('click', function (activeState) {}); ) 
	 * 
	 * Iterate through app active states - states that a user has already clicked to - and find the 
	 * deepest level they have navigated to. Pass that along to an event specific update function
	 * i.e. ( updateState('click', function (activeState) {}); --> clickUpdateState(state, callback) )
	 */
	this.updateState = function (event, callback) {
		var state = appInstance,
		parentState = null, 
		updateFunction = event + 'UpdateState';

		while( state.activeState ) {
			parentState = state;
			state = state.activeState;
		}

		if(event === "clockwise" || event === "counterclockwise") {
			this[updateFunction](parentState, callback);
		} else {
			this[updateFunction](state, callback);
		}
	};

	/* clickUpdateState
	 * Send in deepest active state and callback from updateState(). 
	 * If the state has more nested states set the first one to be active and return the nested state. 
	 * Otherwise return the state if it has no more nested states. 
	 */
	this.clickUpdateState = function(state, callback) {
		if( !state ) { return; }
		
		state.activeStateIndex = 0;
		if(state.states && state.states.length > 0) {
			state.activeState = state.states[state.activeStateIndex];
		}
		
		var returnState = (state.activeState) ? state.activeState : state;
		callback(returnState);
	};

	/* homeUpdateState
	 * Similar to updateState - iterate down the chain of active states invalidating
	 * each one as we go, so the next time we visit this app it has no history of where
	 * we previously were. 
	 */
	this.homeUpdateState = function() {
		var state = appInstance;
		
		while( state.activeState ) {
			parentState = state;
			state = state.activeState;
			parentState.activeState = null;
			parentState.activeStateIndex = 0;
		}
	};

	/* clockwiseUpdateState
	 * Send in the parent of the deepest active state and callback from updateState(). 
	 * We want the parent of the deepest active state so that we can iterate through it's peers to show
	 * any other states at the current level. If there is any other peers that this level return them, 
	 * otherwise send back the active state. 
	 */
	this.clockwiseUpdateState = function(state, callback) {
		if( !state || state.activeState.disableDial ) { return; }
		if( state.states && state.states.length > 0 ) {
			state.activeStateIndex = (state.activeStateIndex + 1 >= state.states.length) ? 0 : state.activeStateIndex + 1;
			state.activeState = state.states[state.activeStateIndex];
		}
		
		var returnState = (state.activeState) ? state.activeState : state;
		callback(returnState);
	};

	/* counterclockwiseUpdateState
	 * Send in the parent of the deepest active state and callback from updateState(). 
	 * We want the parent of the deepest active state so that we can iterate through it's peers to show
	 * any other states at the current level. If there is any other peers that this level return them, 
	 * otherwise send back the active state. 
	 */
	this.counterclockwiseUpdateState = function(state, callback) {
		if( !state || state.activeState.disableDial) { return; }

		if( state.states && state.states.length > 0 ) {
			state.activeStateIndex = (state.activeStateIndex - 1 < 0) ? state.states.length - 1 : state.activeStateIndex - 1;
			state.activeState = state.states[state.activeStateIndex];
		}
		var returnState = (state.activeState) ? state.activeState : state;
		callback(returnState);
	};

}

module.exports = App;

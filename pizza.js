var dominos = require('dominos');
var app = require('./app');

function Pizza(_event_emitter, _ascii) {
	var self = this;
	this.app = new app(this);
	this.ascii = _ascii;
	this.event_emitter = _event_emitter;
	this.type = "pizza";
	this.pepperoni = 'P_14SCREEN';
	this.cheese = '14SCREEN';
	
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
			name: 'pepperoni',
			pixels: this.ascii.pepperoni_pizza,
			states: [{
				name: 'order',
				pixels: this.ascii.order_confirmation,
				states: [{
					name: 'pizzaTime',
					pixels: self.ascii.pizza_time,
					event: 'orderCheese',
					disableDial: true
				}]
			}]
		}, {
			name: 'cheese',
			pixels: this.ascii.cheese_pizza,
			states: [{
				name: 'order',
				pixels: this.ascii.order_confirmation, 
				states: [{
					name: 'pizzaTime',
					pixels: self.ascii.pizza_time,
					event: 'orderPepperoni',
					disableDial: true
				}]
			}]
		}];
	
	/* onHome
	 * Calls app.homeUpdateState which will iterate through all 'active' or visited states, 
	 * clear their app state and then redirect back to the home screen. 
	 */
	this.event_emitter.on('home', function() {
		self.app.homeUpdateState();
	});
	
		/* click
	 * Calls app.updateState() which iterates through all 'active' or visited states, determines
	 * if the state the user is on has a nested state. If it does have a nested state it sends that
	 * back as activeState if not it sends back the deepest 'active' state the user has navigated to. 
	 */
	this.click = function () {
		self.app.updateState('click', function (activeState) {
			
	
			if( activeState.name === 'pizzaTime' ) {
				
			 /* Emit event to order pepperoni or cheese pizza depending on the screens selected */
			 self.event_emitter.emit(activeState.event);
				
			 /* For demonstration purposes if we have reached the pizzaTime state run through the 
			  * states of ordering a pizza. Update states after certain timeouts to show the progression
			  * of states. DisableDial set to true at this state to stop clockwise / counterclockwise from
			  * messing up the demo. 
			  */				
				self.event_emitter.emit('updateDisplay', activeState.pixels);
				
				setTimeout(function() {
					self.event_emitter.emit('updateDisplay', self.ascii.pizza_in_oven);
					pizza_delivery();
				}, 5000);
				
				function pizza_delivery() {
					setTimeout(function() {
						self.event_emitter.emit('updateDisplay', self.ascii.pizza_delivery);
						return_home();
					}, 5000);
				};
				
				function return_home() {
					setTimeout(function () {
						self.event_emitter.emit('home');
					}, 5000);
				};
				
			} else {
				self.event_emitter.emit('updateDisplay', activeState.pixels);
			}
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

	/* displayHomeScreen
	 * Broadcast home screen bitArray to the display. 
	 */
	this.displayHomeScreen = function() {
		self.event_emitter.emit('updateDisplay', self.ascii.pizza_time);
	};
	
	/* onOrderPepperoni
	 * call order() with the domino's code for pepperoni pizza
	 */
	this.event_emitter.on('orderPepperoni', function() {
		self.order(self.pepperoni);
	});
	
	/* onOrderCheese
	 * call order() with the domino's code for cheese pizza
	 */
	this.event_emitter.on('orderCheese', function() {
		self.order(self.cheese);
	});
	
	/* order
	 * Calls dominos API with data entered in pizzaData. It will find the closest store given the
	 * address and zip code. Once it finds a valid store it creates an order with a pizza code passed
	 * in as pizza_type. Once the order is created and validated it prices the order, applies 
	 * the payment information and places the order. Will emit 'pizzaOrderFailed' on failure and 
	 * 'pizzaOrderSuccess' on success. 
	 */
	this.order = function( pizza_type ) {
		var pizzaData = {
			phone: '1234567890',
			firstName: 'Nick',
			lastName: 'Alto',
			email: 'nick@artefactgroup.com',
			address1: '619 Western Ave.',
			address2: 'Suite #500',
			city: 'Seattle',
			state: 'WA',
			zip: '98104',
			payment: {
				type: 'VISA',
				number: '',
				expiration: '',
				cvv: '',
				zip: ''
			}
		};
		var order = new dominos.class.Order();
		order.Order.Phone = pizzaData.phone; 
		order.Order.FirstName = pizzaData.firstName;
		order.Order.LastName = pizzaData.lastName;
		order.Order.Email = pizzaData.email;

		//address to search for nearby stores
		dominos.store.find((pizzaData.address1 + ', ' + pizzaData.zip), function(storeData) {
			
			order.Order.Address.Street = pizzaData.address1 + " " + pizzaData.address2;
			order.Order.Address.City = pizzaData.city;
			order.Order.Address.PostalCode = pizzaData.zip;
			order.Order.Address.Type = 'Business';
			order.Order.StoreID = storeData.result.Stores[0].StoreID;

			createOrder( order.Order.StoreID );
		});

		function createOrder( storeID ) {
			//Get Menu for Closest Store
			//console.log(storeID);

			dominos.store.menu( storeID, function(storeData) {
				//console.log(storeData.result);
				var product = new dominos.class.Product();
				product.Code = pizza_type;
				order.Order.Products.push(product);

				//console.log(order.Order.Products)
				//validate order
				dominos.order.validate( order, validatedOrder );
			});
		};

		function validatedOrder(orderData){
				if(orderData.success != true){
					self.event_emitter.emit('pizzaOrderFailed');
				 	return console.log('\n###### Order Failed ######\n', JSON.stringify(orderData), '\n', '\n#########################\n\n');
				}
				order = orderData.result;
				//console.log(orderData.result);
				dominos.order.price( order, pricedOrder );
		};

		function pricedOrder( priceData ){
				//console.log(priceData.result.Order.Amounts);

				var cardInfo = new dominos.class.Payment();
				cardInfo.Amount = priceData.result.Order.Amounts.Customer;
				cardInfo.Number = pizzaData.payment.number;
				cardInfo.CardType = pizzaData.payment.type;
				cardInfo.Expiration = pizzaData.payment.expiration;
				cardInfo.SecurityCode = pizzaData.payment.cvv;
				cardInfo.PostalCode = pizzaData.payment.zip;

				order.Order.Payments.push(cardInfo);
				//console.log(order.Order.Payments)
				dominos.order.place(order,orderPlaced);
		};

		function orderPlaced( orderData ) {
				//console.log(orderData.result.Order);

				if(orderData.result.Order.Status == -1){
					console.log('\n###### Order Failed ######\n', orderData.result.Order.StatusItems,'\n', '\n#########################\n\n');
					self.event_emitter.emit('pizzaOrderFailed');
					return;
				}

				dominos.track.phone( orderData.result.Order.Phone, function( pizzaData ) {
					console.log('\n\n########################\nTracking pizza by phone\n########################\n',pizzaData,'\n############\n');
					self.event_emitter.emit('pizzaOrderSuccess', pizzaData );
				});
			
				//console.log(orderData.result.Order.StatusItems);
		};
	};
};

module.exports = Pizza;

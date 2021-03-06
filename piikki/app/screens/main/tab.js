'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
var {get, post} = require('../../api');
var ReactNative = require('react-native');
var gel = require('../GlobalElements');
var cond_input = require('../inputStyling');
import Toast, {DURATION} from 'react-native-easy-toast'
var Events = require('react-native-simple-events');
var PushNotification = require('react-native-push-notification');

var {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  AsyncStorage
} = require('react-native');

import Icon from 'react-native-vector-icons/FontAwesome';

var Tab = React.createClass({
	 getInitialState: function() {
	 	return {
	 		pricesAvailable: false,
	 		token: '',
	 		prices: {},
	 		tab: 0,
	 		total: 0.0,
	 		cart: [],
            message: '',
            otherAmount: "",
            toggled: false,
            comment: '',
            refreshing: false,
            confirmToggled: false,
            softLimit: 100,
            hardLimit: 100,
            multiplier: env.multiplier,
            condStyle: StyleSheet.create({tab:{'color':'#000000'}})
	 	}
	 },
	 inputFocused (refName) {
	    setTimeout(() => {
	      let scrollResponder = this.refs.scrollView.getScrollResponder();
	      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
	        ReactNative.findNodeHandle(this.refs[refName]),
	        110, //additionalOffset
	        true
	      );
	    }, 50);
	  },
	 refresh: async function() {
	 	this.setState({'refreshing': true});
	    await this.getPrices();
	    this.setState({'refreshing': false});
	 },
	 componentDidMount: function() {
	 	this.getPrices();
    	Events.on('TabPage', 'myID', this.refresh);

	 },
	 calcTotal: function(cart) {
    	return cart.reduce((a, b) => {
    		if (b.name === 'Misc')
    			a += b.extra ? parseFloat(b.price) * parseFloat(b.amount) * this.state.multiplier : parseFloat(b.price) * parseFloat(b.amount);
    		else
    			a += parseFloat(b.amount) * parseFloat(b.price);
    		return a;
    	}, 0);
    },

    async handleNotification(amount) {
    	var n = await AsyncStorage.getItem('notifications');
    	if (n === 'true' || n === null) {
	    	PushNotification.localNotification({
	          /* Android Only Properties */
	          id:'1337',
	          ticker: "Account balance low!", // (optional)
	          autoCancel: true, // (optional) default: true
	          largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
	          smallIcon: "ic_notif", // (optional) default: "ic_notification" with fallback for "ic_launcher"
	          vibrate: false, // (optional) default: true
	          tag: 'beer', // (optional) add tag to message
	          ongoing: false, // (optional) set whether this is an "ongoing" notification

	          /* iOS and Android properties */
	          title: "Where's my money bitch?", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
	          message: "Account balance getting dangerously low: " + amount + "€", // (required)
	          playSound: false, // (optional) default: true
	        });
        }
    },
	commitCart: async function() {
        this.setState({message: ""});
		var cart = {};
        if(this.state.cart.length === 0) {
            this.setState({message: "Cart is empty!"});
            return;
        }
        var c = 0;
        var total = 0;
		this.state.cart.map((item) => {
			var name = item.name;
			if (name === "Misc") {
				name = "Misc" + c;
				c++;
			}
			total += item.amount * item.price;
			cart[name] = item.comment ? {'amount': cart[name] ? cart[name].amount + item.amount : item.amount, 'comment':item.comment} : {'amount':cart[name] ? cart[name].amount + item.amount : item.amount};
		})
		var new_cart = this.state.cart; 
		let payload = JSON.stringify(cart);
		let responseJson = await post('tab', this.props.navigator, payload, (e) => {
			this.setState({message: "Error in tabbing!"});
			this.refresh();
	      	this.refs.toast.show('Major error, try again or contact devs.', DURATION.LENGTH_LONG);
	        console.error(e);
		});
	  	if(responseJson.success) {
	      	for (let k of Object.keys(responseJson.message)) {
	             new_cart = new_cart.filter((item) => {
	             	var r = new RegExp(k, "g");
	            	return !r.test(k) && responseJson[k].success;
	            });
	      	}
	      	if (this.state.tab > this.state.softLimit && this.state.tab - this.state.total <= this.state.softLimit)
        		this.handleNotification(this.state.tab - this.state.total);
            this.setState({cart:new_cart});
            this.setState({total:this.calcTotal(new_cart)});
            this.setState({message: "Enjoy responsibly!"})
            if (new_cart.length === 0) {
            	this.refresh();
	      	}
	      	else {
	      		this.setState({message: "Error"});
	      		this.refresh();
	      		this.refs.toast.show('Error in tabbing, check cart for items.', DURATION.LENGTH_LONG);
	      		console.error(responseJson);
	      	}
	    }
	    else {
	    	this.setState({message: "Error"});
	      	this.refresh();
	      	this.refs.toast.show('Major error, contact devs.', DURATION.LENGTH_LONG);
	    }
	},

	addToCart: function(name, amnt, extra) {
		var cart = this.state.cart;
		var total = this.state.total;
		var amount = name === "Misc" ? amnt : parseFloat(this.state.prices[name]);
		var new_item = {"name": name, price: amount, amount: 1, extra: this.extraTabs(amount)};

		if(this.closedTab(amount)) {
			this.refs.toast.show('Max limit ('+this.state.hardLimit + '€) reached. Cannot tab.', DURATION.LENGTH_LONG);
			return
		}

		var items = cart.filter((item) => {return item.name === new_item.name && item.extra === new_item.extra});
		if (items.length > 0) {
			cart = cart.map((item) => {
				if (item.name === new_item.name && item.extra === new_item.extra) {
					if (item.name !== "Misc")
						item.amount = parseFloat(item.amount) + 1;
					else if (item.amount === amnt)
						item.price = parseFloat(item.price) + 1;
				}
				return item;
			});
		} else {
			new_item["price"] = new_item.extra ? new_item.price * this.state.multiplier : new_item.price;
			if (new_item.name === "Misc") {
				var p = new_item.price
				new_item.price = new_item.amount;
				new_item.amount = p;
			}
			cart.push(new_item);
		}
		this.setState({total: this.calcTotal(cart)});
		this.setState({cart: cart});
        this.setState({message: ""});
	},
	closedTab: function(amount) {
		amount = parseFloat(amount)
		if (this.extraTabs(amount)) {
			return this.state.tab - this.state.total - amount * this.state.multiplier < this.state.hardLimit;
		} else {
			return this.state.tab - this.state.total - amount < this.state.hardLimit;
		}
	},
	extraTabs: function(amount) {
		amount=parseFloat(amount)
		return this.state.tab - this.state.total - amount < this.state.softLimit;
	},
    addOtherToCart: function() {
        if(this.state.otherAmount > 0 && !this.closedTab(this.state.otherAmount)) {
            var cart = this.state.cart
            var new_item = {}
            new_item["name"] = "Misc";
            new_item["price"] = 1;
            new_item["comment"] = this.state.comment;
            new_item["amount"] = this.state.otherAmount;
            new_item["extra"] = this.extraTabs(this.state.otherAmount);
            cart.push(new_item);
            this.setState({total: this.calcTotal(cart), cart:cart, message:"", comment:""});
        	this.toggleOther();
        } else {
        	this.refs.toast.show('Max limit ('+this.state.hardLimit + '€) reached. Cannot add.', DURATION.LENGTH_LONG)
        	this.toggleOther();
        }
        
    },
	deleteCart: function(name, amnt) {
		var cart = this.state.cart;
		var total = this.state.total;
		cart = cart.map((item) => {
			if (name === item.name) {
				if (name !== "Misc")
					item.amount -= 1
				else if (item.amount === amnt)
					item.price -= 1
			}
			return item;
		});
		cart = cart.filter((item) => {return item.amount > 0 && item.price > 0});
		this.setState({total: this.calcTotal(cart)});
		this.setState({cart: cart});
        this.setState({message: ""});
	},

	getPrices: async function() {
		let responseJson = await get('prices', this.props.navigator, (e) => {
			this.setState({message: "Could not fetch prices :("});
	        console.warn(e);
		});
		let limitJson = await get('limits', this.props.navigator, (e) => {
			this.setState({message: "Could not fetch limits :("});
			console.error(e)
		})
		if (responseJson.success && limitJson) {
			this.setState({prices: responseJson.prices});
  			this.setState({tab: responseJson.tab});
  			this.setState({softLimit: limitJson.softlimit, hardLimit:limitJson.hardlimit});
  			this.setState({pricesAvailable: true});
  			this.conditionalTab();
		} else {
			this.setState({message: "Could not fetch prices :("});
		}
		
	},

	renderButtons: function(i) {
		var resp = [];
		var keys = Object.keys(this.state.prices);
		var prices = this.state.prices;
		for(var j = 0; j<2; j++) {
			var price = prices[keys[i*2+j]];
			resp.push(<View style={{flex:0.08}} key={keys[i*2+j] + " flex"}>
					</View>);
			if (price) {
				resp.push(

					<TouchableOpacity key={keys[i*2+j]} onPress={this.addToCart.bind(this,keys[i*2+j])}>
						<View style={[gel.itemBackGroundColor, styles.button]}>
							<Text style={styles.amount}>{keys[i*2+j]}</Text>
						</View>
					</TouchableOpacity>
				);
			} else {
				resp.push(
                    <TouchableOpacity key={"otherBtn"} onPress={this.toggleOther}>
						<View style={[gel.itemBackGroundColor, styles.button]}>
                        	<Text style={styles.amount}>Any</Text>
                        </View>
                    </TouchableOpacity>
	            )
			}
		}	
		return resp;
	},

	renderPrices: function() {
		if(!this.state.pricesAvailable) {
			return(<View style={{justifyContent: 'center', alignItems:'center', flex: 0.8}}>
				<ActivityIndicator style={{marginTop: 20, height: 200, width: 200}}/>
				</View>);
		}
		else {
			var resp = [];
			var total = 0;
			for (var k in this.state.prices){
				total= total + 1;
			}
			for(var i = 0; i<Math.ceil(total/2); i++) {
				resp.push(
					<View style={styles.buttonrow} key={"row " + i}>
						{this.renderButtons(i)}
						<View style={{flex:0.08}}>
						</View>
					</View>
				);
			}
			if (total % 2 === 0) {
	            resp.push(
	                <View key="moi" style={styles.collapsibleButtonrow}>
	                    <View style={{flex:0.08}} />
	                    <TouchableOpacity onPress={this.toggleOther}>
							<View style={[gel.itemBackGroundColor, styles.button]}>
	                        	<Text style={styles.amount}>Any</Text>
	                        </View>
	                    </TouchableOpacity>
	                    <View style={{flex:0.08}} />
	                </View>
	            )
	        }

			return resp;
		}

	},

	renderConfirm: function () {
		var resp = [];
		var count = 0;
		for(let item of this.state.cart) {
			count++;
			resp.push(
				<View key={item.name + count} style={{flexDirection: 'row', flex:1, height: 38}}>
					<View style={{flex:0.03}}/>
					<View style={[gel.row, {flex:1, justifyContent: 'center', alignItems: 'center'}]}>
						<Text style={styles.rowName}>{item.name}</Text>
						<View style={{flex:0.05}} />
						<Text style={[styles.rowAmount, {flex: 0.15}]}>{this.parseAmount(item)}</Text>
						<View style={{flex:0.05}}/>
						<Text style={styles.rowAmount}>{this.parsePrice(item)*this.parseAmount(item)}€</Text>
					</View>
					<View key={"pad"} style={{flex:0.03}}/>
				</View>

			);
		}
		if (this.state.cart.length > 0){
			resp.push(
				<View style={[styles.cartRow, styles.sumRow]}>
					<View style={{flex:0.03}}/>
					<View style={[gel.row, {flex:1, justifyContent: 'center', alignItems: 'center'}]}>
						<Text style={[styles.rowName, {fontWeight: 'bold'}]}>Total</Text>
						<View style={{flex:0.25}} />
						<Text style={[styles.rowAmount, {fontWeight: 'bold'}]}>{this.state.total}€</Text>
					</View>
					<View key={"pad"} style={{flex:0.03}}/>
				</View>
			)
		}
		return resp;
	},
	parsePrice: function(item) {
		return (item.name==="Misc") ? (item.extra ? item.amount * this.state.multiplier : item.amount) : item.price;
	},
	parseAmount: function(item) {
		return (item.name!=="Misc") ? item.amount : item.price;
	},
	priceCondColor: function(e) {
		if (e)
			return {'color': '#F7AF26'};
		else
			return {};
	},
	renderCart: function() {
		var resp = [];
		var count = 0;
		for(let item of this.state.cart) {
			count++;
			resp.push(
				<View key={item.name + count} style={{flexDirection: 'row', flex:1, height: 38}}>
					<View style={{flex:0.03}}/>
					<View style={[gel.row, {flex:1, justifyContent: 'center', alignItems: 'center'}]}>
						<Text style={styles.rowName}>{item.name}</Text>
						<View style={{flex:0.05}} />
						<Text style={[styles.rowAmount, this.priceCondColor(item.extra)]}>{this.parsePrice(item)}€</Text>
						<View style={{flex:0.05}}/>
						<View style={styles.deleteButton}>
							<TouchableOpacity key={'decreaseAmount' + item.name} onPress={this.deleteCart.bind(this, item.name, item.amount)}>
								<Icon style={{alignItems: 'center', justifyContent: 'center'}} name="minus" size={30} color="#000000"/>
							</TouchableOpacity>
						</View>
						<Text style={[styles.rowAmount, {flex: 0.15}]}>{this.parseAmount(item)}</Text>
						<View style={styles.deleteButton}>
							<TouchableOpacity key={'addAmount' + item.name} onPress={this.addToCart.bind(this, item.name, item.amount, item.extra)}>
								<Icon style={{alignItems: 'center', justifyContent: 'center'}} name="plus" size={30} color="#000000"/>
							</TouchableOpacity>
						</View>
					</View>
					<View key={"pad"} style={{flex:0.03}}/>
				</View>

			);
		}
		if(this.state.cart.length > 0) {
			resp.push(
				<View key={"BotPad"} style={{height: 30, flexDirection:'row'}}>
					<TouchableOpacity style={{flex: 0.3}} onPress={()=> {this.setState({'cart': [], 'total': 0.0});}}>
						<View style={styles.clearCartButton}>
							<Text style={styles.clearCartText}>Clear cart</Text>
						</View>
					</TouchableOpacity>
					<View style={{flex: 0.7}} /> 
				</View>
			);
		}
		return resp;
	},
	toggleConfirm: function () {
		if (this.state.cart.length > 0) {
			this.setState({confirmToggled: !this.state.confirmToggled});
		}
	},
	handleConfirm: async function() {
		let c = await AsyncStorage.getItem('confirm');
		if (c !== 'false') {
			this.toggleConfirm();
		} else {
			this.commitCart();
		}
	},
    message: function() {
        if (this.state.message !== '') {
            return (<Text style={styles.message}>{this.state.message}</Text>)
        }
    },

    toggleOther: function() {
        this.setState({toggled: !this.state.toggled});
    },

    conditionalTab: function() {
    	if(this.state.tab <= this.state.hardLimit) {
    		var s = StyleSheet.create({tab:{'color':'#F73826'}})
    		this.setState({condStyle:s});
    	}
    	else if (this.state.tab<= this.state.softLimit) {   		
    		var s = StyleSheet.create({tab:{'color':'#F7AF26'}})
    		this.setState({condStyle:s});
    	}
    	else {
    		var s = StyleSheet.create({tab:{'color':'#000000'}})
    		this.setState({condStyle:s});
    	}
    },

	render: function() {

		return(
			<View style={[{flex: 1}, gel.baseBackgroundColor]}>
				<ScrollView style={styles.container} refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                      }>
					<View style={{flex:0.1}} />
					<View style={styles.cartContainer}>
						<View style={styles.cart}>
	                        {this.message()}
							{this.renderCart()}
						</View>
						<View style={styles.commitCart}>
							<Text style={styles.currentTab}>Total Tab: <Text style={this.state.condStyle.tab}>{Number((this.state.tab).toFixed(2))}€</Text></Text>
							<View style={{flex: 0.3}} />
							<TouchableOpacity style={styles.commitButton} onPress={this.handleConfirm} >
								<Text style={styles.tabMe}>Tab me ({Number((this.state.total).toFixed(2))}€)</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{flex:0.2}} />
						{this.renderPrices()}
					<View style={{flex:0.1}} />
	                <View style={{flex:0.1, padding:20}} />
	                <Modal animationType={"slide"} transparent={true} visible={this.state.toggled}
	                onRequestClose={() => {this.setState({'toggled': !this.state.toggled});}} >
	                	<ScrollView contentContainerStyle={{height: windowSize.height}} style={{flex: 1}} ref='scrollView'>
		                	<TouchableOpacity style={{height: windowSize.height, width: windowSize.width}} onPress={this.toggleOther}>
		                	<View style={styles.modalBody}>
		                		<TouchableOpacity style={{flex:1}} onPress={() => {}}>
	                            <View style={{flex:0.1}} />
	                            <Text style={styles.modalHeader}>Custom amount</Text>
	                            <View style={{flex:0.1}} />
	                            <View style={[cond_input.s.i, {flex:0.2}]}>
		                            <TextInput
		                                style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
		                                onChangeText={(text) => {
							                var reg = /^\d*\.?\d*$/
							                if(reg.test(text)) {
							                  this.setState({'otherAmount': text});
							                }
							            }}
		                                keyboardType={cond_input.t}
		                                ref='otherInput'
		                                placeholder='Amount'
		                                onFocus={this.inputFocused.bind(this, 'otherInput')}
		                                value={this.state.otherAmount}
		                            />
		                        </View>
	                            <View style={[cond_input.s.i, {flex:0.2}]}>
		                            <TextInput
		                                style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
		                                onChangeText={(text) => this.state.comment = text}
		                                ref='otherCommentInput'
		                                placeholder='Reason'
		                                onFocus={this.inputFocused.bind(this, 'otherCommentInput')}
		                            />
		                        </View>
	                            <View style={{flex:0.1}} />
	                            <TouchableOpacity style={styles.modalButton} onPress={this.addOtherToCart} >
									<Text style={styles.tabMe}>Add to Cart</Text>
								</TouchableOpacity>
	                            <View style={{flex:0.1}} />
	                            </TouchableOpacity>
	                        </View>
	                       	</TouchableOpacity>
	                    </ScrollView>
	                </Modal>

	                <Modal animationType={"fade"} transparent={true} visible={this.state.confirmToggled}
	                onRequestClose={() => {this.setState({'confirmToggled': !this.state.confirmToggled});}} >
	                	<TouchableOpacity style={{height: windowSize.height/8, width: windowSize.width}} onPress={this.toggleConfirm}>
	                	</TouchableOpacity>
	                	<View style={styles.confirmModalBody}>
	                		<TouchableOpacity style={{flex:0.3}} onPress={() => {}}>
	                            <View style={{flex:0.1}} />
	                            <Text style={styles.modalHeader}>Confirm?</Text>
	                            <View style={{flex:0.1}} />
                            </TouchableOpacity>
                            <ScrollView style={{flex: 0.9}}>
                            	{this.renderConfirm()}
                            </ScrollView>
                            <TouchableOpacity style={{flex:0.5}} onPress={() => {}}>
	                            <View style={{flex:0.05}} />
		                            <TouchableOpacity style={styles.modalButton} onPress={()=> {this.toggleConfirm();this.commitCart();}} >
										<Text style={styles.tabMe}>Confirm</Text>
									</TouchableOpacity>
								<View style={{flex:0.05}} />
									<TouchableOpacity style={styles.modalButton} onPress={this.toggleConfirm} >
										<Text style={styles.tabMe}>Cancel</Text>
									</TouchableOpacity>
	                            <View style={{flex:0.05}} />
                            </TouchableOpacity>
                        </View>
                       	<TouchableOpacity style={{height: windowSize.height/8, width: windowSize.width}} onPress={this.toggleConfirm}>
	                	</TouchableOpacity>
	                </Modal>			
                </ScrollView>
                <Toast ref="toast"/>
			</View>
		)
	}

})

var styles = StyleSheet.create({
	clearCartText: {
		textAlign: 'center',
		fontSize: 16,
		color: '#FFF'
	},
	clearCartButton: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 3,
		elevation: 5,
		backgroundColor: '#388E3C',
		flex: 0.4,
		padding: 4,
		marginLeft: 5,
		marginBottom: 2
	},
	tabMe: {
		textAlign: 'center',
		justifyContent: 'center',
		color: "#FEFEFE",
		fontSize: 15,
		textShadowColor: "#000000",
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 3,
	},
	modalHeader: {
		'textAlign': 'center',
		fontSize: 18,

	},
	cartRow: {
		flexDirection: 'row',
		flex:1,
		height: 38
	},
	sumRow: {
		borderColor: 'transparent',
		borderTopColor: '#000',
		borderWidth: 1
	},
	container: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: 'transparent'
	},
	commitButton: {
		borderRadius: 3,
		padding: 10,
		backgroundColor: '#388E3C',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalButton: {
		marginRight: 20,
		marginLeft: 20,
		borderRadius: 3,
		padding: 10,
		backgroundColor: '#388E3C',
		justifyContent: 'center',
		alignItems: 'center',

	},
	cartContainer: {
		borderRadius: 3,
		marginTop: 5,
		marginRight: 3,
		marginLeft: 3,
		flex: 0.4,
		backgroundColor: '#FFFFFF'
	},
    modalBody: {
	    flexDirection: 'column',
	    margin: 10,
	    marginTop: windowSize.height/4,
	    backgroundColor: '#FFFFFF',
	    borderRadius: 5,
	    height: windowSize.height/2,
	    padding: 5,
	    elevation: 10
  	},
  	 confirmModalBody: {
	    flexDirection: 'column',
	    margin: 10,
	    marginTop: 0,
	    marginBottom: 0,
	    backgroundColor: '#FFFFFF',
	    borderRadius: 5,
	    height: windowSize.height - windowSize.height/4,
	    padding: 5,
	    elevation: 10
  	},
    message: {
        flex: 0.2,
        margin: 5,
        color: 'white',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        textShadowColor: "#000000",
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    },
	cart: {
		borderTopLeftRadius: 3,
		borderTopRightRadius:3,
		flex: 0.8,
		backgroundColor:'#C8E6C9'
	},	
	button: {
		height:100,
		width: 160,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
		shadowColor: '#000000',
		shadowOffset: {width: 5, height: 5},
		shadowRadius: 2,
		padding: 5,
		elevation: 5,

	},
	buttonrow: {
		marginTop: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 105,

	},
	collapsibleButtonrow: {
		marginTop: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 100,
	},
	rowName: {
		fontSize:18,
		flex:0.5,
		color: '#111111',
	},
	rowAmount: {
		textAlign: 'center',
		justifyContent: 'center',
		fontSize: 16,
		flex: 0.2,
		color: '#111111',
	},
	deleteButton: {
		flex: 0.1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	currentTab: {
		flex: 0.3,
		textAlign: 'center',
		justifyContent: 'center',
		fontWeight:'bold',
		fontSize: 18,
		color: 'black',
	},
	commitCart: {
		margin: 3,
		alignItems: 'center',
		flexDirection: 'row',
		height: 40,

	},
	amount: {
		textAlign: 'center',
		justifyContent: 'center',
		color: "#101010",
		fontSize: 22,
	},
})

module.exports = Tab;
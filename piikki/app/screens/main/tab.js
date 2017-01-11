'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');

var gel = require('../GlobalElements');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Navigator,
  TouchableOpacity,
  AsyncStorage,
  Modal,
  ScrollView,
  ActivityIndicator
} = require('react-native');;

import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';




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
            toggled: true,
	 	}
	 },
	 componentDidMount: function() {
	 	this.getPrices();
	 },
	 calcTotal: function(cart) {
    	return cart.reduce((a, b) => {
    		a += b.amount * b.price;
    		return a;
    	}, 0);
    },
	commitCart: function() {
		var app = this;
        app.setState({message: ""});
		var cart = {};
        if(this.state.cart.length === 0) {
            app.setState({message: "Cart is empty!"});
            return;
        }
		this.state.cart.map((item) => {
			cart[item.name] = item.amount;
		})
		var asd = AsyncStorage.getItem('token', async function(err, result){
	    	try {
		    	console.log(cart); 
		      	let response = await fetch(env.host+'tab', { 
		          method: 'POST', 
		          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }, 
		          body: JSON.stringify(cart) 
		      	}); 
		      	let responseJson = await response.json();
		      	if(responseJson.success) {
                    var temp_cart = app.state.cart;
			      	for (let k of Object.keys(responseJson.message)) {
                        if (responseJson.message[k]) {  
                            for (var v in temp_cart) {
                                if (temp_cart[v].name === k)
                                    temp_cart.splice(v, 1);
                            }
                        }
			      	}
                    app.setState({cart:temp_cart});
                    app.setState({total:app.calcTotal(temp_cart)});
                    app.setState({message: "Enjoy responsibly!"})
                    if (temp_cart.length === 0)
                    	app.getPrices();
		      	}
	      	} 
	      	catch(error) {  // Handle error
                app.setState({message: "Error in tabbing!"})
	        	console.error(error); }
	  	});
	},

	addToCart: function(item) {
		var cart = this.state.cart;
		var total = this.state.total;
		var new_item = {"name": item};
		var items = cart.filter((item) => {return item.name === new_item.name});
		if (items.length > 0) {
			cart = cart.map((item) => {
				if (item.name === new_item.name) {
					item.amount += 1
				}
				return item

			});
		} else {
			new_item["price"] = this.state.prices[item];
			new_item["amount"] = 1;
			cart.push(new_item);
		}
		total += this.state.prices[item];
		this.setState({total: this.calcTotal(cart)});
		this.setState({cart: cart});
        this.setState({message: ""});
	},
    addOtherToCart: function() {
        if(this.state.otherAmount > 0) {
            var cart = this.state.cart
            var new_item = {}
            new_item["Misc"] = this.state.otherAmount
            cart.push(new_item);
            this.setState({cart: cart});
            this.setState({message: ""});
            this.setState({toggled: true});
        }
        
    },
	deleteCart: function(name) {
		var cart = this.state.cart;
		var total = this.state.total;
		cart = cart.map((item) => {
			if (name === item.name) {
				item.amount -= 1
			}
			return item;
		});
		cart = cart.filter((item) => {return item.amount > 0});
		total -= this.state.prices[item]
		this.setState({total: this.calcTotal(calc)});
		this.setState({cart: cart});
        this.setState({message: ""});
	},

	getPrices: async function() {
		var app = this
		var asd = AsyncStorage.getItem('token', async function(err, result){
			try {
	      		let response = await fetch(env.host+'prices', { 
	          		method: 'GET', 
	          		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
	      		let responseJson = await response.json();
	      		app.setState({prices: responseJson.prices})
	      		app.setState({tab: responseJson.tab})
	      		app.setState({pricesAvailable: true})
	      	} 
	      	catch(error) {  // Handle error
                app.setState({message: "Could not fetch prices :("})
	        	console.error(error); }
		});
	},

	renderButtons: function(i) {
		var resp = [];
		var keys = Object.keys(this.state.prices);
		var prices = this.state.prices;
		for(var j = 0; j<2; j++) {
			var price = prices[keys[i*2+j]]
			resp.push(<View style={{flex:0.08}} key={keys[i*2+j] + " flex"}>
				</View>);
			resp.push(

				<TouchableOpacity key={keys[i*2+j]} onPress={this.addToCart.bind(this,keys[i*2+j])}>
					<View style={[gel.itemBackGroundColor, styles.button]}>
						<Text style={styles.amount}>{keys[i*2+j]}</Text>
					</View>
				</TouchableOpacity>
			);
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

            resp.push(
                <View key="moi" style={styles.buttonrow}>
                    <View style={{flex:0.08}} />
                    <TouchableOpacity>
						<View style={[gel.itemBackGroundColor, styles.button]}>
                        	<Text style={styles.amount}>Any sum</Text>
                        </View>
                    </TouchableOpacity>
                    <Collapsible collapsed={this.state.toggled}>
                        <View style={styles.accordionInputRow}>
                            <View style={{flex:0.1}} />
                            <TextInput
                                style={{height:50, flex:0.5, borderColor: 'black', borderWidth: 1, color:'#D8D8D8',}}
                                onChangeText={(text) => this.state.otherAmount = text}
                                keyboardType={'numeric'}
                                ref='otherInput'
                            />
                            <View style={{flex:0.1}} />
                                <View style={styles.changeTabButton}>
                                <TouchableOpacity onPress={this.addOtherToCart}>
                                    <View style={{flex:1.0}}>
                                    <View style={styles.changeTabButtonInside}>
                                        <Text style={styles.changeTabButtonText}>Add</Text>
                                    </View>
                                    </View>
                                </TouchableOpacity>
                                </View>

                            <View style={{flex:0.1}} />
                        </View>
                    </Collapsible>
                    <View style={{flex:0.08}} />
                </View>
            )

			return resp;
		}

	},

	renderCart: function() {
		var resp = [];
		for(let item of this.state.cart) {
			resp.push(
				<View key={item.name} style={{flexDirection: 'row', flex:1, height: 30}}>
					<View style={{flex:0.03}}/>
					<View style={[gel.row, {flex:1, justifyContent: 'center', alignItems: 'center'}]}>
						<Text style={styles.rowName}>{item.name}</Text>
						<View style={{flex:0.05}} />
						<Text style={styles.rowAmount}>{item.price}€</Text>
						<View style={{flex:0.05}}/>
						<View style={styles.deleteButton}>
							<TouchableOpacity key={'decreaseAmount' + item.name} onPress={this.deleteCart.bind(this, item.name)}>
								<Icon style={{alignItems: 'center', justifyContent: 'center'}} name="minus" size={20} color="#000000"/>
							</TouchableOpacity>
						</View>
						<Text style={[styles.rowAmount, {flex: 0.15}]}>{item.amount}</Text>
						<View style={styles.deleteButton}>
							<TouchableOpacity key={'addAmount' + item.name} onPress={this.addToCart.bind(this, item.name)}>
								<Icon style={{alignItems: 'center', justifyContent: 'center'}} name="plus" size={20} color="#000000"/>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{flex:0.03}}/>
				</View>

			);
		}
		return resp;
	},
    message: function() {
        if (this.state.message !== '') {
            return (<Text style={styles.message}>{this.state.message}</Text>)
        }
    },

    toggleOther: function() {
        this.setState({toggled: !this.state.toggled}, function() {
            if(!this.state.toggled) {
                this.refs.otherInput.focus();
            }
        });
        
    },

	render: function() {

		return(
			<View style={[{flex: 1}, gel.baseBackgroundColor]}>
				<ScrollView style={styles.container}>
					<View style={{flex:0.1}} />
					<View style={styles.cartContainer}>
						<View style={styles.cart}>
	                        {this.message()}
							{this.renderCart()}
						</View>
						<View style={styles.commitCart}>
							<Text style={styles.currentTab}>Total Tab: {this.state.tab}€</Text>
							<View style={{flex: 0.3}} />
							<TouchableOpacity style={styles.commitButton} onPress={this.commitCart} >
								<Text style={styles.tabMe}>Tab me ({this.state.total}€)</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{flexDirection: 'row', flex:0.1}}>
						<View style={{flex: 0.1}} />
					</View>
					<View style={{flex:0.1}}>
					</View>	
						{this.renderPrices()}
					<View style={{flex:0.1}}>
					</View>
	                <View style={{flex:0.1, padding:20}} />
				</ScrollView>
			</View>
		)
	}

})

var styles = StyleSheet.create({
	tabMe: {
		textAlign: 'center',
		justifyContent: 'center',
		color: "#FEFEFE",
		fontSize: 15,
		textShadowColor: "#000000",
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 3,
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
	cartContainer: {
		borderRadius: 3,
		marginTop: 5,
		marginRight: 3,
		marginLeft: 3,
		flex: 0.4,
		backgroundColor: '#FFFFFF'
	},
	headerContainer: {
		flex: 0.2
	},
    accordionInputRow: {
    flexDirection: 'row',
    flex:1,
  },
    message: {
        flex: 0.1,
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
	header: {
		color: 'white',
		top: 10,
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: 40,
		fontWeight: 'bold',
		textShadowColor: "#000000",
		textShadowOffset: {width: 2, height: 2},
		textShadowRadius: 4,
        flex: 0.5

	},
	button: {
		height:100,
		width: 160,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,

	},
	bg: {
		position: 'absolute',
        left: 0,
        bottom: 0,
        top:0,
        right:0,
        height:windowSize.height,
        width: windowSize.width,
	},

	buttonrow: {
		marginTop: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 105,

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
		flex: 0.05,
		alignItems: 'center',
		justifyContent: 'center'
	},
	currentTab: {
		flex: 0.3,
		textAlign: 'center',
		justifyContent: 'center',
		fontWeight:'bold',
		fontSize: 14,
		color: 'black',
	},
	cartPill: {
		borderRadius:5,
		flex:0.8,
		flexDirection: 'row',
        borderWidth: 1,

	},
	commitCart: {
		margin: 3,
		alignItems: 'center',
		flexDirection: 'row',
		height: 30,

	},
	amount: {
		textAlign: 'center',
		justifyContent: 'center',
		color: "#101010",
		fontSize: 22,
	},
    changeTabButton: {
    flex:0.5,
  },
  changeTabButtonInside: {
    flex:1,
    borderWidth:1,
    borderRadius: 20,
    justifyContent: 'center',
  },
  changeTabButtonText: {
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 20,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },


})

module.exports = Tab;
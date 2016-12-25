'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');


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
  ScrollView
} = require('react-native');;

import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from 'react-native-collapsible';


var Spinner = require('react-native-spinkit');

var Tab = React.createClass({
	 getInitialState: function() {
	 	return {
	 		pricesAvailable: false,
	 		token: '',
	 		prices: {},
	 		tab: 0,
	 		cart: [],
            message: '',
            otherAmount: "",
            toggled: true,
	 	}
	 },
	 componentDidMount: function() {
	 	this.getPrices();
	 },

	commitCart: function() {
		var app = this;
        app.setState({message: ""});
		var cart = {};
        if(this.state.cart.length === 0) {
            app.setState({message: "Cart is empty!"});
            return;
        }
		for (var key in this.state.cart)
		{
			var k = Object.keys(this.state.cart[key])[0];
			if (cart[k])
				cart[k] = cart[k] + 1;
			else
				cart[k] = 1;
		}
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
                    var keys = Object.keys(responseJson.message);
                    var temp_cart = app.state.cart;
			      	for (var k in keys) {
                        if (responseJson.message[keys[k]]) {
                            
                            for (var v in temp_cart) {
                                if (Object.keys(temp_cart[v])[0] === keys[k])
                                    temp_cart.splice(v, 1);
                            }
                        }
			      	}
                    app.setState({cart:temp_cart});
                    app.setState({message: "Enjoy responsibly!"})

		      	}
	      	} 
	      	catch(error) {  // Handle error
                app.setState({message: "Error in tabbing!"})
	        	console.error(error); }
	  	});
	},

	addToCart: function(item) {
		var cart = this.state.cart
		var new_item = {}
		new_item[item] = this.state.prices[item]
		cart.push(new_item);
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

	deleteCart: function(item) {
		var cart = this.state.cart;
		cart.splice(item, 1);
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
					<View>
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
				<Spinner size={100} type='ThreeBounce' color='#BBBBBB'/>
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
                        <Text style={styles.amount}>Misc.</Text>
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
		for(var i = 0; i < this.state.cart.length; i++) {
			var key = Object.keys(this.state.cart[i])[0];
			resp.push(
				<View key={key} style={{flexDirection: 'column', flex:1}}>
					<View style={{flex:0.1}}/>
					<View style={styles.cartRow}>
						<View style={{flex:0.2}}/>
							<View style={{flex:0.05}}/>
							<Text style={styles.rowName}>{key}</Text>
							<View style={{flex:0.1}}>
							</View>
							<Text style={styles.rowAmount}>{this.state.cart[i][key]}€</Text>
							<View style={{flex:0.1}}/>
							<View style={styles.deleteButton}>
								<TouchableOpacity key={'cartrow' + i} onPress={this.deleteCart.bind(this, i)}>
									<Icon name="remove" size={25} color="#ff0000"/>
								</TouchableOpacity>
							</View>
							<View style={{flex:0.05}}/>
						<View style={{flex:0.2}}/>
					</View>
					<View style={{flex:0.1}}/>
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
			<View style={{flex: 1}}>
				<ScrollView style={styles.container}>
					<View style={styles.headerContainer}>
						<Text style={styles.header}>Spike</Text>
					</View>
					<View style={{flex:0.1}}/>
					<View style={{flexDirection: 'row', flex:0.7}}>
						<View style={{flex:0.1}}>
						</View>
						<View style={styles.cart}>
							<Text style={styles.currentTab}>Current tab: {this.state.tab}€</Text>
	                        {this.message()}
							{this.renderCart()}
						</View>
						<View style={{flex:0.1}}>
						</View>	
					</View>
					<View style={{flexDirection: 'row', flex:0.1}}>
						<View style={{flex: 0.1}} />
						<View style={styles.commitCart}>
							<TouchableOpacity onPress={this.commitCart} >
									<Text style={styles.amount}>Tab me!</Text>
							</TouchableOpacity>
						</View>
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
	container: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: 'transparent'
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
		flex: 0.8,
		top: 10,
		borderWidth:1,
		borderRadius: 20,
		padding: 10,
		backgroundColor:'rgba(140,140,140,0.8)'
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
		top:20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 140,

	},

	button1: {
		height:130,
		width: 130,
		borderRadius: 30,
		justifyContent: 'center',

	},

	button2: {
		height:130,
		width: 130,
		justifyContent: 'center',
		borderRadius: 30,
	},

    button3: {
        height:130,
        width: 230,
        borderRadius: 30,
        justifyContent: 'center',

    },
	rowName: {
		fontSize:20,
		flex:0.5,
		color: 'white',
		textShadowColor: "#000000",
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,

	},
	rowAmount: {
		fontSize: 20,
		flex: 0.2,
		color: 'white',
		textShadowColor: "#000000",
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 2,
	},
	deleteButton: {
		flex: 0.1,
		shadowColor: "#000000",
		shadowRadius: 3,
	},
	currentTab: {
		fontWeight:'bold',
		fontSize: 25,
		color: 'white',
		textShadowColor: "#000000",
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 3,
	},
	cartPill: {
		borderRadius:5,
		flex:0.8,
		flexDirection: 'row',
        borderWidth: 1,

	},
	commitCart: {
		flex: 0.8,
		top: 15,
		borderRadius: 30,
		borderWidth: 1,

	},
	amount: {
		textAlign: 'center',
		justifyContent: 'center',
		fontWeight: 'bold',
		color: "#FFFFFF",
		fontSize: 25,
		textShadowColor: "#000000",
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 3,
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
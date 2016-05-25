'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

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
} = React;

import Icon from 'react-native-vector-icons/FontAwesome';

var LinearGradient = require('react-native-linear-gradient');
var Spinner = require('react-native-spinkit');

var Tab = React.createClass({
	 getInitialState: function() {
	 	return {
	 		pricesAvailable: false,
	 		token: '',
	 		prices: {},
	 		tab: 0,
	 		cart: [],
	 	}
	 },
	 componentDidMount: function() {
	 	this.getPrices();
	 },

	moi: function(amount) {
		var app = this;
		var asd = AsyncStorage.getItem('token', async function(err, result){
    try {
    	console.log(amount); 
      let response = await fetch('http://localhost:8080/api/tab', { 
          method: 'POST', 
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }, 
          body: JSON.stringify(
            { amount: app.state.prices[amount], token: result}) }); 
      let responseJson = await response.json();
      } 
      catch(error) {  // Handle error
        console.error(error); }
  });},

	addToCart: function(item) {
		var cart = this.state.cart
		var new_item = {}
		new_item[item] = this.state.prices[item] 
		cart.push(new_item);
		this.setState({cart: cart});
		console.log(this.state.cart);
	},

	deleteCart: function(item) {
		var cart = this.state.cart;
		console.log(item);
		cart.splice(item, 1);
		this.setState({cart: cart});
	},

	getPrices: async function() {
		var app = this
		var asd = AsyncStorage.getItem('token', async function(err, result){
			try {
	      		let response = await fetch('http://localhost:8080/api/prices', { 
	          		method: 'GET', 
	          		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
	      		let responseJson = await response.json();
	      		app.setState({prices: responseJson.prices})
	      		app.setState({tab: responseJson.tab})
	      		app.setState({pricesAvailable: true})
	      	} 
	      	catch(error) {  // Handle error
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
					<LinearGradient cstart={[0.0, 0.0]} end={[1.0, 1.0]} colors={['rgba(180,180,180,0.7)', 'rgba(120,120,120,0.88)', 'rgba(90,90,90,1)']} style={((j == 0) ? styles.button1 : styles.button2)}>
					<View>
						<Text style={styles.amount}>{keys[i*2+j]}</Text>
					</View>
					</LinearGradient>
				</TouchableOpacity>
			);
		}	
		return resp;
	},

	renderPrices: function() {
		if(!this.state.pricesAvailable) {
			return(<View style={{justifyContent: 'center', alignItems:'center', flex: 0.8}}>
				<Spinner size={100} type='ThreeBounce'/>
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
			return resp;
		}

	},

	renderCart: function() {
		var resp = [];
		for(var i = 0; i < this.state.cart.length; i++) {
			var key = Object.keys(this.state.cart[i])[0];
			resp.push(
				<View style={{flexDirection: 'column', flex:1}}>
					<View style={{flex:0.1}}/>
					<View style={styles.cartRow}>
						<View style={{flex:0.2}}/>
						<LinearGradient start={[0.0, 0.0]} end={[1.0, 1.0]} colors={['rgba(180,180,180,0.7)', 'rgba(120,120,120,0.6)', 'rgba(90,90,90,0.5)']} style={styles.cartPill}>
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
						</LinearGradient>
						<View style={{flex:0.2}}/>
					</View>
					<View style={{flex:0.1}}/>
				</View>

			);
		}
		return resp;
	},

	render: function() {

		return(
			<ScrollView style={styles.container}>
				<Image style={[styles.bg,{width: this.state.width, height:this.state.height}]} source={{uri: 'http://www.decalskin.com/wallpaper.php?file=samsung/SGS3-SN1.jpg'}} />
				<View style={styles.headerContainer}>
					<Text style={styles.header}>Spike</Text>
				</View>
				<View style={{flex:0.1}}/>
				<View style={{flexDirection: 'row', flex:0.7}}>
					<View style={{flex:0.1}}>
					</View>
					<View style={styles.cart}>
						<Text style={styles.currentTab}>Current tab: {this.state.tab}€</Text>
						{this.renderCart()}
					</View>
					<View style={{flex:0.1}}>
					</View>	
				</View>

				<View style={{flex:0.1}}>
				</View>	
				{this.renderPrices()}
			</ScrollView>
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

	},

	bg: {
		position: 'absolute',
        left: 0,
        top: -300,
        bottom: -300,
        right:0,
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

	amount: {
		textAlign: 'center',
		justifyContent: 'center',
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
	},
	
	cartRow: {
		
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

	}


})

module.exports = Tab;
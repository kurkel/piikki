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


var Spinner = require('react-native-spinkit');

var Tab = React.createClass({
	 getInitialState: function() {
	 	return {
	 		pricesAvailable: false,
	 		token: '',
	 		prices: {},
	 		tab: 0,
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
			console.log(price);
			resp.push(<View style={{flex:0.08}} key={keys[i*2+j] + " flex"}>
				</View>);
			resp.push(
				<TouchableOpacity key={keys[i*2+j]} onPress={this.moi.bind(this,keys[i*2+j])}>
					<View style={((j == 0) ? styles.button1 : styles.button2)}>
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

	render: function() {

		return(
				
					<ScrollView style={styles.container}>
						<Image style={[styles.bg,{width: this.state.width, height:this.state.height}]} source={{uri: 'http://www.decalskin.com/wallpaper.php?file=samsung/SGS3-SN1.jpg'}} />
						<View style={styles.headerContainer}>
							<Text style={styles.header}>Spike</Text>
						</View>
						<View style={{flexDirection: 'row'}}>
							<View style={{flex:0.1}}>
							</View>
							<View style={styles.cart}>
								
								<Text style={styles.currentTab}>Current tab: {this.state.tab}</Text>
								<Text style={styles.cartItem}>asd</Text>
							</View>
							<View style={{flex:0.1}}>
							</View>	
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
		textShadowRadius: 10,
		textShadowColor: 'black',

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
		borderWidth:1,
		borderColor: '#CCC',
		borderRadius: 30,
		justifyContent: 'center',
		backgroundColor:'rgba(52,52,52,0.8)',
	},

	button2: {
		height:130,
		width: 130,
		justifyContent: 'center',
		borderWidth:1,
		borderColor: '#CCC',
		borderRadius: 30,
		backgroundColor:'rgba(52,52,52,0.8)',


	},

	amount: {
		textAlign: 'center',
		justifyContent: 'center',
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
	},

	arrow: {
		fontSize: 40,
		

	},
	arrowContainer: {
		position: 'absolute',
		top:windowSize.height/2,
		left:windowSize.width,
	}


})

module.exports = Tab;
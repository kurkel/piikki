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
  TouchableHighlight,
  AsyncStorage,
} = React;

var Tab = React.createClass({
	moi: function(amount) {
		var asd = AsyncStorage.getItem('token', async function(err, result){
    try {
    	console.log(amount); 
      let response = await fetch('http://192.168.56.1:8080/api/tab', { 
          method: 'POST', 
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }, 
          body: JSON.stringify(
            { amount: amount, token: result}) }); 
      let responseJson = await response.json();
      } 
      catch(error) {  // Handle error
        console.error(error); }
  });},
	render: function() {
		return(
			<View style={styles.container}>
				<Image style={styles.bg} source={{uri: 'http://www.decalskin.com/wallpaper.php?file=samsung/SGS3-SN1.jpg'}} />
				<Text style={styles.header}>Spike</Text>
				<View style={styles.buttonrow}>
					<TouchableHighlight onPress={() => this.moi(1)}>
						<View style={styles.button1}>
							<Text style={styles.amount}>1€</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight onPress={() => this.moi(1.5)}>
						<View style={styles.button2}>
							<Text style={styles.amount}>1.5€</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={styles.buttonrow}>
					<TouchableHighlight onPress={() => this.moi(2)}>
						<View style={styles.button1}>
							<Text style={styles.amount}>2€</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight onPress={() => this.moi(3)}>
						<View style={styles.button2}>
							<Text style={styles.amount}>3€</Text>
						</View>
					</TouchableHighlight>
				</View>
				<View style={styles.buttonrow}>
					<View style={styles.button3}>
						<Text style={styles.amount}>Custom</Text>
					</View>
				</View>
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
        top: 0,
        width: windowSize.width,
        height: windowSize.height
	},

	buttonrow: {
		top:20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 160,
		padding:10
	},

	button1: {
		height:150,
		width: 150,
		borderWidth:1,
		left: 5,
		borderColor: '#CCC',
		borderRadius: 30,
		justifyContent: 'center',
		backgroundColor:'rgba(52,52,52,0.8)',
	},

	button2: {
		height:150,
		width: 150,
		right: 5,
		justifyContent: 'center',
		borderWidth:1,
		borderColor: '#CCC',
		borderRadius: 30,
		backgroundColor:'rgba(52,52,52,0.8)',


	},

	button3: {
		height:150,
		flex: 1,
		right: 5,
		left: 5,
		alignSelf: 'stretch',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#CCC',
		borderRadius: 30,
		backgroundColor:'rgba(52,52,52,0.8)',


	},

	amount: {
		textAlign: 'center',
		justifyContent: 'center',
		fontSize: 30,
		color: 'white',
		fontWeight: 'bold',
	}


})

module.exports = Tab;
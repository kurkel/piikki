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
} = React;

var Login1 = React.createClass({
	render: function() {
		return(
			<Navigator
	          renderScene={this.renderScene.bind(this)}
	    	/>
    )
	},

	renderScene: function() {
		return(
			<Text>jee pääsit inee</Text>
		)
	}

})
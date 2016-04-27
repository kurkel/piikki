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

var Tab = React.createClass({
	render: function() {
		return(
			<Text>jee pääsit inee</Text>
		)
	}

})

module.exports = Tab;
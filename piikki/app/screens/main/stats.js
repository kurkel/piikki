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

var Stats = React.createClass({
  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
    this.getStats();
  },

  getStats: function() {

  },

  render: function() {
    return(
      <ScrollView>
        <View>
        </View>
      </ScrollView>
    );
  }

});

var styles = StyleSheet.create({


});

module.exports = Stats
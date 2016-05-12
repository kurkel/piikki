'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var ScrollableTabView = require('react-native-scrollable-tab-view');


var {
  StyleSheet,
  View,
  Text,
} = React;

var TabPage = require('./tab');
var AdminPage = require('./admin');

var MainPage = React.createClass({
  render: function() {
    return (
      <ScrollableTabView>
      	<TabPage tabLabel='Tab'/>
      	<Text tabLabel='Stats'>favorite</Text>
      	<AdminPage tabLabel='Admin'></AdminPage>
      </ScrollableTabView>
    );
  }
});

module.exports = MainPage;
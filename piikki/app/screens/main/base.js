'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var ScrollableTabView = require('react-native-scrollable-tab-view');


import CustomTabBar from '../helpers/CustomTab'

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
      <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
      	<TabPage tabLabel='beer' />
      	<Text tabLabel='bar-chart-o'>favorite</Text>
      	<AdminPage tabLabel='gavel'></AdminPage>
      </ScrollableTabView>
    );
  }
});

module.exports = MainPage;
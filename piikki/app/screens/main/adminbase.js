'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var ScrollableTabView = require('react-native-scrollable-tab-view');


import CustomTabBar from '../helpers/CustomTab'

var {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Image,
  BackAndroid
} = require('react-native');

var TabPage = require('./tab');
var StatsPage = require('./stats');
var AdminPage = require('./admin');

var AdminMainPage = React.createClass({
  componentDidMount: function() {
    var app = this;
    BackAndroid.addEventListener('hardwareBackPress', function() {
      app.props.navigator.pop(); 
      return true; 
    });
  },

  render: function() {
    return <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
        <TabPage tabLabel='beer'>
        </TabPage>
        <StatsPage tabLabel='bar-chart-o' />
        <AdminPage tabLabel='gavel' />
      </ScrollableTabView>;
  }
});


module.exports = AdminMainPage;
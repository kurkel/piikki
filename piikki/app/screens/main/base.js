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
var SettingsPage = require('./settings')

var MainPage = React.createClass({

  render: function() {
    return <ScrollableTabView locked={true} renderTabBar={() => <CustomTabBar />}>
        <TabPage tabLabel='glass'>
        </TabPage>
        <StatsPage tabLabel='bar-chart-o' />
        <SettingsPage tabLabel='user' navigator={this.props.navigator} />
      </ScrollableTabView>;
  }
});


module.exports = MainPage;
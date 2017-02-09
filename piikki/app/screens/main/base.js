'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var ScrollableTabView = require('react-native-scrollable-tab-view');
var Events = require('react-native-simple-events');
  

import CustomTabBar from '../helpers/CustomTab'

var {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Image,
  BackAndroid,
  Platform
} = require('react-native');

var TabPage = require('./tab');
var StatsPage = require('./stats');
var SettingsPage = require('./settings')
const marg = Platform.OS === 'ios' ? 20 : 0;
var MainPage = React.createClass({

  refreshTab: function(i) {
    var tabs = ["TabPage", "StatsPage", "SettingsPage"];
    Events.trigger(tabs[i.i], {o:'opened'});
  },

  render: function() {
    return <ScrollableTabView locked={true} renderTabBar={() => <CustomTabBar />} style={{marginTop: marg}}>
        <TabPage tabLabel='glass'>
        </TabPage>
        <StatsPage tabLabel='bar-chart-o' />
        <SettingsPage tabLabel='user' navigator={this.props.navigator} />
      </ScrollableTabView>;
  }
});


module.exports = MainPage;
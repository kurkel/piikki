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
var AdminPage = require('./admin');
var PersonalAdminPage = require('./personal_admin');
const marg = Platform.OS === 'ios' ? 20 : 0;

var AdminMainPage = React.createClass({

  refreshTab: function(i) {
    var tabs = ["TabPage", "StatsPage", "SettingsPage", "PersonalAdmin", "AdminPage"];
    Events.trigger(tabs[i.i], {o:'opened'});
  },


  render: function() {
    return <ScrollableTabView onChangeTab={this.refreshTab} locked={true} renderTabBar={() => <CustomTabBar />} style={{marginTop: marg}}>
        <TabPage tabLabel='glass' navigator={this.props.navigator}/>
        <StatsPage tabLabel='bar-chart-o' navigator={this.props.navigator}/>
        <SettingsPage tabLabel='user' navigator={this.props.navigator} />
        <PersonalAdminPage tabLabel='bank' navigator={this.props.navigator}/>
        <AdminPage tabLabel='gavel' navigator={this.props.navigator}/>
      </ScrollableTabView>;
  }
});


module.exports = AdminMainPage;
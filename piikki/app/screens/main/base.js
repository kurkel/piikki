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
  AsyncStorage,
  Image,
} = React;

var TabPage = require('./tab');
var StatsPage = require('./stats');
var AdminPage = require('./admin');

var MainPage = React.createClass({

  is_admin: async function() {
    AsyncStorage.getItem('admin', function(err, res){
      if(res) {
        return <AdminPage tabLabel='gavel' />;
      }
      else {
        return;
      }
  });
},

  render: function() {
    return (
      <ScrollableTabView renderTabBar={() => <CustomTabBar />}>
      	<TabPage tabLabel='beer'>
        </TabPage>
      	<StatsPage tabLabel='bar-chart-o' />
      </ScrollableTabView>
    );
  }
});

var styles = StyleSheet.create({
  bg:{
    position: 'absolute',
    left: 0,
    top: 0,
    width: windowSize.width,
    height: windowSize.height
  }
})

module.exports = MainPage;
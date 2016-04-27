'use strict';
var React = require('react-native');
var {
  AppRegistry,
  Navigator
} = React;

var LoginPage = require('./app/screens/login/login1');

var TabPage = require('./app/screens/main/tab');


var piikki = React.createClass({
  render: function() {
    return (
       <Navigator
          initialRoute={{id: 'LoginPage', name: 'Login'}}
          configureScene={() => {
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
          renderScene={(route, navigator) =>{
          	var routeId = route.id;
		    if (routeId === 'LoginPage') {
		      return (
		        <LoginPage
		          navigator={navigator} />
		      );
		    }
		    if (routeId === 'TabPage') {
		      return (
		        <TabPage
		          navigator={navigator} />
		      );
		    }}}
         	/>
    );
  }
});


AppRegistry.registerComponent('piikki', () => piikki);
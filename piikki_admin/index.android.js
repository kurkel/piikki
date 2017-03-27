'use strict';
var React = require('react');

var {
  AppRegistry,
  Navigator,
} = require('react-native');

var LoginPage = require('./app/screens/login/login');

var AdminMainPage = require('./app/screens/main/adminbase');

var piikki_admin = React.createClass({
  render: function() {
    return (
       <Navigator
          initialRoute={{id: 'LoginPage', name: 'Login', index: 0}}
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
		    if (routeId === 'AdminMainPage') {
		      return (
		        <AdminMainPage
		          navigator={navigator} onBack={() => { if (route.index > 0) { navigator.pop(); } }} />
		      );
		    }
		}}
        />
    );
  }
});


AppRegistry.registerComponent('piikki_admin', () => piikki_admin);
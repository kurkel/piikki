'use strict';
var React = require('react');
var {
  AppRegistry,
  Navigator,
} = require('react-native');
AppRegistry.registerHeadlessTask('NotificationTask', () => require('./app/NotificationWorker'));

var LoginPage = require('./app/screens/login/login');

var MainPage = require('./app/screens/main/base');

var AdminMainPage = require('./app/screens/main/adminbase');

var RegisterPage = require('./app/screens/login/register');

var NotificationWorker = require('./app/NotificationWorker');

NotificationWorker();
var piikki = React.createClass({
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
		    if (routeId === 'MainPage') {
		      return (
		        <MainPage
		          navigator={navigator} onBack={() => { if (route.index > 0) { navigator.pop(); } }} />
		      );
		    }
		    if (routeId === 'AdminMainPage') {
		      return (
		        <AdminMainPage
		          navigator={navigator} onBack={() => { if (route.index > 0) { navigator.pop(); } }} />
		      );
		    }
		    if (routeId === 'RegisterPage') {
		      return (
		        <RegisterPage
		          navigator={navigator} onBack={() => { if (route.index > 0) { navigator.pop(); } }} />
		      );
		    }	
		}}
        />
    );
  }
});


AppRegistry.registerComponent('piikki', () => piikki);
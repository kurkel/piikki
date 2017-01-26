'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');
var env = require('../env');
var {get, post} = require('../../api');

var gel = require('../GlobalElements');

var {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  AsyncStorage,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView
} = require('react-native');


var Login = React.createClass({
  getInitialState: function() {
    return {
      errorVisible: false,
      spinnerVisible: false,
      logoVisible: true,
      username: '',
      password: '',
      error: '',
      token: '',
      admin: false,
    };
  },

  componentDidMount: function() {
    this.checkSession();
  },

  async login() {
    this.showSpinner();
    dismissKeyboard();

    if(this.state.username === '' || this.state.password === '') {
      this.state.error = "Username or password empty";
      this.showError();
      return;
    }

    var payload = JSON.stringify({ username: this.state.username, password: this.state.password });
    var responseJson = await post('login', payload, (e) => {
      console.error(e);
      this.state.error = "Something went wrong";
      this.showError();
      return;
    });

    if(!responseJson.success) {
      this.state.error = "Wrong username or password";
      this.showError();
    }
    else {
      var app = this;
      await AsyncStorage.setItem("admin", responseJson.admin.toString());
      await AsyncStorage.setItem('token', responseJson.token);
      this.routeLogIn(responseJson.admin.toString());
    }
  },

  routeLogIn: function(admin) {
    let route = (admin === "true") ? {
        id: 'AdminMainPage',
        name: 'AdminMain',
      } : 
      {
        id: 'MainPage',
        name: 'Main',
      };
    this.props.navigator.push(route);
  },

  showSpinner: function() {
    this.setState({logoVisible: false});
    this.setState({errorVisible: false});
    this.setState({spinnerVisible: true});
  },

  showLogo: function() {
    this.setState({errorVisible: false});
    this.setState({spinnerVisible: false});
    this.setState({logoVisible: true});
    
  },

  showError: function() {
    this.setState({logoVisible: false});
    this.setState({spinnerVisible: false});
    this.setState({errorVisible: true});

  },

  register: function () {
    this.props.navigator.push({
      id: 'RegisterPage',
      name: 'Register',
    });
  },

  renderHeader: function() {
    if(this.state.logoVisible) {
      return <Image style={[styles.mark]} source={require('./applogo.png')} />;
    }
    else if(this.state.spinnerVisible){
      return <ActivityIndicator/>;
    }
    else {
      return <Text style={[styles.errorText]}>{this.state.error}</Text>;
    }
  },

  tokenSetter: function(value){
    this.setState({token:value});
  },

  checkSession: async function() {
    var token = await AsyncStorage.getItem('token');
    var admin = await AsyncStorage.getItem('admin');
    if(token) {
      this.routeLogIn(admin);
    }
  },

  render: function() {
        return (
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
          <View style={styles.container}>
              <Image style={styles.bg} source={require('./tausta.png')} />
              <View style={{flex: 0.05}} />
              <View style={styles.header}>
                {this.renderHeader()}
              </View>
              <View style={styles.inputs}>
                  <View style={styles.inputContainer}>
                      <TextInput
                          autoCapitalize='none'
                          autoCorrect={false}
                          style={[styles.input, styles.whiteFont]}
                          placeholder="Username"
                          placeholderTextColor="#FFF"
                          onChangeText={(username) => this.setState({username})}
                          value={this.state.username}
                      />
                  </View>
                  <View style={styles.inputContainer}>
                      <TextInput
                          secureTextEntry={true}
                          autoCorrect={false}
                          style={[styles.input, styles.whiteFont]}
                          placeholder="Password"
                          placeholderTextColor="#FFF"
                          onChangeText={(password) => this.setState({password})}
                          value={this.state.password}
                      />
                  </View>
              </View>
              <View style={styles.buttons}>
                <View style={{flex: 0.3}} />
                <View style={styles.button}>
                  <TouchableOpacity onPress={this.login}>
                    <View style={[styles.signin, gel.loginButtonColor]}>
                        <Text style={styles.whiteFont}>Sign In</Text> 
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 0.3}} />
                <View style={styles.button}>
                  <TouchableOpacity onPress={this.register}>
                    <View style={[styles.signin, gel.loginButtonColor]}>
                        <Text style={styles.whiteFont}>Register</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 0.3}} />

              </View>
              <View style={gel.footer} />
              
          </View>
        </TouchableWithoutFeedback>
    );
  }
});

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    buttons: {
      flex: 0.05,
      flexDirection: 'row',
    },
    button: {
      flex:0.5
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.15,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        padding: 12,
        alignItems: 'center',
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: 0.1
    },
    inputContainer: {
        flex:0.3,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderColor: 'transparent'
    },
    input: {
        textAlign: "center",
        alignItems: "flex-end",
        width: 200,
        fontSize: 14,
        left: 10,
        borderColor: "white",
    },
    whiteFont: {
      color: '#FFF'
    },
    errorText: {
      color: '#FF4F4D',
      fontSize: 20,
      fontWeight: 'bold',
    },
})


module.exports = Login;
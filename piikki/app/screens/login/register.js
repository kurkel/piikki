'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
const dismissKeyboard = require('dismissKeyboard');

var gel = require('../GlobalElements');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Navigator,
  TouchableHighlight,
  AsyncStorage,
  Modal,
  BackAndroid,
  TouchableWithoutFeedback,
  ActivityIndicator
} = require('react-native');

var Register = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      error: '',
      spinnerVisible: false,
      logoVisible: true,
      errorVisible: false
    }
  },
  componentDidMount: function() {
    var app = this;
    BackAndroid.addEventListener('hardwareBackPress', function() {
      app.props.navigator.pop(); 
      return true; 
    });
  },
    async reg() {
    dismissKeyboard();
    this.showSpinner()
    if(this.state.username === '' || this.state.password === '') {
       this.showError("Fill out both fields first!");
    }

    if(this.password !== this.password2) {
      this.showError("Passwords do not match!");
    }

    try { 


      let response = await fetch(env.host+'register', { 
          method: 'POST', 
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }, 
          body: JSON.stringify(
            { username: this.state.username, password: this.state.password, secret: this.state.secret, admin: false}) }); 
      let responseJson = await response.json(); 
      if(responseJson.success === false) {
        this.state.error = responseJson.error;
        this.showError(responseJson.error);
      }
      else {
        var loggers = this.login;
        loggers();
      }
    } 
    catch(error) {  // Handle error
      console.error(error);
      this.showError(error);
    }
  },

  async login() {

    if(this.state.username === '' || this.state.password === '') {
      this.showError("Fill out both fields first!");
    }

    try { 
      let response = await fetch(env.host+'login', { 
          method: 'POST', 
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }, 
          body: JSON.stringify(
            { username: this.state.username, password: this.state.password }) }); 
      let responseJson = await response.json(); 
      this.state.token = responseJson.token;
      if(responseJson.success == false) {
        this.showError('Login after register failed');
      }
      else {
        var asdasd = this.loggedin;
        AsyncStorage.setItem('token', this.state.token);
        asdasd();
      }
    } 
    catch(error) {  // Handle error
      console.error(error); 
      this.showError('Something went wrong');
    }
  },
  loggedin: function() {
    if(!this.state.token) {
      this.showError('Something went wrong');
    }
    this.props.navigator.push({
      id: 'MainPage',
      name: 'Main',
    });
  },

  renderErrors: function() {
    if(this.state.error !== '') {
      return <Text style={styles.errorText}>{this.state.error}</Text>;
    }
    else if(this.state.spinnerVisible){
      return <Spinner size={40} type='ThreeBounce'/>;
    }
    else {
      return;
    }
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


  render: function() {
        return (
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
        <View style={styles.container}>
          <Image style={styles.bg} source={require('./tausta.png')} />
          <View style={{flex:0.05}} />
          <View style={styles.header}>
            {this.renderHeader()}
          </View>
          <View style={{flex:0.05}} />
          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
                <TextInput 
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
            <View style={styles.inputContainer}>
                <TextInput
                    secureTextEntry={true}
                    style={[styles.input, styles.whiteFont]}
                    placeholder="Re-enter password"
                    placeholderTextColor="#FFF"
                    onChangeText={(password2) => this.setState({password2})}
                    value={this.state.password2}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={[styles.input, styles.whiteFont]}
                    placeholder="Secret"
                    placeholderTextColor="#FFF"
                    onChangeText={(secret) => this.setState({secret})}
                    value={this.state.secret}
                />
            </View>
          </View>
            <View style={{flex: 0.1, justifyContent:'center' , flexDirection: 'row'}}>
              <View style={{flex:0.1}} />
              <TouchableHighlight style={{flex: 0.1}} onPress={this.reg}>
                <View style={[styles.signin, gel.loginButtonColor]}>
                    <Text style={styles.whiteFont}>Register</Text>
                </View>
              </TouchableHighlight>
              <View style={{flex:0.1}} />
            </View>
            <View style={{flex:0.4}} />
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
    errorText: {
      color: '#FF4F4D',
      fontSize: 20,
      fontWeight: 'bold',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.35,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#4BAF4F',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.5
    },
    inputs: {
        marginBottom: 10,
        flex: 0.4
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.25,
    },
    input: {
        textAlign: 'center',
        width: 200,
        fontSize: 14,
    },
    whiteFont: {
      color: '#FFF'
    },
})


module.exports = Register;
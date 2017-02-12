'use strict';
var React = require('react');
var ReactNative = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
const dismissKeyboard = require('dismissKeyboard');
var {get, post} = require('../../api');
var cond_input = require('../inputStyling');

var gel = require('../GlobalElements');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


var {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableHighlight,
  AsyncStorage,
  BackAndroid,
  KeyboardAvoidingView,
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
  inputFocused (refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ReactNative.findNodeHandle(this.refs[refName]),
        110, //additionalOffset
        true
      );
    }, 50);
  },

  async reg() {
    dismissKeyboard();
    this.showSpinner()
    if(this.state.username === '' || this.state.password === '' || this.state.secret === '') {
       this.showError("Fill out all fields first!");
    }

    if(this.password !== this.password2) {
      this.showError("Passwords do not match!");
    }

    let payload = JSON.stringify({ username: this.state.username, password: this.state.password, secret: this.state.secret, admin: false});
    let responseJson = await post('register', payload, (e) => {
      console.error(error);
      this.showError(error);
    }); 
    if(!responseJson.success) {
      this.state.error = responseJson.error;
      this.showError(responseJson.error);
    }
    else {
      this.login();
    }
  },

  async login() {
    var payload = JSON.stringify({ username: this.state.username, password: this.state.password });
    var responseJson = await post('login', payload, (e) => {
      console.error(e);
      this.state.error = "Something went wrong";
      this.showError();
    });
    if(!responseJson.success) {
      this.showError('Login after register failed');
    }
    else {
      await AsyncStorage.setItem('token', responseJson.token);
      await AsyncStorage.setItem('username', this.state.username);
      this.loggedin();
    }
  },

  loggedin: function() {
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
        <ScrollView contentContainerStyle={{height: windowSize.height}} style={{flex: 1}} ref='scrollView'>
        {/*<TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>*/}
        {/*<View style={styles.container}>*/}
          <Image style={styles.bg} source={require('./tausta.png')} />
          <View style={{flex:0.05}} />
          <View style={styles.header}>
            {this.renderHeader()}
          </View>
          <View style={{flex:0.05}} />
          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
              <View style={cond_input.s.i}>
                <TextInput 
                    style={[styles.input, styles.whiteFont]}
                    placeholder="Username"
                    placeholderTextColor="#FFF"
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={cond_input.s.i}>
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
            <View style={styles.inputContainer}>
              <View style={cond_input.s.i}>
                <TextInput
                    ref='re-password'
                    secureTextEntry={true}
                    style={[styles.input, styles.whiteFont]}
                    placeholder="Re-enter password"
                    placeholderTextColor="#FFF"
                    onChangeText={(password2) => this.setState({password2})}
                    value={this.state.password2}
                    onFocus={this.inputFocused.bind(this, 're-password')}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={cond_input.s.i}>
                <TextInput 
                    ref='secret'
                    style={[styles.input, styles.whiteFont]}
                    placeholder="Secret"
                    placeholderTextColor="#FFF"
                    onChangeText={(secret) => this.setState({secret})}
                    value={this.state.secret}
                    onFocus={this.inputFocused.bind(this, 'secret')}
                />
              </View>
            </View>
          </View> 
            <View style={{ height:50, justifyContent:'center' , flexDirection: 'row'}}>
              <View style={{flex:0.1}} />
              <TouchableHighlight style={{flex: 0.1}} onPress={this.reg}>
                <View style={[styles.signin, gel.loginButtonColor]}>
                    <Text style={styles.whiteFont}>Register</Text>
                </View>
              </TouchableHighlight>
              <View style={{flex:0.1}} />
            </View> 
            <View style={{flex:0.1}} />
        {/*</View>*/}
        {/*</TouchableWithoutFeedback>*/}
       </ScrollView>
        
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
        height: 150,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#4BAF4F',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.5,
        height: 50,
        elevation: 5,
        shadowColor: '#000000',
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 2,
    },
    inputs: {
        marginBottom: 10,
        height: 320
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.25,
    },
    input: {
        height: 60,
        textAlign: 'center',
        width: 200,
        fontSize: 14,
    },
    whiteFont: {
      color: '#FFF'
    },
})


module.exports = Register;
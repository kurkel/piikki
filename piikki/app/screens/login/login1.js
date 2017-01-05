'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');
var env = require('../env');

var gel = require('../GlobalElements');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Navigator,
  TouchableOpacity,
  AsyncStorage,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator
} = require('react-native');



var Button = React.createClass({ 
  getInitialState() { 
    return { active: false, }; }, 
    _onHighlight() { this.setState({active: true}); },
     _onUnhighlight() { this.setState({active: false}); },
      render() { var colorStyle = { color: this.state.active ? '#fff' : '#000', }; 
      return ( <TouchableOpacity 
        onHideUnderlay={this._onUnhighlight} 
        onPress={this.props.onPress} 
        onShowUnderlay={this._onHighlight} 
        style={[styles.button, this.props.style]} underlayColor="#a9d9d4"> 
        <Text style={[styles.buttonText, colorStyle]}>{this.props.children}</Text> 
        </TouchableOpacity> ); } });

var Login1 = React.createClass({
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

    if(this.state.username === '' || this.state.password === '') {
      this.state.error = "Username or password empty";
      this.showError();
      return;
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
        this.state.error = "Wrong username or password";
        this.showError();
      }
      else {
        var app = this;
        var asdasd = this.loggedin;
        AsyncStorage.setItem("admin", responseJson.admin.toString(), function(err, resp) {
          AsyncStorage.setItem('token', app.state.token, function(err, resp) {
            asdasd();
          });  
        });
        
      }
    } 
    catch(error) {  // Handle error
      console.log(error);
      console.error(error); }
  },

  loggedin: function() {
    var app = this
    if(!this.state.token) {
      this.state.error = "Something went wrong";
      this.showError();
    }
    AsyncStorage.getItem("admin", function(err, resp) {
      if (resp === "true") {
        app.props.navigator.push({
          id: 'AdminMainPage',
          name: 'AdminMain',
        });  
      }
      else {
        app.props.navigator.push({
          id: 'MainPage',
          name: 'Main',
        });
      }
    })
    
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
    })
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

  checkSession: function() {
    var setter = this.tokenSetter;
    var logged = this.loggedin;
    AsyncStorage.getItem('token', function(err, res){
      if(res) {
        setter(res);
        logged();
      }

    })
  },

  _setModalVisible(visible) { this.setState({modalVisible: visible}); },

  render: function() {
        return (
        <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
          <View style={styles.container}>
              <Image style={styles.bg} source={require('./tausta.png')} />
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
                          password={true}
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
                    <View style={styles.signin}>
                        <Text style={styles.whiteFont}>Sign In</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex: 0.3}} />
                <View style={styles.button}>
                  <TouchableOpacity onPress={this.register}>
                    <View style={styles.signin}>
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
    modalButton: { marginTop: 10, },
    modalcontainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    innerContainer: { borderRadius: 10, alignItems: 'center', backgroundColor: '#D8D8D8'},
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
        flex: 0.25,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#4BAF4F',
        padding: 12,
        alignItems: 'center',
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: 0.12
    },
    inputPassword: {
        alignItems: "flex-start",
        width: 20,
        height: 20
    },
    inputUsername: {
      alignItems: "flex-start",
      width: 20,
      height: 20
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
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    },
    errorText: {

      color: '#FF4F4D',
      fontSize: 20,
      fontWeight: 'bold',
    },
    textWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
})


module.exports = Login1;
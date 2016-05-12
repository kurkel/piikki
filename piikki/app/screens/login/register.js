'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

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
  BackAndroid
} = React;

var Spinner = require('react-native-spinkit');

var Button = React.createClass({ 
  getInitialState() { 
    return { active: false, }; }, 
    _onHighlight() { this.setState({active: true}); },
     _onUnhighlight() { this.setState({active: false}); },
      render() { var colorStyle = { color: this.state.active ? '#fff' : '#000', }; 
      return ( <TouchableHighlight 
        onHideUnderlay={this._onUnhighlight} 
        onPress={this.props.onPress} 
        onShowUnderlay={this._onHighlight} 
        style={[styles.button, this.props.style]} underlayColor="#a9d9d4"> 
        <Text style={[styles.buttonText, colorStyle]}>{this.props.children}</Text> 
        </TouchableHighlight> ); } });

var nav;

BackAndroid.addEventListener('hardwareBackPress', function() {

  nav.pop(); 
  return true; 
});

var Register = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      error: '',
      spinnerVisible: false,
    }
  },
    async reg() {

    this.showSpinner()
    if(this.state.username === '' || this.state.password === '') {
       this.showError("Fill out both fields first!");
    }

    if(this.password !== this.password2) {
      this.showError("Passwords do not match!");
    }

    try { 


      let response = await fetch('http://localhost:8080/api/register', { 
          method: 'POST', 
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }, 
          body: JSON.stringify(
            { username: this.state.username, password: this.state.password, secret: this.state.secret, admin: false}) }); 
      let responseJson = await response.json(); 
      if(responseJson.success == false) {
        this.state.error = responseJson.error;
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
      let response = await fetch('http://localhost:8080/api/login', { 
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

  showError: function(errorMsg) {
    this.setState({spinnerVisible: false});
    this.setState({error: errorMsg});

  },
 
 showSpinner: function() {
    this.setState({error: ''});
    this.setState({spinnerVisible: true});
 },


  render: function() {
    nav = this.props.navigator;
        return (
        <View style={styles.container}>
            <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Register</Text>
            </View>
            <View style={styles.errors}>
              {this.renderErrors()}
            </View>
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
                    <TextInput 
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Username"
                        placeholderTextColor="#FFF"
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                    <TextInput
                        password={true}
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Password"
                        placeholderTextColor="#FFF"
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                    <TextInput
                        password={true}
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Password again"
                        placeholderTextColor="#FFF"
                        onChangeText={(password2) => this.setState({password2})}
                        value={this.state.password2}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputUsername}>?</Text>
                    <TextInput 
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Secret"
                        placeholderTextColor="#FFF"
                        onChangeText={(secret) => this.setState({secret})}
                        value={this.state.secret}
                    />
                </View>
            </View>
            <View style={{flex:0.15}} />
            <TouchableHighlight style={{flex:0.1, justifyContent:'center'}} onPress={this.reg}>
              
              <View style={styles.signin}>
                  <Text style={styles.whiteFont}>Register</Text>
              </View>
            </TouchableHighlight>
            <View style={{flex:0.15}} />

        </View>
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
    errors: {
      flex: 0.1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: '#FF4F4D',
      fontSize: 20,
      fontWeight: 'bold',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: 'transparent',
        color: '#FFF'

    },
    headerContainer: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#FF3366',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.2
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    inputs: {
        marginTop: 50,
        marginBottom: 10,
        flex: .3
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
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent',
        flex: 0.25,
    },
    input: {
        alignItems: "flex-end",
        width: 200,
        fontSize: 14,
        left: 10,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    },
    button: { borderRadius: 5, flex: 1, height: 44, alignSelf: 'stretch', justifyContent: 'center', overflow: 'hidden', }, 
    buttonText: { fontSize: 18, margin: 5, textAlign: 'center', },
})


module.exports = Register;
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
  TouchableOpacity,
  AsyncStorage,
  Modal
} = React;

var Spinner = require('react-native-spinkit');


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
      let response = await fetch('http://vituttaa.paitsiossa.net:1337/api/login', { 
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
      return <Spinner size={40} type='ThreeBounce' color='#BBBBBB'/>;
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
        <View style={styles.container}>
            <Image style={styles.bg} source={require('./tausta.png')} />
            <View style={styles.header}>
              {this.renderHeader()}
            </View>
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputUsername} source={require('./user.png')}/>
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
                    <Image style={styles.inputPassword} source={require('./pwd.png')}/>
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
            <TouchableOpacity onPress={this.login}>
              <View style={styles.signin}>
                  <Text style={styles.whiteFont}>Sign In</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.signup}>
                <Text style={styles.greyFont}>Dont have an account?
                </Text>
                <TouchableOpacity onPress={this.register}>
                  <Text style={styles.whiteFont}>  Sign Up</Text>
                </TouchableOpacity>
            </View>
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
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .3,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#FF3366',
        padding: 20,
        alignItems: 'center'
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: .25
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
        flex:0.01,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent'
    },
    input: {
        alignItems: "flex-end",
        width: 200,
        fontSize: 14,
        left: 10,
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
    button: { borderRadius: 5, flex: 1, height: 44, alignSelf: 'stretch', justifyContent: 'center', overflow: 'hidden', }, 
    buttonText: { fontSize: 18, margin: 5, textAlign: 'center', },
})


module.exports = Login1;
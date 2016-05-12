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
      password: ''
    }
  },
    async reg() {

    if(this.state.username === '' || this.state.password === '') {
      alert("lol");
    }

    if(this.password !== this.password2) {
      this.state.error = "Passwords do not match!";
      _setModalVisible(true);
      return;
    }

    try { 


      let response = await fetch('http://192.168.56.1:8080/api/register', { 
          method: 'POST', 
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }, 
          body: JSON.stringify(
            { username: this.state.username, password: this.state.password, secret: this.state.secret, admin: false}) }); 
      let responseJson = await response.json(); 
      if(responesJson.success == false) {
        this.state.error = responseJson.error;
        this._setModalVisible(true);
      }
      else {
        login();
      }
    } 
    catch(error) {  // Handle error
      console.error(error); }
  },

  async login() {

    if(this.state.username === '' || this.state.password === '') {
      alert("lol");
    }

    try { 
      let response = await fetch('http://192.168.56.1:8080/api/login', { 
          method: 'POST', 
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', }, 
          body: JSON.stringify(
            { username: this.state.username, password: this.state.password }) }); 
      let responseJson = await response.json(); 
      this.state.token = responseJson.token;
      if(responesJson.success == false) {
        this._setModalVisible(true);
      }
      else {
        var asdasd = this.loggedin;
        AsyncStorage.setItem('token', this.state.token);
        asdasd();
      }
    } 
    catch(error) {  // Handle error
      console.error(error); }
  },

  loggedin: function() {
    if(!this.state.token) {
      alert("moi");
    }
    this.props.navigator.push({
      id: 'TabPage',
      name: 'Tab',
    });
  },

 

  _setModalVisible(visible) { this.setState({modalVisible: visible}); },

  render: function() {
    this.state.modalVisible = false;
    nav = this.props.navigator;
        return (
        <View style={styles.container}>
          <Modal 
            animated={true} 
            transparent={true} 
            visible={this.state.modalVisible}
            onRequestClose={() => {this._setModalVisible(false)}} > 
              <View style={[styles.modalcontainer]}> 
                <View style={[styles.innerContainer]}> 
                  <Text style={{top: 10}}>this.state.error</Text> 
                  <Button onPress={this._setModalVisible.bind(this, false)} style={styles.modalButton}> Close </Button> 
                </View> 
              </View> 
          </Modal>
            <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.header}>Register</Text>
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
            <TouchableHighlight onPress={this.reg}>
              <View style={styles.signin}>
                  <Text style={styles.whiteFont}>Register</Text>
              </View>
            </TouchableHighlight>
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
        top: 20,
        justifyContent: 'center',
        textAlign: 'center',
        flex: 0.1,
        fontWeight: 'bold',
        fontSize: 30,
        backgroundColor: 'transparent',
        color: '#FFF'

    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#FF3366',
        padding: 20,
        alignItems: 'center',
        marginBottom: 70,
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    inputs: {

        marginTop: 50,
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
    button: { borderRadius: 5, flex: 1, height: 44, alignSelf: 'stretch', justifyContent: 'center', overflow: 'hidden', }, 
    buttonText: { fontSize: 18, margin: 5, textAlign: 'center', },
})


module.exports = Register;
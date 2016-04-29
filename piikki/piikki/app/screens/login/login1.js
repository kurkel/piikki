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
  AsyncStorage
} = React;
  
var Login1 = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
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
      var asdasd = this.loggedin;
      AsyncStorage.setItem('token', this.state.token, function(err, result) {
        asdasd();
      });
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
      token: this.state.token,
    });
  },

  render: function() {
        return (
        <View style={styles.container}>
            <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
            <View style={styles.header}>
                <Image style={styles.mark} source={{uri: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/11009997_10207606930672465_3737485251735034342_n.jpg?oh=b8f0e293d9a6d5196ee23e17b2148b13&oe=57AEB043'}} />
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
                <View style={styles.forgotContainer}>
                    <Text style={styles.greyFont}>Forgot Password</Text>
                </View>
            </View>
            <TouchableHighlight onPress={this.login}>
              <View style={styles.signin}>
                  <Text style={styles.whiteFont}>Sign In</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.signup}>
                <Text style={styles.greyFont}>Dont have an account?<Text style={styles.whiteFont}>  Sign Up</Text></Text>
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
    }
})


module.exports = Login1;
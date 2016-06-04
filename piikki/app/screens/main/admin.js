'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var Accordion = require('react-native-accordion');

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
  

var Admin = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },

  componentDidMount: function() {
    //this.getUsers();
  },

  render: function() {
      return(
      <View>
      </View>
      )
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


module.exports = Admin;
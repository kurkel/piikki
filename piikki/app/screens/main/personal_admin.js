'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
var gel = require('../GlobalElements');

var {get, post} = require('../../api');
var cond_input = require('../inputStyling');
var Events = require('react-native-simple-events');

import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';

var {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  ListView,
  Modal
} = require('react-native');


var PersonalAdmin = React.createClass({
  getInitialState: function() {
    return {
      refreshing: false,
      toggled: false,
      error: "",
      tab:0,
      amount: "0",
      softlimit: 100,
      hardlimit: 100,
      message: "",
    };
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

  getCurrentTab: async function() {
    let responseJson = await get('tab', this.props.navigator, (e) => {
      console.error(error);
    });
    if(responseJson.success) {
      this.setState({tab: responseJson.tab});
      this.setState({currentTabRdy: true});
      this.conditionalTab();
    } 
    else {  // Handle error
      console.error("Could not fetch tab");
    }
  },

  refresh: async function() {
    this.setState({'refreshing': true});
    await this.getLimits();
    await this.getCurrentTab();
    this.setState({'refreshing': false});
  },

  componentDidMount: function() {
    this.refresh();
    Events.on('PersonalAdmin', 'myID', this.refresh);
  },
  getLimits: async function() {
    let limitJson = await get('limits', this.props.navigator, (e) => {
      this.setState({message: "Could not fetch limits :("});
      console.error(e)
    })
    this.setState({'softLimit': limitJson.softlimit, 'hardLimit':limitJson.hardlimit});
  },

  changeTab: async function() {
    var payload = JSON.stringify({'payback': {'amount': this.state.amount}});
    this.setState({'refreshing': true})
    let responseJson = await post('deposit', this.props.navigator, payload, (e)=> {
      console.warn(e);
    });
    if(responseJson.success) {
      this.setState({'amount': "0", 'message':"Deposit successful"})
      await this.refresh();
    } else {
      this.setState({'amount': "0", 'message':"Something went wrong, ask devs"})
    }
    this.setState({'toggled': false});
  },

  open: function() {
    this.setState({'toggled':true});
  },
  message: function() {
    if (this.state.message !== "") {
      return <Text style={[styles.stateMessage, styles.message]}>{this.state.message}</Text>;
    }
    else if (this.state.error !== "") {
      return <Text style={[styles.stateMessage, styles.error]}>{this.state.message}</Text>;
    }
    else if (this.state.refreshing) {
      return (<View style={{justifyContent: 'center', alignItems:'center', flex: 0.8}}>
        <ActivityIndicator size="large" style={{marginTop: 20, height: 200, width: 200}}/>
        </View>);
    }
  },
  conditionalTab: function() {
      var amount = this.state.tab
      if(amount <= this.state.hardLimit) {
        return {'color':'#F73826'}
      }
      else if (amount<= this.state.softLimit) {       
        return {'color':'#F7AF26'}
      }
      else {
        return {'color':'#92F726'}
      }
    },


  render: function() {
      return(
        <View style={[styles.rootView, gel.baseBackgroundColor]}>
          <View style={{flex:0.3}} />
          {this.message()}
          <View style={styles.header}>
            <Text style={styles.headerHelp}>Deposit money to tab:</Text>
            <Text style={styles.headerHelp}>Current tab: <Text style={this.conditionalTab()}>{Number((this.state.tab).toFixed(2))}€</Text></Text>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.open}>
              <View style={[styles.signin, gel.itemBackGroundColor]}>
                <Text style={styles.whiteFont}>Deposit</Text> 
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flex:0.3}} />
          <Modal animationType={"slide"} transparent={true} visible={this.state.toggled}
                  onRequestClose={() => {this.setState({'toggled': !this.state.toggled});}} >
          <TouchableOpacity style={{height: windowSize.height, width: windowSize.width}} onPress={()=>{this.setState({'toggled': !this.state.toggled})}}>
            <View style={styles.modalRow}>
              <TouchableOpacity style={{flex:1}} onPress={() => {}}>
              <View style={{flex:1}}>
                <View style={{flex:0.1}} />
                <Text style={styles.modalHeader}>Deposit</Text>
                <View style={{flex:0.1}} />
                <View style={[cond_input.s.i, {flex:0.2}]}>
                  <TextInput
                    style={{height:20, flex:0.7, borderColor: 'black', color:'#000', textAlign: 'center'}}
                    ref = 'tabAmounts'
                    onChangeText={(text) => {
                      var reg = /^\d*\.?\d*$/
                      if(reg.test(text)) {
                        this.setState({'amount': text});
                      }
                    }}
                    keyboardType={cond_input.t}
                    placeholder={'Amount'}
                    value={this.state.amount}
                  />
                </View>
                <View style={{flex:0.1}} />
                <TouchableOpacity style={styles.modalButton} onPress={this.changeTab} >
                  <Text style={styles.changePass}>Deposit {this.state.amount}€</Text>
                </TouchableOpacity>
                <View style={{flex:0.1}} />
              </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          </Modal>
      </View>
      );
  }
});

var styles = StyleSheet.create({
  modalRow: {
    flexDirection: 'column',
      margin: 10,
      marginTop: windowSize.height/4,
      backgroundColor: '#EEEEEE',
      borderRadius: 5,
      height: windowSize.height/2,
      padding: 5
    },
  signin: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 3,
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
  },
  modalHeader: {
    'textAlign': 'center',
    fontSize: 18,
  },
  accordionInputRow: {
    flexDirection: 'row',
  },
  changeTabButtonInside: {
    borderRadius: 3,
    justifyContent: 'center',
    padding: 10,
  },
  whiteFont: {
      color: '#FFF',
      textShadowColor: '#000',
      textShadowOffset: {
        width: 1,
        height: 1,
      },
      textShadowRadius: 3
  },
  modalButton: {
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 3,
    padding: 10,
    backgroundColor: '#388E3C',
    justifyContent: 'center',
    alignItems: 'center',

  },
  changeTabButtonText: {
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 20,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  rootView: {
    flex:1
  },
  header: {
    justifyContent: 'center',
    flex: 0.3,
  },
  headerHelp: {
    flex: 0.1,
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 20,
    color: '#121212',
  },
  stateMessage: {
    flex:0.1,
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 20,
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  message: {
    color: 'white',
  },
  error: {
    color: 'red',
  },
  accordionHeader: {
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderBottomColor: "#000000",
    borderColor: "transparent",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionHeaderText: {
    fontSize: 20,
    color: 'black',
  },
  accordionHeaderName: {
    textAlign: 'center',
    flex: 0.7,
  },
  accordionHeaderAmount: {
    textAlign: 'center',
    flex: 0.3,
  },
  accordionContent: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderBottomColor: "#CCC",
    borderTopColor: "#CCC",
    borderColor: "transparent",
  },
  accordionTab: {
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 18,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  }
})


module.exports = PersonalAdmin;
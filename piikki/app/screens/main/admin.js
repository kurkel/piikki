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


var Admin = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      usersRdy: false,
      users: ds.cloneWithRows([]),
      ds: ds,
      userKeys: [],
      refreshing: false,
      amounts: {},
      toggled: false,
      selectedUser: -1,
      error: "",
      amount: "",
      softlimit: 100,
      hardlimit: 100,
      message: ""
    };
  },

  refresh: async function() {
    this.setState({'refreshing': true});
    await this.getLimits();
    await this.getUsers();
    this.setState({'refreshing': false});
  },

  componentDidMount: function() {
    this.refresh();
    Events.on('AdminPage', 'myID', this.refresh);
  },
  getLimits: async function() {
    let limitJson = await get('limits', (e) => {
      this.setState({message: "Could not fetch limits :("});
      console.error(e)
    })
    this.setState({'softLimit': limitJson.softlimit, 'hardLimit':limitJson.hardlimit});
  },
  getUsers: async function() {
    var responseJson = await get('admin/getusers', (e)=> {
      this.setState({error:"Could not fetch users"});
      console.error(e);
    });
    var data = [];
    for (var k in Object.keys(responseJson)) {
      var name = "user" + k + "Value";
      var obj = {};
      obj[name] = "";
      this.setState(obj);
      var user = {};
      user = responseJson[k];
      user.id = k;
      user.style=this.conditionalTab(user.amount)
      data.push(user);
    }
    this.setState({users: this.state.ds.cloneWithRows(data)});
    this.setState({usersRdy: true});
  },

  changeTab: async function() {
    this.state.message="";
    this.state.error = "";
    var payload = JSON.stringify({'username':this.state.selectedUsername, 'drinks':{'payback': {'amount':this.state.amount}}});
    var responseJson = await post('admin/tab', payload, (e)=>{
      this.setState({error:"Could not update" + this.state.selectedUsername + "'s tab"});
      console.error(error);
    });
    if(responseJson.success) {
      this.setState({message: "Successfully updated " + this.state.selectedUsername + "'s tab"});
      this.refresh();
    } else {
      this.setState({message: "Failed to update " + this.state.selectedUsername + "'s tab"});
    }
    this.closeModal();
  },
  openModal: function(obj) {
    this.setState({'selectedUser': obj.idx, 'selectedUsername': obj.sec.username, 'toggled':!this.state.toggled});
  },
  closeModal: function() {
    this.setState({'selectedUser': -1, 'selectedUsername': "",'amount':'', 'toggled':false});
  },
  _renderHeader: function(section, index) {
    return (
      <TouchableOpacity onPress={this.openModal.bind(this, {'idx':index, 'sec':section} )} style={styles.accordionHeader}>
        <Text style={[styles.accordionHeaderText, styles.accordionHeaderName]}>{section.username}</Text>
        <Text style={[styles.accordionHeaderText, styles.accordionHeaderAmount]}><Text style={section.style}>{section.amount}</Text>€</Text>
        <Icon ref={'chevron'+index} style={[styles.accordionHeaderAmount, {alignItems: 'center', justifyContent: 'center'}]}
        name={'chevron-right'} size={20} color='#000' />
      </TouchableOpacity>
    );
  },

  renderUsers: function() {
    return (
          <ListView
            dataSource={this.state.users}
            renderRow={this._renderHeader}
            style={{backgroundColor: 'transparent', flex:1}}
            refreshControl={<RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.refresh}
      />}
            />
      );
  },

  renderOrSpinner: function(rdy, func){
    if (rdy) {
     return func();
    }
    else {
      return(<View style={{justifyContent: 'center', alignItems:'center', flex: 0.8}}>
        <ActivityIndicator style={{marginTop: 20, height: 100, width: 100}}/>
        </View>);
    }
  },

  message: function() {
    if (this.state.message !== "") {
      return <Text style={[styles.stateMessage, styles.message]}>{this.state.message}</Text>;
    }
    else if (this.state.error !== "") {
      return <Text style={[styles.stateMessage, styles.error]}>{this.state.message}</Text>;
    }
  },
  conditionalTab: function(amount) {
      if(amount >= this.state.hardLimit) {
        return {'color':'#F73826'}
      }
      else if (amount>= this.state.softLimit) {       
        return {'color':'#F7AF26'}
      }
      else {
        return {'color':'#92F726'}
      }
    },
  render: function() {
      return(
        <View style={styles.rootView}>
        <View style={styles.header}>
          <Text style={styles.headerHelp}>Positive values are withdrawals and negative values are deposits</Text>
          {this.message()}
        </View>
            {this.renderOrSpinner(this.state.usersRdy, this.renderUsers)}
            <Modal animationType={"slide"} transparent={true} visible={this.state.toggled}
                  onRequestClose={() => {this.setState({'toggled': !this.state.toggled});}} >
          <TouchableOpacity style={{height: windowSize.height, width: windowSize.width}} onPress={()=>{this.setState({'toggled': !this.state.toggled})}}>
            <View style={styles.modalRow}>
              <TouchableOpacity style={{flex:1}} onPress={() => {}}>
              <View style={{flex:1}}>
                <View style={{flex:0.1}} />
                <Text style={styles.modalHeader}>Change tab for {this.state.selectedUsername}</Text>
                <View style={{flex:0.1}} />
                <View style={[cond_input.s.i, {flex:0.2}]}>
                  <TextInput
                    style={{height:20, flex:0.7, borderColor: 'black', color:'#000', textAlign: 'center'}}
                    ref = 'tabAmounts'
                    onChangeText={(text) => {
                      var reg = /^-?\d*\.?\d*$/
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
                  <Text style={styles.changePass}>Tab {this.state.selectedUsername}</Text>
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
    color: 'green',
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


module.exports = Admin;
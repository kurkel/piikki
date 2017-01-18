'use strict';
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
var gel = require('../GlobalElements');


import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';

var {
  AppRegistry,
  Animated,
  Easing,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Navigator,
  TouchableOpacity,
  AsyncStorage,
  Modal,
  ListView,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} = require('react-native');

var Admin = React.createClass({
  getInitialState: function() {
    return {
      usersRdy: false,
      users: {},
      userKeys: [],
      refreshing: false,
    };
  },

  componentDidMount: function() {
    this.setState({'refreshing': true});
    this.getUsers().then(()=> {
      this.setState({'refreshing': false});
    })
  },

  getUsers: async function() {
    var app = this
    var asd = AsyncStorage.getItem('token', async function(err, result){
      try {
            let response = await fetch(env.host + 'admin/getusers', { 
                method: 'GET', 
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
            let responseJson = await response.json();
            var data = [];
            for (var k in Object.keys(responseJson)) {
              var name = "user" + k + "Value";
              var obj = {};
              obj[name] = "";
              app.setState(obj);
              var user = {};
              user = responseJson[k];
              user.id = k;
              data.push(user);
            }
            app.setState({users: data});
            app.setState({usersRdy: true});
          } 
          catch(error) {  // Handle error
            app.setState({error:"Could not fetch users"});
            console.error(error); }
    });
  },

  changeTab: function(id) {
    console.log(id);
    this.state.message="";
    this.state.error = "";
    var name = "name"+id+"Value";
    var app = this;
    var asd = AsyncStorage.getItem('token', async function(err, result){
        try {
            let response = await fetch(env.host + 'admin/tab', { 
              method: 'POST', 
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }, 
              body: JSON.stringify({'username':app.state.users[id].username, 'drinks':{'payback': app.state[name]}})
            }); 
            let responseJson = await response.json();
            if(responseJson.success) {
              app.setState({message: "Successfully updated " + app.state.users[id].username + "'s tab"});
              app.state[name] = ""
            }
          } 
          catch(error) {  // Handle error
            app.setState({error:"Could not update" + app.state.users[id].username + "'s tab"});
            console.error(error); }
      });
  },

  _renderHeader: function(section, index) {
    return (
      <View style={styles.accordionHeader}>
        <Text style={[styles.accordionHeaderText, styles.accordionHeaderName]}>{section.username}</Text>
        <Text style={[styles.accordionHeaderText, styles.accordionHeaderAmount]}>{section.amount}€</Text>
        <Icon ref={'cheron'+index} style={[styles.accordionHeaderAmount, {alignItems: 'center', justifyContent: 'center'}]}
        name={'chevron-right'} size={20} color='#000' />
      </View>
    );
  },

  _renderRow: function(section, index)   {
    
 
  var name = "user"+index+"Value";

    return (
      <View style={[styles.accordionContent, gel.itemBackGroundColor]}>
        <Text style={styles.accordionTab}>Add or decrease tab:</Text>
        <View style={styles.accordionInputRow}>
          <TextInput
            style={{height:50, flex:0.7, borderColor: 'black', color:'#000', textAlign: 'center'}}
            ref = {name}
            onChangeText={(text) => {
              var reg = /^-?\d*\.?\d*$/
              if(reg.test(text)) {
                var obj = {};
                obj[name] = text;
                this.setState(obj);
              }
            }}
            keyboardType={'numeric'}
            placeholder={'Amount'}
            value={this.state[name]}

          />
          <View style={{flex:0.1}} />
          <TouchableOpacity key={name} onPress={this.changeTab.bind(this, index)}>
            <View style={[styles.changeTabButtonInside, gel.loginButtonColor]}>
              <Text style={styles.changeTabButtonText}>Tab!</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  renderUsers: function() {
    return (
      <View style={{flex:0.8}}>
        <Accordion
          sections={this.state.users}
          renderContent={this._renderRow}
          renderHeader={this._renderHeader}
          style={{backgroundColor: 'transparent'}}
          />
      </View>
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

  render: function() {
      return(
      <ScrollView contentContainerStyle={{flex:1}} refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.componentDidMount} />
                      } 
        style={styles.rootView}>
        <View style={styles.header}>
          <Text style={styles.headerHelp}>Positive values are withdrawals and negative values are deposits</Text>
          <View style={{flex:0.05}}/>
            {this.message()}
          </View>
        {this.renderOrSpinner(this.state.usersRdy, this.renderUsers)}
      </ScrollView>
      );
  }
});

var styles = StyleSheet.create({
  bg: {
    position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right:0,
        height: windowSize.height,
        width: windowSize.width,
  },
  accordionInputRow: {
    flexDirection: 'row',
  },
  changeTabButtonInside: {
    borderRadius: 3,
    justifyContent: 'center',
    padding: 10,
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
    flex:1,
  },
  header: {
    padding:20,
    justifyContent: 'center',
    flex: 0.3,
  },
  headerHelp: {
    flex: 0.45,
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 20,
    color: '#121212',
  },
  headerText: {
    flex:0.5,
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 30,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  stateMessage: {
    flex:0.4,
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
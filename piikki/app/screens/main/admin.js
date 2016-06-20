'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
import Video from 'react-native-video';
var Spinner = require('react-native-spinkit');
import Accordion from 'react-native-collapsible/Accordion';

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
  ListView,
} = React;

var Admin = React.createClass({
  getInitialState: function() {
    return {
      usersRdy: false,
      users: {},
      userKeys: [],
    };
  },

  componentDidMount: function() {
    this.getUsers();
  },

  getUsers: async function() {
    var app = this
    var asd = AsyncStorage.getItem('token', async function(err, result){
      try {
            let response = await fetch('http://vituttaa.paitsiossa.net:1337/api/admin/getusers', { 
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
            let response = await fetch('http://vituttaa.paitsiossa.net:1337/api/admin/tab', { 
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
      <View style={styles.accordionPill}>
        <Text style={styles.accordionPillText}>{section.username}</Text>
      </View>
    );
  },

  _renderRow: function(section, index)   {
    
 
  var name = "user"+index+"Value";

    return (
      <View style={styles.accordionContent}>
        <Text style={styles.accordionTab}>Current Tab: {section.amount}€</Text>
        <Text style={styles.accordionTab}>Add or decrease tab:</Text>
        <View style={styles.accordionInputRow}>
          <TextInput
            style={{height:30, flex:0.7, borderColor: 'black', borderWidth: 1, color:'#D8D8D8',}}
            onChangeText={(text) => this.state[name] = text}
            keyboardType={'numeric'}

          />
          <View style={{flex:0.1}} />
          <View style={styles.changeTabButton}>
            <TouchableOpacity key={name} onPress={this.changeTab.bind(this, index)}>
              <View style={styles.changeTabButtonInside}>
                <Text style={styles.changeTabButtonText}>Tab!</Text>
              </View>
            </TouchableOpacity>
          </View>
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
        <Spinner size={100} type='ThreeBounce' color='#BBBBBB'/>
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
      <View style={styles.rootView}>
        <Video source={{uri: 'tab'}} // Can be a URL or a local file.
               rate={1.0}                   // 0 is paused, 1 is normal.
               volume={0}                 // 0 is muted, 1 is normal.
               muted={false}                // Mutes the audio entirely.
               paused={false}               // Pauses playback entirely.
               resizeMode="cover"           // Fill the whole screen at aspect ratio.
               repeat={true}                // Repeat forever.
               playInBackground={false}     // Audio continues to play when app entering background.
               playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown.
               style={styles.bg} />
        <View style={styles.header}>
          <Text style={styles.headerText}>Piikki Admin:</Text>
          <Text style={styles.headerHelp}>Positive values are withdrawals and degative values are deposits</Text>
          <View style={{flex:0.05}}/>
            {this.message()}
        </View>
        {this.renderOrSpinner(this.state.usersRdy, this.renderUsers)}
      </View>
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
  changeTabButton: {
    flex:0.3,
  },
  changeTabButtonInside: {
    flex:1,
    borderWidth:1,
    borderRadius: 20,
    justifyContent: 'center',
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
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
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
  accordionPill: {
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: 'center',
    borderWidth: 1,
    borderBottomColor: "#CCC",
    borderTopColor: "#CCC",
    borderColor: "transparent",
  },
  accordionPillText: {
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 30,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  accordionContent: {
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.4)",
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
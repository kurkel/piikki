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
  Modal,
  ScrollView
} = React;

var Spinner = require('react-native-spinkit');
import Video from 'react-native-video';

var Stats = React.createClass({
  getInitialState: function() {
    return {
      currentTabRdy: false,
      ownOverallRdy: false,
      ownMonthRdy: false,
      topListRdy: false,
      tab: 0,
      toplist: {},

    }
  },

  getCurrentTab: async function() {
    var app = this
    var asd = AsyncStorage.getItem('token', async function(err, result){
      try {
            let response = await fetch('http://vituttaa.paitsiossa.net:1337/api/prices', { 
                method: 'GET', 
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
            let responseJson = await response.json();
            app.setState({tab: responseJson.tab})
            app.setState({currentTabRdy: true})
          } 
          catch(error) {  // Handle error
            console.error(error); }
    });
  },

  getCurrentOwn: function() {
    var app = this
    var asd = AsyncStorage.getItem('token', async function(err, result){
      try {
            let response = await fetch('http://vituttaa.paitsiossa.net:1337/api/tab', { 
                method: 'GET', 
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
            let responseJson = await response.json();
            app.setState({tab: responseJson.tab})
            app.setState({currentTabRdy: true})
          } 
          catch(error) {  // Handle error
            console.error(error); }
    });
  },

  getTopList: function () {
    var app = this
    var asd = AsyncStorage.getItem('token', async function(err, result){
      try {
            let response = await fetch('http://vituttaa.paitsiossa.net:1337/api/toplist', { 
                method: 'GET', 
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
            let responseJson = await response.json();
            delete responseJson.success
            app.setState({toplist: responseJson})
            app.setState({topListRdy: true})
          } 
          catch(error) {  // Handle error
            console.error(error); }
    });
  },

  componentDidMount: function() {
    this.getCurrentTab();
    this.getTopList();
  },


  renderTab: function() {
    return <Text style={styles.currentTabText}>{this.state.tab}€</Text>;
  },

  renderOwnOverall: function() {
    return <Text>Moi</Text>;
  },

  renderOwnMonth: function() {
    return <Text>Moi</Text>;
  },

  renderTopList: function() {
    var resp = [];
    var keys = Object.keys(this.state.toplist)
    for (key in keys) {
      resp.push(
        <View key={key} style={styles.toplistItem}>
          <Text style={[styles.toplistName, styles.toplistText]}>{this.state.toplist[key].username}</Text>
          <Text style={[styles.toplistAmount, styles.toplistText]}>{this.state.toplist[key].amount} drinks</Text>
        </View>
      );
    }
    return resp;

  },

  renderOrSpinner: function(rdy, func){
    if (rdy) {
     return func();
    }
    else {
      return(<View style={{justifyContent: 'center', alignItems:'center', flex: 0.8}}>
        <Spinner size={100} type='ThreeBounce' color='#BBBBBB' />
        </View>);
    }
  },



  getStats: function() {

  },

  render: function() {
    return(
      <View style={{flex: 1}}>
        <Video source={{uri: 'stats'}} // Can be a URL or a local file.
               rate={1.0}                   // 0 is paused, 1 is normal.
               volume={0}                 // 0 is muted, 1 is normal.
               muted={false}                // Mutes the audio entirely.
               paused={false}               // Pauses playback entirely.
               resizeMode="cover"           // Fill the whole screen at aspect ratio.
               repeat={true}                // Repeat forever.
               playInBackground={false}     // Audio continues to play when app entering background.
               playWhenInactive={false}     // [iOS] Video continues to play when control or notification center are shown.
               style={styles.bg} />
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerText}>Stats:</Text>
          </View>
          <View >
            <View style={styles.currentTab}>
              <Text style={styles.subTopic}>Current Tab:</Text>
              {this.renderOrSpinner(this.state.currentTabRdy, this.renderTab)}
            </View>
            <View style={styles.ownOverall}>
              {this.renderOrSpinner(this.state.ownOverallRdy, this.renderOwnOverall)}
            </View>
            <View style={styles.ownMonth}>
              {this.renderOrSpinner(this.state.ownMonthRdy, this.renderOwnMonth)}
            </View>
            <View style={styles.topList}>
            <Text style={styles.subTopic}>Top drunks alltime:</Text>
            {this.renderOrSpinner(this.state.topListRdy, this.renderTopList)}
            </View>
          </View>
        </ScrollView>
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
    right: 0,
    height: windowSize.height,
    width: windowSize.width,
  },
  header: {
    padding:20,
    justifyContent: 'center',
    flex: 0.5,
    borderWidth: 1,
    borderBottomColor: "#CCC",
    borderColor: "transparent",
  },
  subTopic: {
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 25,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  headerText: {
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 30,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  currentTab: {
    padding: 15,
    flex: 0.3,
    borderWidth: 1,
    borderBottomColor: "#CCC",
    borderColor: "transparent",

  },
  ownOverall: {
    padding: 15,
    flex: 0.3,
    borderWidth: 1,
    borderBottomColor: "#CCC",
    borderColor: "transparent",

  },
  ownMonth: {
    padding: 15,
    flex: 0.3,
    borderWidth: 1,
    borderBottomColor: "#CCC",
    borderColor: "transparent",

  },
  topList: {
    padding:15,
  },
  currentTabText:{
    textAlign: 'center',
    fontWeight:'bold',
    fontSize: 25,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  toplistText:{
    fontWeight:'bold',
    fontSize: 20,
    color: 'white',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },

  toplistItem: {
    flexDirection: 'row',

  },
  toplistName: {
    flex:0.5,
    textAlign: 'center',
    justifyContent: 'center'
  },
  toplistAmount: {
    flex:0.5,
    textAlign: 'center',
    justifyContent: 'center'
  }
});

module.exports = Stats
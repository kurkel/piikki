var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
var gel = require('../GlobalElements');

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
  ScrollView,
  ActivityIndicator,
  RefreshControl
} = require('react-native');


var Stats = React.createClass({
  getInitialState: function() {
    return {
      currentTabRdy: false,
      drinkStatsRdy: false,
      topListRdy: false,
      drinkStats: false,
      tab: 0,
      toplist: {},
      refreshing: false,

    }
  },

  getCurrentTab: async function() {
    var app = this
    var asd = AsyncStorage.getItem('token', async function(err, result){
      try {
            let response = await fetch(env.host+'tab', { 
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
            let response = await fetch(env.host + 'toplist', { 
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

  getDrinkStats: function () {
    var app = this
    var asd = AsyncStorage.getItem('token', async function(err, result){
      try {
            let response = await fetch(env.host + 'drinkstats', { 
                method: 'GET', 
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
            let responseJson = await response.json();
            delete responseJson.success
            app.setState({drinkStats: responseJson})
            app.setState({drinkStatsRdy: true})
          } 
          catch(error) {  // Handle error
            console.error(error); }
    });
  },

  componentDidMount: function() {
    this.fetchStats();
  },

  fetchStats: function() {
    this.setState({refreshing: true});
    this.getCurrentTab()
    .then(this.getTopList)
    .then(() => {
      this.setState({refreshing: false});
    });
    
    //this.getDrinkStats();
  },

  renderTab: function() {
    return <Text style={styles.currentTabText}>{this.state.tab}€</Text>;
  },

  renderOwnOverall: function() {
    return <Text>Moi</Text>;
  },

  renderOwnOverall: function() {
    return <Text>Moi</Text>;
  },

  renderList: function() {
    return <Text>Moi</Text>;
  },

  renderTopList: function() {
    var resp = [];
    var keys = Object.keys(this.state.toplist)
    for (var key = 0; key < keys.length; key++) {
      if (key === 0) {
        resp.push(
        <View key={key} style={styles.toplistItem}>
          <Text style={[styles.toplistName, styles.toplistTextFirst]}>{this.state.toplist[keys[key]].username}</Text>
          <Text style={[styles.toplistAmount, styles.toplistTextFirst]}>{this.state.toplist[keys[key]].amount} drinks</Text>
        </View>
      );
      } else {
        resp.push(
        <View key={key} style={styles.toplistItem}>
          <Text style={[styles.toplistName, styles.toplistText]}>{this.state.toplist[keys[key]].username}</Text>
          <Text style={[styles.toplistAmount, styles.toplistText]}>{this.state.toplist[keys[key]].amount} drinks</Text>
        </View>
      );
      }
    }
    return resp;

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

  render: function() {
    return(
      <View style={[{flex: 1}, gel.baseBackgroundColor]}>
        <ScrollView refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.fetchStats} />}
        >
            <View style={styles.card}>
              <View style={[styles.cardContent, gel.itemBackGroundColor]}>
              {this.renderOrSpinner(this.state.topListRdy, this.renderTopList)}
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>TOP DRUNK</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    margin: 5,
    borderRadius: 3,
    elevation: 5,
  },
  cardContent: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingTop: 10,
    paddingBottom: 10,
  },
  cardFooterText: {
  },
  cardFooterText: {
    marginLeft: 20,
    fontSize: 20,
    color: '#757575',
    paddingBottom: 10,
    paddingTop: 10
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
    color: '#757575',
  },
  toplistTextFirst:{
    marginTop: 10,
    marginBottom: 10,
    fontWeight:'bold',
    fontSize: 25,
    color: 'black',
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
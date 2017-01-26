var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
var gel = require('../GlobalElements');
var {get, post} = require('../../api');

var {
  StyleSheet,
  View,
  Text,
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
    let responseJson = await get('tab', (e) => {
      console.error(error);
    });
    if(responseJson.success) {
      this.setState({tab: responseJson.tab});
      this.setState({currentTabRdy: true});
    } 
    else {  // Handle error
      console.error("Could not fetch tab");
    }
  },

  getTopList: async function () {
    let responseJson = await get('toplist', (e) => {
      console.error(error);
    });
    if(responseJson.success) {
      delete responseJson.success
      this.setState({toplist: responseJson})
      this.setState({topListRdy: true})
    }
    else {  // Handle error
      console.error(error);
    }
  },

  getDrinkStats: function () {
      //needs implementation
  },

  componentDidMount: function() {
    this.fetchStats();
  },

  fetchStats: async function() {
    this.setState({refreshing: true});
    await this.getCurrentTab();
    await this.getTopList();
    this.setState({refreshing: false});
    
    //this.getDrinkStats();
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
    marginLeft: 20,
    fontSize: 20,
    color: '#757575',
    paddingBottom: 10,
    paddingTop: 10
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
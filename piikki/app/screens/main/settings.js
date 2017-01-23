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

import Toast, {DURATION} from 'react-native-easy-toast'

var Stats = React.createClass({
  getInitialState: function() {
    return {
      oldPassword: 'asd',
      currentPassword: '',
      confirmCurrentPassword: '',
      rdy: false,
      toggled: false,
      refreshing: false,

    }
  },

  refresh: function() {
    this.setState({'refreshing': true});
    var app = this;
    this.getTransactions().then(()=> {
      app.setState({'refreshing': false});
    });
  },

  getTransactions: async function() {
    this.setState({'transactions':[
      {'name':'Beer', 'amount':2, 'price':1, 'time': new Date()},
      {'name':'Vodka + Mixer', 'amount':1, price:'3', 'time': new Date()},
      {'name':'Vodka + Mixer2', 'amount':1, price:'3', 'time': new Date()},
      {'name':'Vodka + Mixer3', 'amount':1, price:'3', 'time': new Date()},
      {'name':'Vodka + Mixer4', 'amount':1, price:'3', 'time': new Date()},
      {'name':'Vodka + Mixer5', 'amount':1, price:'3', 'time': new Date()},
      {'name':'Vodka + Mixer6', 'amount':1, price:'3', 'time': new Date()},
      {'name':'Vodka + Mixer7', 'amount':1, price:'3', 'time': new Date()},
    ]});
    this.setState({'rdy': true});
  },

  changePassword: function () {
    if (this.state.oldPassword === '' || this.state.currentPassword === '' || this.state.confirmCurrentPassword !== this.state.currentPassword) {
      this.refs.toast.show('Passwords empty, wrong or did not match.', DURATION.LENGTH_LONG)
    }
    else {
      this.refs.toast.show('Password changed successfully!', DURATION.LENGTH_LONG)
    }
    this.setState({'toggled': !this.state.toggled});
  },

  logout: function () {
    var app = this;
    AsyncStorage.removeItem("admin", function(err, resp) {
      AsyncStorage.removeItem('token', function(err, resp) {
        app.props.navigator.pop();
      });  
    });
    
  },

  componentDidMount: function() {
    this.getTransactions()
  },

  renderTransactions: function() {
    if (this.state.transactions) {
      var resp = [];
      for(let item of this.state.transactions) {
        const d = item.time;
        var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        resp.push(
          <View style={styles.card} key={item.time + item.name}>
            <View style={[styles.cardBody, gel.itemBackGroundColor]}>
              <Text style={styles.drinkName}>{item.name}</Text>
              <Text style={styles.drinkAmount}>{item.amount} pcs.</Text>
              <Text style={styles.drinkPrice}>{item.price}€</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.drinkTime}>{datestring}</Text>
            </View>
          </View>
        )
      }
      return resp;
    } else {
      return <Text style={styles.noneTransactions}>None yet!</Text>
    }
  },

  showModal: function() {
    this.setState({'toggled': !this.state.toggled});
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
        <View style={styles.buttons}>
          <View style={styles.button}>
            <TouchableOpacity onPress={this.logout}>
              <View style={[styles.signin, gel.itemBackGroundColor]}>
                <Text style={styles.whiteFont}>Logout</Text> 
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity onPress={this.showModal}>
              <View style={[styles.signin, gel.itemBackGroundColor]}>
                <Text style={styles.whiteFont}>Change password</Text> 
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.transactionHeader}>Latest transactions</Text>
        <ScrollView refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                      }  style={{flex: 2}} contentContainerStyle={gel.baseBackgroundColor}>
          {this.renderOrSpinner(this.state.rdy, this.renderTransactions)}
        </ScrollView>
      <Modal animationType={"slide"} transparent={true} visible={this.state.toggled}
                  onRequestClose={() => {this.setState({'toggled': !this.state.toggled});}} >
            <View style={styles.accordionInputRow}>
              <View style={{flex:0.1}} />
              <Text style={styles.modalHeader}>Change password</Text>
              <View style={{flex:0.1}} />
              <TextInput
                  style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
                  onChangeText={(text) => this.state.oldPassword = text}
                  keyboardType={'numeric'}
                  ref='oldPasswordInput'
                  placeholder='Old Password'
              />
              <TextInput
                  style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
                  onChangeText={(text) => this.state.currentPassword = text}
                  ref='newPasswordInput'
                  placeholder='New password'
              />

              <TextInput
                  style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
                  onChangeText={(text) => this.state.confirmCurrentPassword = text}
                  ref='newPasswordAgainInput'
                  placeholder='Confirm new password'
              />
              <View style={{flex:0.1}} />
              <TouchableOpacity style={styles.modalButton} onPress={this.changePassword} >
                <Text style={styles.tabMe}>Change password</Text>
              </TouchableOpacity>
              <View style={{flex:0.1}} />
            </View>
          </Modal>
      <Toast ref="toast"/>
      </View>
    );
  }

});

var styles = StyleSheet.create({
  transactionHeader: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 25,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  buttons: {
    flex: 0.3,
    alignItems: 'center',
  },
  tabMe: {
    textAlign: 'center',
    justifyContent: 'center',
    color: "#FEFEFE",
    fontSize: 15,
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  button: {
    marginVertical: 10,
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
  drinkTime: {
    margin: 3,
    marginRight: 10,
    flex: 1,
    textAlign: 'right',

  },
  drinkPrice: {
    fontSize: 16,
    textAlign: 'center',
    flex: 0.3

  },
  drinkAmount: {
    fontSize: 16,
    textAlign: 'center',
    flex: 0.3

  },
  drinkName: {
    fontSize: 16,
    textAlign: 'center',
    flex: 0.6,
    color: '#000'
  },
  noneTransactions: {

  },
  signin: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 3,
  },
  accordionInputRow: {
      flexDirection: 'column',
      margin: 10,
      marginTop: windowSize.height/4,
      backgroundColor: '#FFFFFF',
      borderRadius: 5,
      height: windowSize.height/2,
      padding: 5
  },
  modalHeader: {
    'textAlign': 'center',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 5,
    borderRadius: 3,
    elevation: 5,
  },
  cardBody: {
    flexDirection: 'row',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    padding: 5

  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end'

  },
  cardContent: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    paddingTop: 10,
    paddingBottom: 10,
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
var React = require('react');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var env = require('../env');
var gel = require('../GlobalElements');
var cond_input = require('../inputStyling');
var {get, post} = require('../../api');
import InfiniteScrollView from 'react-native-infinite-scroll-view';
var PushNotification = require('react-native-push-notification');
var ReactNative = require('react-native');
var Events = require('react-native-simple-events');

var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Navigator,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Switch
} = require('react-native');

import Toast, {DURATION} from 'react-native-easy-toast'

var Stats = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      username: '',
      oldPassword: 'asd',
      currentPassword: '',
      confirmCurrentPassword: '',
      rdy: false,
      toggled: false,
      refreshing: false,
      lastTransaction: false,
      ds: ds,
      dataSource: ds.cloneWithRows([]),
      enableNotifications: true,
      enableConfirm: true

    }
  },

  refresh: async function() {
    this.setState({'refreshing':true});
    this.getInitialTransactions();
    this.setState({'refreshing':false});
  },

  getOlderTransactions: async function(){
    if(this.state.transactions && !this.state.refreshing && this.state.transactions.length >= 10) {
      this.setState({'refreshing': true});
      var transactions = this.state.transactions;
      let lastID = transactions[transactions.length - 1]._id;
      let responseJson = await get('transaction?oldest=' + lastID, (e) => {
        console.warn(e);
      });
      if(responseJson.success) {
        if (responseJson.transactions && responseJson.transactions.length < 10){
          this.setState({'lastTransaction': true});
        }
        transactions = transactions.concat(responseJson.transactions);
        this.setState({'transactions': transactions, 'dataSource':this.state.ds.cloneWithRows(transactions)});
      }
      this.setState({'refreshing': false});
    }
  },

  getInitialTransactions: async function() {
    let responseJson = await get('transaction', (e)=> {
      console.warn(e);
    });
    if(responseJson.success) {
      if (responseJson.transactions.length < 10){
        this.setState({'lastTransaction': true});
      } else {
        this.setState({'lastTransaction': false});
      }
      this.setState({'transactions': responseJson.transactions, 'dataSource':this.state.ds.cloneWithRows(responseJson.transactions)});
    }
    this.setState({'rdy': true});

  },

  changePassword: async function () {
    if (this.state.oldPassword === '' || this.state.currentPassword === '' || this.state.confirmCurrentPassword !== this.state.currentPassword) {
      this.refs.toast.show('Passwords empty, wrong or did not match.', DURATION.LENGTH_LONG)
    }
    else {
      var payload = JSON.stringify({'password':this.state.oldPassword, 'newpassword':this.state.currentPassword});
      let responseJson = await post('changepassword', payload, (e)=>{
        console.warn(e);
      });
      if (responseJson.success)
        this.refs.toast.show('Password changed successfully!', DURATION.LENGTH_LONG)
      else
        this.refs.toast.show(responseJson.error, DURATION.LENGTH_LONG)
    }
    this.setState({'toggled': !this.state.toggled});
  },

  logout: async function () {
    await AsyncStorage.removeItem("admin");
    await AsyncStorage.removeItem('token');
    this.props.navigator.resetTo({
      id: 'LoginPage',
      name: 'Login',
    });
  },

  componentDidMount: async function() {
    this.getInitialTransactions()
    let n = await AsyncStorage.getItem('notifications');
    let c = await AsyncStorage.getItem('confirm');
    let u = await AsyncStorage.getItem('username');
    confirm = (c !== 'false') ? true : false;
    notifications = (n !== 'false') ? true : false;
    this.setState({'enableNotifications': notifications, 'enableConfirm': confirm, 'username':u});
    Events.on('SettingsPage', 'myID', this.refresh);
  },

  renderComment: function(c) {
    if (c) {
      return <Text style={styles.commentText}>{c}</Text>;
    }
  },
  renderTransactions: function(item) {
        const d = new Date(item.date);
        var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        return (<View style={styles.card} key={item.date + item.product}>
          <View style={[styles.cardBody, gel.itemBackGroundColor]}>
            <Text style={styles.drinkName}>{item.product}</Text>
            <Text style={styles.drinkAmount}>{item.amount} pcs.</Text>
            <Text style={styles.drinkPrice}>{item.pricePer}€</Text>
          </View>
          <View style={styles.cardFooter}>
            {this.renderComment(item.comment)}
            <Text style={styles.drinkTime}>{datestring}</Text>
          </View>
        </View>)
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

  _renderRefreshControl() {
    // Reload all data
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.refresh}
      />
    );
  },

  handleNotiSlider: function(value) {
    AsyncStorage.setItem('notifications', value.toString());
    this.setState({'enableNotifications': value});
    if(!value) {
      PushNotification.cancelAllLocalNotifications();
    }
  },

  handleConfirmSlider: function(value) {
    AsyncStorage.setItem('confirm', value.toString());
    this.setState({'enableConfirm': value});
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
  render: function() {
    return(
      <View style={[{height:windowSize.height}, gel.baseBackgroundColor]}>
      <Text style={styles.userHeader}>Logged in as <Text style={styles.username}>{this.state.username}</Text></Text>
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
        <View style={{flex: 0.1}} />
        <View style={styles.sliderRow}>
          <View style={{flex: 0.2}} />
          <Text style={styles.sliderLabel}>Enable notifications:</Text>
          <Switch style={styles.sliderSwitch} onValueChange={this.handleNotiSlider} value={this.state.enableNotifications} />
          <View style={{flex: 0.2}} />
        </View>
        <View style={styles.sliderRow}>
          <View style={{flex: 0.2}} />
          <Text style={styles.sliderLabel}>Tab confirmation:</Text>
          <Switch style={styles.sliderSwitch} onValueChange={this.handleConfirmSlider} value={this.state.enableConfirm} />
          <View style={{flex: 0.2}} />
        </View>

        <Text style={styles.transactionHeader}>Latest transactions</Text>
        <ListView
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            onLoadMoreAsync={this.getOlderTransactions}
            dataSource={this.state.dataSource}
            renderRow={this.renderTransactions}
            canLoadMore={!this.state.lastTransaction}
            refreshControl={this._renderRefreshControl()}
      >
                      

                </ListView>
      <Modal animationType={"slide"} transparent={true} visible={this.state.toggled}
                  onRequestClose={() => {this.setState({'toggled': !this.state.toggled});}} >
          <ScrollView contentContainerStyle={{height: windowSize.height}} style={{flex: 1}} ref='scrollView'>
          <TouchableOpacity style={{height: windowSize.height, width: windowSize.width}} onPress={this.showModal}>
            <View style={styles.accordionInputRow}>
              <TouchableOpacity style={{flex:1}} onPress={() => {}}>
              <View style={{flex:1}}>
                <View style={{flex:0.1}} />
                <Text style={styles.modalHeader}>Change password</Text>
                <View style={{flex:0.1}} />
                <View style={[cond_input.i, {flex:0.2}]}>
                  <TextInput
                      style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
                      onChangeText={(text) => this.state.oldPassword = text}
                      ref='oldPasswordInput'
                      placeholder='Old Password'
                      onFocus={this.inputFocused.bind(this, 'oldPasswordInput')}
                      secureTextEntry={true}
                      autoCorrect={false}
                  />
                </View>
                <View style={[cond_input.i, {flex:0.2}]}>
                  <TextInput
                      style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
                      onChangeText={(text) => this.state.currentPassword = text}
                      ref='newPasswordInput'
                      onFocus={this.inputFocused.bind(this, 'newPasswordInput')}
                      placeholder='New password'
                      secureTextEntry={true}
                      autoCorrect={false}
                  />
                </View>
                <View style={[cond_input.i, {flex:0.2}]}>
                  <TextInput
                      style={{height:20, flex:0.2, color:'#121212', textAlign:'center'}}
                      onChangeText={(text) => this.state.confirmCurrentPassword = text}
                      ref='newPasswordAgainInput'
                      onFocus={this.inputFocused.bind(this, 'newPasswordAgainInput')}
                      placeholder='Confirm new password'
                      secureTextEntry={true}
                      autoCorrect={false}
                  />
                </View>
                <View style={{flex:0.1}} />
                <TouchableOpacity style={styles.modalButton} onPress={this.changePassword} >
                  <Text style={styles.changePass}>Change password</Text>
                </TouchableOpacity>
                <View style={{flex:0.1}} />
              </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          </ScrollView>
          </Modal>
      <Toast ref="toast"/>
      </View>
    );
  }

});

var styles = StyleSheet.create({
  sliderRow: {
    flexDirection: 'row',
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sliderLabel: {
    flex: 0.7,
    fontSize: 16,
    color: '#FFF',
    marginLeft: 15,
    textAlign: 'center'
  },
  sliderSwitch: {
    flex: 0.3,
    marginRight: 15,
  },
  transactionHeader: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 25,
    marginTop: 15,
    fontWeight: 'bold',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  userHeader: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    marginTop: 10,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  commentText: {
    flex:0.7,
    marginLeft: 3,
    marginBottom: 3,
  },
  buttons: {
    flex: 0.3,
    alignItems: 'center',
  },
  changePass: {
    textAlign: 'center',
    justifyContent: 'center',
    color: "#FEFEFE",
    fontSize: 15,
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  button: {
    marginVertical: 5,
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
    flex: 0.3,
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
    textAlign: 'center',
    textShadowColor: "#000000",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    fontSize: 20,
    color: '#FFF',
    marginTop: 10,
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
  whiteFont: {
      color: '#FFF',
      textShadowColor: '#000',
      textShadowOffset: {
        width: 1,
        height: 1,
      },
      textShadowRadius: 3
  },
});

module.exports = Stats
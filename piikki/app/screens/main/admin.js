'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var Accordion = require('react-native-accordion');
var Spinner = require('react-native-spinkit');


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
            let response = await fetch('http://localhost:8080/api/admin/getusers', { 
                method: 'GET', 
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }});
            let responseJson = await response.json();
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource = ds.cloneWithRows(Object.keys(responseJson));
            for (var k in Object.keys(responseJson)) {
              var name = "user" + k + "Value";
              app.setState({name:0});
            }
            app.setState({users: responseJson});
            app.setState({userKeys: dataSource});
            app.setState({usersRdy: true});
          } 
          catch(error) {  // Handle error
            console.error(error); }
    });
  },

  changeTab: function(id) {
    var name = "name"+id+"Value";
    var app = this;
    var asd = AsyncStorage.getItem('token', async function(err, result){
        try {
            let response = await fetch('http://localhost:8080/api/admin/tab', { 
              method: 'POST', 
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': result }, 
              body: JSON.stringify({'username':app.state.users[id].username, 'drinks':{'payback': -10}})
            }); 
            let responseJson = await response.json();
            console.log(responseJson);
          } 
          catch(error) {  // Handle error
            console.error(error); }
      });
  },

  _renderHeader: function() {
    return <View style={styles.header}>
      <Text style={styles.headerText}>Tab Admin:</Text>
    </View>;
  },

  _renderRow: function(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
    var header = (
      <View style={styles.accordionPill}>
        <Text style={styles.accordionPillText}>{this.state.users[rowID].username}</Text>
      </View>
    );
 
  var name = "user"+rowID+"Value";

    var content = (
      <View style={styles.accordionContent}>
        <Text style={styles.accordionTab}>Current Tab: 10€</Text>
        <Text style={styles.accordionTab}>Add or decrease tab:</Text>
        <View style={styles.accordionInputRow}>
          <TextInput
            style={{height:30, flex:0.7, borderColor: 'gray', borderWidth: 1, color:'red',}}
            onChangeText={(text) => this.setState({name:text})}
            value={this.state[name]}
          />
          <View style={{flex:0.1}} />
          <View style={styles.changeTabButton}>
            <TouchableOpacity onPress={this.changeTab.bind(this, rowID)}>
              <View style={styles.changeTabButtonInside}>
                <Text style={styles.changeTabButtonText}>Tab!</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
 
    return (
      <Accordion
        header={header}
        content={content}
        easing="easeOutCubic"
      />
    );
  },

  renderUsers: function() {
    return (
      <ListView
        dataSource={this.state.userKeys}
        renderRow={this._renderRow}
        renderHeader={this._renderHeader}
        style={{backgroundColor: 'transparent'}}
        />
      );
  },

  renderOrSpinner: function(rdy, func){
    if (rdy) {
     return func();
    }
    else {
      return(<View style={{justifyContent: 'center', alignItems:'center', flex: 0.8}}>
        <Spinner size={100} type='ThreeBounce'/>
        </View>);
    }
  },

  render: function() {
      return(
      <View style={styles.rootView}>
        <Image style={styles.bg} source={{uri: 'https://media.giphy.com/media/5crHVem25Hi24/giphy.gif'}} />
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
    flex: 0.5,
    borderWidth: 1,
    borderBottomColor: "#CCC",
    borderColor: "transparent",
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
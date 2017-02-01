'use strict';

var ReactNative = require('react-native');
var env = require('./screens/env');
var WifiManager = require('react-native-wifi-manager');
var PushNotification = require('react-native-push-notification');


function handleNotiLogic(wifi, cb) {
  wifi.loadWifiList((wifiStringList) => {
      var wifiArray = JSON.parse(wifiStringList);
      var near = wifiArray.filter((item) => {return (item.SSID===env.SSID)});
      if (near.length > 0) {
        PushNotification.localNotification({
          /* Android Only Properties */
          id:'1337',
          ticker: "Happines is just a beer away", // (optional)
          autoCancel: false, // (optional) default: true
          largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
          smallIcon: "ic_notif", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          vibrate: false, // (optional) default: true
          tag: 'beer', // (optional) add tag to message
          ongoing: true, // (optional) set whether this is an "ongoing" notification

          /* iOS and Android properties */
          title: "Happiness is just a beer away", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
          message: "Let's get wasted?", // (required)
          playSound: false, // (optional) default: true
        });
      } else {
        PushNotification.cancelAllLocalNotifications();
      }
      if (cb)
        cb();
    },
    (error) => {
      console.log(error);
    }
  );
}

function checkWifi() {
  var wifi = require('react-native-android-wifi');
  wifi.isEnabled((isEnabled)=>{
    if (isEnabled){
      handleNotiLogic(wifi);
    }else{
      wifi.setEnabled(true);
      setTimeout(()=>{handleNotiLogic(wifi, () => {wifi.setEnabled(false)});}, 20000);
    }
  });
}


async function handleNotification(TaskData) {
  checkWifi();
}

async function activeHandleNotification(TaskData) {
  checkWifi();
  setTimeout(()=>{activeHandleNotification(TaskData)}, 30000);
}

module.exports = {handleNotification, activeHandleNotification};

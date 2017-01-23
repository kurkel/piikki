'use strict';

var ReactNative = require('react-native');
var env = require('./screens/env');
var WifiManager = require('react-native-wifi-manager');
var PushNotification = require('react-native-push-notification');


function checkWifi() {
  var wifis = []
  return WifiManager.list( (wifiArray) => {
            wifis = wifiArray;
            var near = wifis.filter((item) => {return (item===env.SSID)});
            if (near.length > 0) {

              PushNotification.localNotification({
                /* Android Only Properties */
                id:'1337',
                ticker: "Happines is just a beer away", // (optional)
                autoCancel: false, // (optional) default: true
                largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                vibrate: false, // (optional) default: true
                tag: 'some_tag', // (optional) add tag to message
                ongoing: true, // (optional) set whether this is an "ongoing" notification

                /* iOS and Android properties */
                title: "Happiness is just a beer away", // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
                message: "Let's get wasted?", // (required)
                playSound: false, // (optional) default: true
              });
            } else {
              PushNotification.cancelAllLocalNotifications();
            }
        },
        (msg) => {
            console.log(msg);
        },
    );
  
}


async function handleNotification(TaskData) {
  checkWifi();
  setTimeout(()=>{handleNotification(TaskData)}, 30000);
}

module.exports = handleNotification;

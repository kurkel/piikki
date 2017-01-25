var env = require('./screens/env');

var {
  AsyncStorage
} = require('react-native');

async function get(url, error) {
  var token = await AsyncStorage.getItem('token');
  try {
    return fetch(env.host + url, { 
        method: 'GET', 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token }
    }).then((f) => {
      return f.json();
    });
  } 
  catch(e) {error(e)};
}

async function post(url, payload, err) {
  var token = await AsyncStorage.getItem('token');
  try {
    return fetch(env.host + url, { 
      method: 'POST', 
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token }, 
      body: payload
    }).then((f) => {
      return f.json();
    });
  } catch(e) {
    err(e);
  }
}

module.exports = {
  get,
  post
}
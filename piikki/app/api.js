var env = require('./screens/env');

var {
  AsyncStorage
} = require('react-native');

async function logout(navigator) {
  await AsyncStorage.removeItem("admin");
  await AsyncStorage.removeItem('token');
  navigator.resetTo({
    id: 'LoginPage',
    name: 'Login',
  });
  return;
}

async function get(url, navigator, error) {
  var token = await AsyncStorage.getItem('token');
  try {
    return fetch(env.host + url, { 
        method: 'GET', 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token }
    }).then(async (f) => {
      if (f.status === 403) {
        await logout(navigator);
        return;
      }
      return f.json();
    });
  } 
  catch(e) {error(e)};
}

async function post(url, navigator, payload, err) {
  var token = await AsyncStorage.getItem('token');
  try {
    return fetch(env.host + url, { 
      method: 'POST', 
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token }, 
      body: payload
    }).then(async (f) => {
      if (f.status === 403) {
        await logout(navigator);
        return;
      }
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
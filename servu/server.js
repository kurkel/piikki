// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var _ = require('lodash');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model
var Transaction = require('./app/models/transaction');
var prices = require('./prices');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

/////////////////
// Middlewares //
/////////////////
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(authUser);
app.use(/^\/api\/admin\/\w*/, checkUserClass);
app.use(/^\/api\/admin\/\w*/, adminCheck);

/////////////////
// User routes //
/////////////////
app.post('/api/register', function(req, res) {
  if (req.body.secret !== "ania patiossa") {
    res.json({
      success: false,
      error: "Wrong secret."
    });
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      User.create({
        username: req.body.username,
        password: hash,
        admin: req.body.admin ? req.body.admin : false
      }, function(err) {
        if (err) {
          console.log(err);
          res.status(401).send({
            success: false,
            error: "Username in use."
          });
        } else {
          res.status(200).send({
            success: true
          });
        }
      });
    });
  });
});

app.post('/api/login', function(req, res) {
  if (!req.body.username)
    return res.status(400).send({
      success: false,
      error: "Request didn't include username."
    });
  User.findOne({
    username: req.body.username
  }, 'password', function(err, docs) {
    if (err)
      console.log(err);
    else {
      if (!docs)
        return res.status(401).send({
          success: false,
          error: "Wrong username or password."
        });
      var hash = docs.password;
      bcrypt.compare(req.body.password, hash, function(err, comp) {
        if (err ||  comp == false) {
          console.log(err);
          return res.status(401).send({
            success: false,
            error: "Wrong username or password."
          });
        } else {
          var token = jwt.sign(req.body.username, app.get('superSecret'));
          getTab(req.body.username, function(spike) {
            var prices = getPrices();
            res.status(200).send({
              success: true,
              token: token,
              tab: spike,
              prices: prices
            });
          })
        }
      });
    }
  });
});

app.get('/api/tab', function(req, res) {
  getTab(req.username, function(spike) {
    res.status(200).send({
      tab: spike,
      success: true
    });
  });
});

app.post('/api/tab', function(req, res) {
  console.log(req.body.amount);
  addTab(req.username, req.body, false, function(resp) {
    res.status(200).send(resp);
  });
});

app.post('/api/alltabs', function(req, res) {
  Transaction.aggregate(
    [{
      $group: {
        _id: "$username",
        tab: {
          $sum: "$amount"
        }
      }
    }],
    function(err, result) {
      if (err)
        console.log(err);
      else {
        res.status(200).send(result);
      }
    })
});

app.get('/api/prices', function(req, res) {
  var prices = getPrices();
  getTab(req.username, function(spike) {
    res.status(200).send({
      prices: prices,
      tab: spike,
      success: true
    });
  });
})

app.post('/api/getusers', function(req, res) {
  User.find({}, function(err, docs) {
    if (err) {
      console.log(err);
      res.status(500)
    } else {
      return res.status(200).send(docs);
    }
  })
});

app.post('/api/toplist', function(req, res) {
  Transaction.aggregate(
    [{
      $match: {
        amount: {
          $gt: 0
        }
      }
    }, {
      $group: {
        _id: "$username",
        tab: {
          $sum: "$amount"
        }
      }
    }, {
      $sort: {
        sum: -1
      }
    }],
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        res.status(200).send(result);
      }
    })
});

//////////////////
// Admin routes //
//////////////////

app.post('/api/admin/tab', function(req, res) {
  addTab(req.body.username, req.body, true, function(resp) {
    res.status(200).send(resp);
  });
});

/////////////
// Helpers //
/////////////

function addTab(username, body, admin, cb) {
  _.forEach(body, function(value, key) {
    if (amount >= 0 ||  admin) {
      var newtrans = new Transaction({
        username: username,
        amount: value,
        date: Date.now(),
        product: key,
      });
      newtrans.save(function(err) {
        if (err)
          console.log(err);
        else {
          cb({
            success: true
          })
        }
      });
    } else {
      cb({
        success: false,
        message: 'You are not allowed to spike negatively'
      });
    }
  })
}

function getPrices() {
  return prices;
}

function getTab(username, cb) {
  Transaction.find({
    username: username
  }, 'amount', function(err, docs) {
    if (err)
      console.log(err);
    else {
      var spike = 0;
      docs.forEach(function(args) {
        spike += args.amount;
      });
      cb(spike);
    }
  })
};

//////////////////////////
// Middleware functions //
//////////////////////////
function checkTab(req, res, next) {
  return;
}

function authUser(req, res, next) {
  if (req.path == '/' ||  req.path == '/api/register' ||  req.path == '/api/login') return next();
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    console.log(token);
    jwt.verify(token, app.get('superSecret'), function(err, user) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate'
        });
      } else {
        req.username = user;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
}

function checkUserClass(req, res, next) {
  if (req.username) {
    console.log(req.username);
    User.findOne({
      username: req.username
    }, 'admin', function(err, docs) {
      console.log(docs);
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        req.admin = docs.admin;
        next();
      }
    });
  } else {
    return res.status(400).send({
      success: false,
      message: "No username specified."
    });
  }
}

function adminCheck(req, res, next) {
  console
  if (req.admin) {
    next();
  } else {
    return res.status(403).send({
      success: false,
      message: "You do not have admin rights."
    });
  }
}

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

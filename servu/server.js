// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bcrypt = require('bcrypt');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Transaction   = require('./app/models/transaction');
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
app.use(bodyParser.urlencoded({ extended: false }));
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
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      User.create({
        username: req.body.username,
        password: hash,
        admin: req.body.admin ? req.body.admin : false
      }, function(err){
          if(err){
            console.log(err);
            res.json({success: false});
          }else{
            res.json({success: true});
          }
      });
    });
  });
});

app.post('/api/login', function(req, res){
  User.findOne({username: req.body.username}, 'password', function (err, docs) {
    if(err)
      console.log(err);
    else{
      var hash = docs.password;
      bcrypt.compare(req.body.password, hash, function(err, comp) {
        if(err || comp == false)
          console.log(err);
        else {
          var token = jwt.sign(req.body.username, app.get('superSecret'));
          getTab(req.body.username, function(spike){
            var prices = getPrices();
            res.json({
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

app.get('/api/tab', function(req, res){
  getTab(req.username, function(spike){
    res.json({tab: spike, success: true});
  });
});

app.post('/api/tab', function(req, res){
  addTab(req.username, req.body.amount, false, function(resp){
    res.json(resp);
  });
});

app.post('/api/alltabs', function(req, res){
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
    res.json(result);
  }
})
});

//////////////////
// Admin routes //
//////////////////

app.post('/api/admin/tab', function(req, res){
  addTab(req.body.username, req.body.amount, true, function(resp){
    res.json(resp);
  });
});

/////////////
// Helpers //
/////////////

function addTab(username, amount, admin, cb){
  if(amount>= 0 || admin){
    var newtrans = new Transaction({
      username: username,
      amount: amount,
      date: Date.now()
    });
    newtrans.save(function(err){
      if(err)
        console.log(err);
      else{
         cb({
          success: true
        })
      }
    });
  }else {
    cb({
      success: false,
      message: 'You are not allowed to spike negatively'
    });
  }
}

function getPrices(){
  return prices;
}

function getTab(username, cb){
  Transaction.find({username: username}, 'amount', function(err, docs){
    if(err)
      console.log(err);
    else{
      var spike = 0;
      docs.forEach(function(args){
        spike += args.amount;
      });
      cb(spike);
    }
})};

//////////////////////////
// Middleware functions //
//////////////////////////
function authUser(req, res, next) {
  if ( req.path == '/' || req.path == '/api/register' || req.path == '/api/login') return next();
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token){
    console.log(token);
    jwt.verify(token, app.get('superSecret'), function(err, user){
      if(err){
        return res.json({success: false, message: 'Failed to authenticate'});
      }else{
        req.username = user;
        next();
      }
    });
  } else{
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
}

function checkUserClass(req, res, next) {
  if(req.username){
    console.log(req.username);
    User.findOne({username: req.username}, 'admin', function(err, docs){
      console.log(docs);
      if(err)
        console.log(err);
      else{
        req.admin = docs.admin;
        next();
      }
    });
  }else{
    return res.status(403).send({
      success: false,
      message: "Wtf??"
    });
  }
}

function adminCheck(req, res, next) {
  console
    if(req.admin){
      next();
    } else{
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

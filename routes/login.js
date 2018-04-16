var express = require('express');
var router = express.Router();
var passcrypt = require('password-hash-and-salt');

router.post('/login', function(req,res) {
  user.find({'username': req.body.username}, function(err, user) {
    if(err) res.send(err);
    else {
      if(user.length > 0) {
        ValidatePass(req.body.password, user[0].password, function(result) {
          if(result) {
            var userToken = {name: user[0].name, username: user[0].username};
            var token = jwt.sign(userToken, process.env.SECRET_KEY);
            res.json({success: true, token: 'JWT ' + token});
          }
          else {
            res.send("Invalid Password");
          }
        });
      }
      else {
        res.send("User not found");
      }
    }
  });
});

router.post('/register', function(req,res) {
  user.find({'username': req.body.username}, function(err, users) {
    if(err) res.send(err);
    else {
      if(users.length > 0) {
        res.send("A user with the username already exists!");
      }
      else {
        passcrypt(req.body.password).hash(function(error, hash) {
          if(error) {
            res.send("There was an error hashing the password!");
          }//TODO: Split salt off hash and store in separate table.
          else {
            var newUser = new user({
              username: req.body.username,
              name: req.body.name,
              password: hash
            });
            newUser.save(function(err, data) {
              if(err) {
                res.send("There was an error registering the user!");
              }
              else {
                res.send("Registration Successful!");
              }
            });
          }
        });
      }
    }
  });
});

//This function will take the password and validate it against the existing hash
function ValidatePass(pass, hash, finish) {
  passcrypt(pass).verifyAgainst(hash, function(error, verified) {
    if(error) {
      finish(false);
    }
    if(!verified) {
      finish(false);
    }
    else {
      finish(true);
    }
  })
};

module.exports = router;

/*
File: request.js
Purpose: sets up functionality for a request
*/


var express = require('express');
var router = express.Router();
var passcrypt = require('password-hash-and-salt');
var general = require('../security');

router.post('/login', function(req, res) {
  var username = req.body.username;
  username = username.toLowerCase();
  var password = req.body.password;
  general.pool.query("SELECT * FROM `user` WHERE username='" + username + "'", function (err, result, fields) {
    if(err) throw err;
    var user = result;
    if(user.length > 0) {
      if(user[0].username == username) {
        passcrypt(password).verifyAgainst(user[0].password, function(error, verified) {
          if(error) {
            res.send("0");
          }
          if(!verified) {
            res.send("0");//0 indicates invalid pass
          }
          else {
            var timestamp = new Date();
            timestamp = general.AddMins(timestamp, 15);
            timestamp = general.DateToSql(timestamp);
            var token = GenToken();
            var sessiontoken = username + "@" + token;
            general.pool.query("DELETE FROM `tokentracker` WHERE `user` = '" + username + "'", function(err,result,fields) {
              general.pool.query("INSERT INTO `tokentracker` (`token`, `user`, `expiration`) VALUES ('" + token.toString() + "', '" + username + "', '" + timestamp + "');", function(error, result) {
                if(error) {
                  res.send('-1');
                }
                else {
                  general.pool.query("UPDATE `users` SET `lastlogin` = '" + general.DateToSql(new Date()) + "' WHERE `username` = '" + username + "'");
                  res.cookie('session', sessiontoken, { 
                    maxAge: 1000 * 60 * 60 * 24, 
                    httpOnly: true, 
                    signed: true 
                  });
                  res.send("1");//auth passed respond with 1.
                }
              });
            });
          }
        })
      }
      else {
        res.send("-1");//-1 indicates invalid username
      }
    }
    else {
      general.Log("SECURITY", "Someone attempted to login using the username: " + username, "SECURITY")
      res.send("-1");//-1 indicates invalid username
    }
  })
});

router.post('/register', function(req, res) {
  var username = req.body.username;
  username = username.toLowerCase();
  var password = req.body.password;
  var name = req.body.name;
  passcrypt(password).hash(function(error, hash) {
    if(error) {
      res.send("Error Contact Developer! -- ErrMSG: " + error.message);
    }//TODO: Split salt off hash and store in separate table.
    general.pool.query("INSERT INTO `user` (`username`, `password`, `name`, `donated`) VALUES (" + general.mysql.escape(username) + ", " + general.mysql.escape(hash) + ", " + general.mysql.escape(name) + ", 0)", function(error,result,fields){
      if(error){
        general.Log(req.signedCookies.session.split("@")[0], error.message, "ERROR");
        res.send("Error Contact Developer! -- ErrMSG: " + error.message);
      }
      else {
        res.send("1");
      }
    });
  });
});

//This function will take the password and validate it against the existing hash
function ValidatePass(pass, hash) {
  passcrypt(pass).verifyAgainst(hash, function(error, verified) {
    if(error) {
      //console.log("Password Decryption Error");
      return false;
    }
    if(!verified) {
      //console.log("Invalid Password");
      return false;
    }
    else {
      //console.log("Password Verified");
      return true;
    }
  })
};

function GenToken() {//UUIDV4 standard
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

module.exports = router;

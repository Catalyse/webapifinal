var express = require('express');
var router = express.Router();
var passcrypt = require('password-hash-and-salt');
var general = require('../security');

/* This script will be used to make db requests and other types of posts */
router.post('/login', function(req, res) {
  var username = req.body.username;
  username = username.toLowerCase();
  var password = req.body.password;
  var staylogged = req.body.stayloggedin;
  //console.log("Login Request: Username: " + username + " Password: " + password);
  general.pool.query("SELECT * FROM `users` WHERE username=" + general.mysql.escape(username) + ";", function (err, result, fields) {
    if(err) throw err;
    var user = result;
    //console.log("Query Complete");
    //console.log("Query Found User: " + user[0].username);
    if(user.length > 0) {
      if(user[0].username == username) {
        passcrypt(password).verifyAgainst(user[0].password, function(error, verified) {
          if(error) {
            general.Log(username, "Someone attempted to login to: " + username + ", and password decryption failed", "SECURITY")
            res.send("0");
          }
          if(!verified) {
            general.Log(username, "Someone attempted to login to: " + username + " using an invalid password", "SECURITY")
            res.send("0");//0 indicates invalid pass
          }
          else {
            //console.log("Entered pass validation");
            var timestamp = new Date();
            if(staylogged){
              timestamp = general.AddMins(timestamp, 2592000);
            }else{
              timestamp = general.AddMins(timestamp, 15);
            }
            timestamp = general.DateToSql(timestamp);
            var token = GenToken();
            var sessiontoken = username + "@" + token;
            //console.log("Prepping to enter token into db");
            general.pool.query("DELETE FROM `tokentracker` WHERE `user` = '" + username + "'", function(err,result,fields) {
              general.pool.query("INSERT INTO `tokentracker` (`token`, `user`, `permlevel`, `expiration`) VALUES ('" + token.toString() + "', '" + username + "', '" + user[0].permissionsid + "', '" + timestamp + "');");
              res.cookie('session', sessiontoken, { 
                maxAge: 2147483647, 
                httpOnly: true, 
                signed: true 
              });
              res.send("1");//auth passed respond with 1.
            });
          }
        })
      }
      else {
        general.Log("SECURITY", "Someone attempted to login using the username: " + username, "SECURITY")
        res.send("-1");//-1 indicates invalid username
      }
    }
    else {
      general.Log("SECURITY", "Someone attempted to login using the username: " + username, "SECURITY")
      res.send("-1");//-1 indicates invalid username
    }
  })
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

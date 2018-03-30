var express = require('express');
var router = express.Router();
var passcrypt = require("password-hash-and-salt");
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add', function(req, res) {
  general.PostTokenCheck(req, res, "user/add", "ADD", [1], function(result) {
    if(result == true) {
      var username = req.body.username;
      username = username.toLowerCase();
      var password = req.body.password;
      var name = req.body.name;
      passcrypt(password).hash(function(error, hash) {
        if(error) {
          res.send("Error Contact Developer! -- ErrMSG: " + error.message);
        }//TODO: Split salt off hash and store in separate table.
        general.pool.query("INSERT INTO `users` (`username`, `password`, `name`, `donated`) VALUES (" + general.mysql.escape(username) + ", " + general.mysql.escape(hash) + ", " + general.mysql.escape(name) + ", 0)", function(error,result,fields){
          if(error){
            general.Log(req.signedCookies.session.split("@")[0], error.message, "ERROR");
            res.send("Error Contact Developer! -- ErrMSG: " + error.message);
          }
          else {
            res.send("1");
          }
        });
      })
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.post('/edit', function(req, res) {
  general.PostTokenCheck(req, res, "user/edit", "EDIT/ID=" + req.body.username, [1], function(result) {
    if(result == true) {
      if(req.body.editpassword == 'true') {
        var username = req.body.username;
        username = username.toLowerCase();
        var password = req.body.password;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var permid = req.body.permid;
        passcrypt(password).hash(function(error, hash) {
          if(error) {
            general.Log(req.signedCookies.session.split("@")[0], error.message, "ERROR");
            res.send("Error Contact Developer! -- ErrMSG: " + error.message);
          }//TODO: Split salt off hash and store in separate table.
          general.pool.query("UPDATE `users` SET username = " + general.mysql.escape(username) + ", password = " + general.mysql.escape(password) + ", fname = " + general.mysql.escape(fname) + ", lname = " + general.mysql.escape(lname) + ", permissionsid = " + general.mysql.escape(permid) + ", email = " + general.mysql.escape(email) + " WHERE `id` = " + general.mysql.escape(req.body.uid) + ";", function(error,result,fields){
            if(error){
              res.send("Error Contact Developer! -- ErrMSG: " + error.message);
            }
            else {
              res.send("1");
            }
          });
        })
      }
      else {
        var username = req.body.username;
        username = username.toLowerCase();
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        var permid = req.body.permid;
        general.pool.query("UPDATE `users` SET username = " + general.mysql.escape(username) + ", fname = " + general.mysql.escape(fname) + ", lname = " + general.mysql.escape(lname) + ", permissionsid = " + general.mysql.escape(permid) + ", email = " + general.mysql.escape(email) + " WHERE `id` = " + general.mysql.escape(req.body.uid) + ";", function(error,result,fields){
          if(error){
            general.Log(req.signedCookies.session.split("@")[0], error.message, "ERROR");
            res.send("Error Contact Developer! -- ErrMSG: " + error.message);
          }
          else {
            res.send("1");
          }
        });
      }
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.post('/delete', function(req, res) {
  general.PostTokenCheck(req, res, "user/delete", "DELETE/ID=" + req.body.id, [1], function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `users` WHERE `id` = " + general.mysql.escape(req.body.id) + ";", function(err,results,fields) {
        if(err) {
          general.Log(req.signedCookies.session.split("@")[0], err.message, "ERROR");
          res.send("Error Contact Developer! -- ErrMSG: " + err.message);
        }
        else if(req.signedCookies.session.split("@")[0] == results[0].username) {
          res.send("Error: You cannot delete yourself!");
        }
        else {
          general.pool.query("DELETE FROM `users` WHERE `id` = " + general.mysql.escape(req.body.id) + ";", function(err, results, fields) {
            if(err) {
              general.Log(req.signedCookies.session.split("@")[0], err.message, "ERROR");
              res.send("Error Contact Developer! -- ErrMSG: " + err.message);
            }
            else{
              res.send("1");
            }
          });
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.post('/', function(req, res) {
  general.PostTokenCheck(req, res, "user/get", "GET", [1], function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `users` WHERE `id` = " + general.mysql.escape(req.body.uid) + ";", function(err,result,fields) {
        if(err) {
          general.Log(req.signedCookies.session.split("@")[0], err.message, "ERROR");
          res.send("Error Contact Developer! -- ErrMSG: " + err.message);
        }
        else {
          if(result.length > 0) {
            res.send(result);
          }
          else {
            res.send("-1");
          }
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.post('/all', function(req, res) {
  general.PostTokenCheck(req, res, "user/all", "GET", [1], function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `users`", function(err,result,fields) {
        if(err) {
          general.Log(req.signedCookies.session.split("@")[0], err.message, "ERROR");
          res.send("Error Contact Developer! -- ErrMSG: " + err.message);
        }
        else {
          if(result.length > 0) {
            res.send(result);
          }
          else {
            res.send("-1");
          }
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});
//End User Post Requests --------------------------------------------------------------------------------------------------
module.exports = router;
/*
File: router.js
Purpose: sets up functionality for the routes
*/


var express = require('express');
var router = express.Router();
var general = require('../security');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.query.redirect) {//check if the user was redirected by the system so we dont duplicate the token check
    LoginRender(res, true, req.query.from);
  }
  else {
    if(req.signedCookies.session != null && req.signedCookies.session != false){//IF there is already a valid cookie we want to just throw them at the homescreen.
      general.TokenCheck(req.signedCookies.session, res, false, HomeRender, '/home', LoginRender, [1,2,3]);
    }
    else {
      LoginRender(res, false);
    }
  }
});

function LoginRender(res, returnto, returntolocation) {
  if(returnto){
    res.render("login", {returnLocation: returntolocation});
  }
  else{
    res.render("login", {returnLocation: '/home'});
  }
}

//This method clears the session cookie from your browser, and reloads the page to root
router.get('/logout', function(req, res, next) {
  res.clearCookie("session");
  res.redirect(307, "/");
});

//This is a pug endpoint to present the registration page
router.get('/register', function(req, res, next) {
  res.render('register');
});

//This is a auth endpoint to present the home page, which also verifies auth before presenting the page.
//If auth fails the user is redirected to the login page.
router.get('/home', function(req, res, next) {
  if(req.signedCookies.session != null && req.signedCookies.session != false){
    general.TokenCheck(req.signedCookies.session, res, true, HomeRender, '/home', LoginRender, [1]);
  }
  else {
    res.redirect(307, "/");//no token exists
  }
});

//This is the function called if auth is successful
function HomeRender(res, user) {
  res.render('home',{title: 'WebAPI Final Home Page'});
}

//This is a auth endpoint to present the home page, which also verifies auth before presenting the page.
//If auth fails the user is redirected to the login page.
router.get('/cart', function(req, res, next) {
  if(req.signedCookies.session != null && req.signedCookies.session != false){
    general.TokenCheck(req.signedCookies.session, res, true, CartRender, '/cart', LoginRender, [1]);
  }
  else {
    console.log("Inline redirect due to no token reported by client");
    res.redirect(307, "/");//no token exists
  }
});

//This is the function called if auth is successful
function CartRender(res, user) {
  res.render('cart',{title: 'WebAPI Final Cart'});
}

//This is a auth endpoint to present the home page, which also verifies auth before presenting the page.
//If auth fails the user is redirected to the login page.
router.get('/profile', function(req, res, next) {
  if(req.signedCookies.session != null && req.signedCookies.session != false){
    general.TokenCheck(req.signedCookies.session, res, true, ProfileRender, '/profile', LoginRender, [1]);
  }
  else {
    console.log("Inline redirect due to no token reported by client");
    res.redirect(307, "/");//no token exists
  }
});

//This is the function called if auth is successful
function ProfileRender(res, user) {
  general.pool.query("SELECT * FROM `user` WHERE username = " + general.mysql.escape(user), function(error, result) {
    if(error) {
      res.send("There was an error loading the page! :: " + error.message);
    }
    else {
      var donated = result[0].donated;
      general.pool.query("SELECT * FROM `transaction` WHERE `uid` = " + general.mysql.escape(result[0].id), function(error, result) {
        if(error) {
          res.send("There was an error loading the page! :: " + error.message);
        }
        else {
          var transactions = result;
          general.pool.query("SELECT * FROM `charity`", function(error, result) {
            if(error) {
              res.send("There was an error loading the page! :: " + error.message);
            }
            else {
              res.render('profile',{title: 'WebAPI Final Profile', username: user, donated: donated, transactions: transactions, charities: result});
            }
          });
        }
      });
    }
  });
}

//This is a auth endpoint to present the home page, which also verifies auth before presenting the page.
//If auth fails the user is redirected to the login page.
router.get('/admin', function(req, res, next) {
  if(req.signedCookies.session != null && req.signedCookies.session != false){
    general.TokenCheck(req.signedCookies.session, res, true, AdminRender, '/admin', LoginRender, [1]);
  }
  else {
    console.log("Inline redirect due to no token reported by client");
    res.redirect(307, "/?redirect=true&from=/admin");//no token exists
  }
});

//This is the function called if auth is successful
function AdminRender(res, user){
  general.pool.query("SELECT * FROM `user`", function (err, result, fields) {
    if(err){
      res.send("Error Contact Developer! -- ErrMSG: " + err.message);
    }
    else{
      var userlist = result;
      res.render('admin',{title: 'WebAPI Final Admin Page', users: userlist});
    }
  });
}

module.exports = router;

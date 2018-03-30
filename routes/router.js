var express = require('express');
var router = express.Router();
var general = require('../security');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.query.redirect) {//check if the user was redirected by the system so we dont duplicate the token check
    LoginRender(res, true, req.query.from);
  }
  else {
    if(req.signedCookies.session != null && req.signedCookies.session != false){//IF there is already a valid cookie we want to just throw them at the dashboard.
      general.TokenCheck(req.signedCookies.session, res, false, DashboardRender, '/dashboard', LoginRender, [1,2,3]);
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
    res.render("login", {returnLocation: '/dashboard'});
  }
}

router.get('/logout', function(req, res, next) {
  res.clearCookie("session");
  res.redirect(307, "/");
});

router.use('*', function(req, res) {
  res.send('Invalid Request or Type');
});

router.get('/admin', function(req, res, next) {
  if(req.signedCookies.session != null && req.signedCookies.session != false){
    general.TokenCheck(req.signedCookies.session, res, true, AdminRender, '/admin', LoginRender, [1]);
  }
  else {
    console.log("Inline redirect due to no token reported by client");
    res.redirect(307, "/?redirect=true&from=/admin");//no token exists
  }
});

function AdminRender(res, user){
  general.Log(user, user + " accessed the Admin Page", "Navigation");
  general.pool.query("SELECT * FROM `users`", function (err, result, fields) {
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

var exports = module.exports = {};

exports.mysql = require('mysql');

exports.pool = require('mysql').createPool({
  connectionLimit: 10,
  host: "mayd.co",
  user: "catalyse_webapi",
  password: "LeavenHomersBlightAbuts56",
  database: "catalyse_webapi"
});

exports.AddMins = function(time, add) {    
   time.setTime(time.getTime() + (add*60*1000)); 
   return time;
};

exports.DateToSql = function(date) {
  date = date.getFullYear() + '-' +
    ('00' + (date.getMonth()+1)).slice(-2) + '-' +
    ('00' + date.getDate()).slice(-2) + ' ' + 
    ('00' + date.getHours()).slice(-2) + ':' + 
    ('00' + date.getMinutes()).slice(-2) + ':' + 
    ('00' + date.getSeconds()).slice(-2);
  return date;
};

//token is the users token
//res is the request information from the client
//reqredirect is if the client needs to be redirected if the check fails.
//render is the function to run if the check succeeds
//redirectname is the name of where to send the user once they log back in
exports.TokenCheck = function(combotoken, res, reqredirect, render, redirectname, LoginRender) {
  var tokensplit = combotoken.split("@");
  var user = tokensplit[0];
  var token = tokensplit[1];
  exports.pool.query("SELECT * FROM `tokentracker` WHERE token='" + token + "'", function (err, result, fields) {
    if(err) return -1;
    if(result.length == 0) {
      if(reqredirect) {
        res.redirect('/management/?redirect=true&from=' + redirectname);
      } 
      else {
        LoginRender(res, false);
      }
    }
    else {
      if(result[0].token == token) {//Users token is valid, check if the exp date is still valid.
        var currentTime = new Date();
        var currentTimeSQL = exports.DateToSql(currentTime);
        if(result[0].expiration > currentTimeSQL) {//Token is good renew session period.
          currentTime = exports.AddMins(currentTime, 15);
          currentTimeSQL = exports.DateToSql(currentTime);
          exports.pool.query("UPDATE `tokentracker` SET `expiration`= '" + currentTimeSQL + "' WHERE `token` = '" + token + "'");
          res.cookie('session', combotoken, { 
            maxAge: 1000 * 60 * 60 * 24, //1 day
            httpOnly: true, 
            signed: true 
          }); 
          render(res, user);
        }
        else {
          //Token expired
          if(reqredirect) {
            res.redirect('/management/?redirect=true&from=' + redirectname);
          } 
          else {
            LoginRender(res, false);
          }
        }
      }
      else {
        //Token does not match records.
        exports.Log(user, "Security: Someone attempted to login as: " + user + " with a modified token.");
        if(reqredirect) {
          res.redirect('/management/?redirect=true&from=' + redirectname);
        } 
        else {
          LoginRender(res, false);
        }
      }
    }
  });
};

exports.PostTokenCheck = function(req, res, requestname, requesttype, callback) {
  if(req.signedCookies.session != null && req.signedCookies.session != false){
    var tokensplit = req.signedCookies.session.split("@");
    var user = tokensplit[0];
    var token = tokensplit[1];
    exports.pool.query("SELECT * FROM `tokentracker` WHERE token='" + token + "'", function (err, result, fields) {
      if(err) return false;
      if(result.length == 0) {//no token found
        callback(false);
      }
      else {
        //console.log("TokenCheck Comparison: \n" + result[0].token + "\n" + token);
        if(result[0].token == token) {//Users token is valid, check if the exp date is still valid.
          //console.log("User token valid, checking expiration");
          var currentTime = new Date();
          var currentTimeSQL = exports.DateToSql(currentTime);
          //console.log("Expiration Comparison: \n" + currentTimeSQL + "\n" + result[0].expiration);
          if(result[0].expiration > currentTimeSQL) {//Token is good renew session period.
            //console.log("Token is not expired, extending session");
            currentTime = exports.AddMins(currentTime, 15);
            currentTimeSQL = exports.DateToSql(currentTime);
            exports.pool.query("UPDATE `tokentracker` SET `expiration`= '" + currentTimeSQL + "' WHERE `token` = '" + token + "'");
            res.cookie('session', req.signedCookies.session, { 
              maxAge: 1000 * 60 * 60 * 24, //1 day
              httpOnly: true, 
              signed: true 
            });
            exports.Log(user, user + " made a request to " + requestname, requesttype);
            callback(true);
          }
          else {
            //Token expired
            callback(false);
          }
        }
        else {
          //Token does not match records.
          exports.Log(user, "Security: Someone attempted to make a post request as: " + user + " with a modified token.");
          callback(false);
        }
      }
    });
  }
  else {
    return false;
  }
};
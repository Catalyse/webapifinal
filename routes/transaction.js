var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add/:donating/:donationamount', function(req, res) {
  general.PostTokenCheck(req, res, "cart/add", "ADD", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `user` WHERE username = " + req.signedCookies.session.split("@")[0], function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          var uid = result[0].id;
          general.pool.query("SELECT * FROM `cart` WHERE uid = " + uid, function(error, result) {
            if(error) {
              res.send("There was an error making the query! :: " + error.message);
            }
            else {
              if(req.params.donating == 'true') {

              }
              else {

              }
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

router.delete('/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/delete", "DELETE/ID=" + req.params.id, function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `transaction` WHERE id = " + general.mysql.escape(req.params.id), function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            general.pool.query("DELETE FROM `transaction` WHERE id = " + general.mysql.escape(req.params.id), function(error, result) {
              if(error) {
                res.send("There was an error making the query! :: " + error.message);
              }
              else {
                res.send('1');
              }
            });
          }
          else {
            res.send('$$NORESULT$$');
          }
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.get('/:id', function(req, res) {
  general.PostTokenCheck(req, res, "product/get", "GET", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `transaction` WHERE id = " + general.mysql.escape(req.params.id), function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            res.send(result[0]);
          }
          else {
            res.send('$$NORESULT$$');
          }
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

//This is a post because it conflicts with the above get function
router.post('/all', function(req, res) {
  general.PostTokenCheck(req, res, "product/all", "GET", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `transaction`;", function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            res.send(result);
          }
          else {
            res.send('$$NORESULT$$');
          }
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});
module.exports = router;
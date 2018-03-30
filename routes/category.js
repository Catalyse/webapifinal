var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add', function(req, res) {
  general.PostTokenCheck(req, res, "category/add", "ADD", function(result) {
    if(result == true) {
      general.pool.query("INSERT INTO `category` (`name`, `description`) VALUES (" + general.mysql.escape(req.body.name) + 
      "," + general.mysql.escape(req.body.description) + ");", function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          res.send('1');
        }
      })
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.post('/edit/:id', function(req, res) {
  general.PostTokenCheck(req, res, "category/edit", "EDIT/ID=" + req.params.id, function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `category` WHERE id = " + req.params.id, function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            general.pool.query("UPDATE `category` SET `name` = " + general.mysql.escape(req.body.name) + 
            ", `description` = " + general.mysql.escape(req.body.description) + " WHERE id = " + general.mysql.escape(req.params.id), function(error, result) {
              if(error) {
                res.send("There was an error making the query! :: " + error.message);
              }
              else {
                res.send('1');
              }
            })
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

router.delete('/:id', function(req, res) {
  general.PostTokenCheck(req, res, "category/delete", "DELETE/ID=" + req.params.id, function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `category` WHERE id = " + req.params.id, function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            general.pool.query("DELETE FROM `category` WHERE `id` = " + general.mysql.escape(req.params.id), function(error, result) {
              if(error) {
                res.send("There was an error making the query! :: " + error.message);
              }
              else {
                res.send('1');
              }
            })
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
  general.PostTokenCheck(req, res, "category/get", "GET", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `category` WHERE id = " + req.params.id, function(error,result) {
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

router.get('/all', function(req, res) {
  general.PostTokenCheck(req, res, "category/all", "GET", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `category` WHERE id = " + req.params.id, function(error,result) {
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
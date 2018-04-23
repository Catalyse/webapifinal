var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add', function(req, res) {
  general.PostTokenCheck(req, res, "product/add", "ADD", function(result) {
    if(result == true) {
      general.pool.query("INSERT INTO `product` (`name`, `cost`, `description`, `quantity`, `category`) VALUES (" + general.mysql.escape(req.body.name) + 
      "," + general.mysql.escape(req.body.cost) + ", " + general.mysql.escape(req.body.description)  + ", " + general.mysql.escape(req.body.quantity) + ", " 
      + general.mysql.escape(req.body.category) + ");", function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          res.send('1');
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.post('/edit/:id', function(req, res) {
  general.PostTokenCheck(req, res, "product/edit", "EDIT/ID=" + req.params.id, function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `product` WHERE id = " + req.params.id, function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            general.pool.query("UPDATE `product` SET `name` = " + general.mysql.escape(req.body.name) 
            + ", `cost` = " + general.mysql.escape(req.body.cost) + ", `description` = " + general.mysql.escape(req.body.description) 
            + ", `quantity` = " + general.mysql.escape(req.body.quantity) + ", `category` = " + general.mysql.escape(req.body.category) 
            + " WHERE id = " + general.mysql.escape(req.params.id), function(error, result) {
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
  general.PostTokenCheck(req, res, "product/delete", "DELETE/ID=" + req.params.id, function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `product` WHERE id = " + req.params.id, function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            general.pool.query("DELETE FROM `product` WHERE `id` = " + general.mysql.escape(req.params.id), function(error, result) {
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
  general.PostTokenCheck(req, res, "product/get", "GET", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `product` WHERE id = " + req.params.id, function(error,result) {
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
      general.pool.query("SELECT * FROM `product`;", function(error,result) {
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
var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/add", "ADD", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `cart` WHERE uid = " + general.mysql.escape(req.params.id), function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            res.send("Your old cart must be deleted before creating a new one!");
          }
          else {
            general.pool.query("INSERT INTO `cart` (`name`, `cost`, `description`, `quantity`, `category`) VALUES (" + general.mysql.escape(req.body.name) + 
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
        }
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

//Contents structure:
//ItemID%Quantity$$ItemID%Quantity$$...
router.post('/item/add/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/item/add", "ADD", function(result) {
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
              if(result.length > 0) {
                var cart = result[0];
                general.pool.query("SELECT * FROM `product` WHERE id = " + general.mysql.escape(req.params.id), function(error,result) {
                  if(error) {
                    res.send("There was an error making the query! :: " + error.message);
                  }
                  else {
                    if(result[0].quantity > 0) {
                      if(cart.contents == '') {
                        var contents = req.body.item + "%" + req.body.quantity;
                      }
                      else {
                        var contents = contents + "$$" + req.body.item + "%" + req.body.quantity;
                      }
                      general.pool.query("UPDATE `cart` SET `contents` = " + general.mysql.escape(contents) + " WHERE uid = " + uid, function(error, result) {
                        if(error) {
                          res.send("There was an error making the query! :: " + error.message);
                        }
                        else {
                          res.send('1');
                        }
                      });
                    }
                    else {
                      res.send("This item is out of stock!");
                    }
                  }
                });
              }
              else {
                res.send("A cart does not exist for this user!");
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

//Contents structure:
//ItemID%Quantity$$ItemID%Quantity$$...
router.post('/item/remove/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/item/add", "ADD", function(result) {
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
              if(result.length > 0) {
                if(result[0].contents == '') {
                  res.send('There is no product with that ID in the cart.');
                }
                else {
                  var newContents = '';
                  var contents = result[0].split('$$');
                  for(i = 0; i < content.length; i++) {
                    if(contents[i].split("%")[0] != req.params.id) {
                      if(newContents == '') {
                        newContents = contents[i];
                      }
                      else {
                        newContents = newContents + "$$" + contents[i];
                      }
                    }
                  }
                  general.pool.query("UPDATE `cart` SET `contents` = " + general.mysql.escape(contents) + " WHERE uid = " + uid, function(error, result) {
                    if(error) {
                      res.send("There was an error making the query! :: " + error.message);
                    }
                    else {
                      res.send('1');
                    }
                  });
                }
              }
              else {
                res.send("A cart does not exist for this user!");
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
      general.pool.query("SELECT * FROM `cart` WHERE uid = " + general.mysql.escape(req.params.id), function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            general.pool.query("DELETE FROM `cart` WHERE uid = " + general.mysql.escape(req.params.id), function(error, result) {
              if(error) {
                res.send("There was an error making the query! :: " + error.message);
              }
              else {
                res.send('1');
              }
            });
          }
          else {
            res.send("A cart does not exist for this user!");
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
      
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.get('/all', function(req, res) {
  general.PostTokenCheck(req, res, "product/all", "GET", function(result) {
    if(result == true) {
      
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});
module.exports = router;
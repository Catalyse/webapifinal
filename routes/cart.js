/*
File: cart.js
Purpose: sets up functionality for a cart
*/

var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
//This endpoint allows the addition of a new cart for a specific user.
//Before allowing the user to use the endpoint, their session token is verified.
router.post('/add/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/add", "ADD", function(result) {//Validate user session token
    if(result == true) {//If token valid
      general.pool.query("SELECT * FROM `cart` WHERE complete = 0 AND uid = " + general.mysql.escape(req.params.id), function(error, result) {
        if(error) {//Handle sql errors
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {//If there is a result, that means there is already a cart in the db, and they cannot have more than one
            res.send("Your old cart must be deleted before creating a new one!");
          }
          else { //Correct inserting into cart 
            general.pool.query("INSERT INTO `cart` (`uid`) VALUES (" + general.mysql.escape(req.params.id) + ");", function(error, result) {
              if(error) {//Handle sql errors
                res.send("There was an error making the query! :: " + error.message);
              }
              else {//Send a 1 as a confirmation of success
                res.send('1');
              }
            });
          }
        }
      });
    }
    else {//If token invalid send redirect notice
      res.send("$$REDIRECT$$");
    }
  });
});

//This function can be called internally to add a cart if there isnt one
//Refer to cart adding endpoint for more detail
function AddCart(id, finish) {
  general.pool.query("INSERT INTO `cart` (`uid`) VALUES (" + general.mysql.escape(id) + ");", function(error, result) {
    if(error) {
      finish("There was an error making the query! :: " + error.message);
    }
    else {
      finish('1');
    }
  });
}

//This endpoint allows users to add an item to their cart, along with a quantity
router.post('/item/add/:id/:quantity', function(req, res) {
  general.PostTokenCheck(req, res, "cart/item/add", "ADD", function(result) {//Validate user session token
    if(result == true) {
      //Get the current user
      general.pool.query("SELECT * FROM `user` WHERE username = '" + req.signedCookies.session.split("@")[0] + "';", function(error,result) {
        if(error) {//Handle SQL errors
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          var uid = result[0].id;//Save user id
          general.pool.query("SELECT * FROM `cart` WHERE complete = 0 AND uid = " + uid, function(error, result) {
            if(error) {//Handle SQL errors
              res.send("There was an error making the query! :: " + error.message);
            }
            else {
              if(result.length > 0) {//If the user already has a cart continue
                var cart = result[0];
                general.pool.query("SELECT * FROM `product` WHERE id = " + general.mysql.escape(req.params.id), function(error,result) {
                  if(error) {//Handle SQL errors
                    res.send("There was an error making the query! :: " + error.message);
                  }
                  else {
                    if(result[0].quantity > 0) {
                      //Check if the cart is initialized, if not we need to start the string
                      //Contents structure:
                      //ItemID%Quantity$$ItemID%Quantity$$...
                      if(cart.contents == '' || cart.contents == 'null' || cart.contents == 'NULL' || cart.contents == undefined) {
                        var contents = req.params.id + "%" + req.params.quantity;
                      }
                      else {//Otherwise add onto the cart string
                        var contents = cart.contents + "$$" + req.params.id + "%" + req.params.quantity;
                      }
                      general.pool.query("UPDATE `cart` SET `contents` = " + general.mysql.escape(contents) + " WHERE complete = 0 AND uid = " + uid, function(error, result) {
                        if(error) {//Handle SQL errors
                          res.send("There was an error making the query! :: " + error.message);
                        }
                        else {//Confirm action completion
                          res.send('1');
                        }
                      });
                    }
                    else {//No stock of product.
                      res.send("Error: This item is out of stock!");
                    }
                  }
                });
              }
              else {//If they dont have a cart, add one
                AddCart(uid, function(result) {
                  if(result == '1') {
                    general.pool.query("SELECT * FROM `cart` WHERE complete = 0 AND uid = " + uid, function(error, result) {
                      if(error) {//Handle SQL errors
                        res.send("There was an error making the query! :: " + error.message);
                      }
                      else {
                        //See the above IF branch for comments on the rest of this.
                        var cart = result[0];
                        general.pool.query("SELECT * FROM `product` WHERE id = " + general.mysql.escape(req.params.id), function(error,result) {
                          if(error) {//Handle SQL errors
                            res.send("There was an error making the query! :: " + error.message);
                          }
                          else {
                            if(result[0].quantity > 0) {
                              if(cart.contents == '' || cart.contents == 'null' || cart.contents == 'NULL' || cart.contents == undefined) {
                                var contents = req.params.id + "%" + req.params.quantity;
                              }
                              else {
                                var contents = contents + "$$" + req.params.id + "%" + req.params.quantity;
                              }
                              general.pool.query("UPDATE `cart` SET `contents` = " + general.mysql.escape(contents) + " WHERE complete = 0 AND uid = " + uid, function(error, result) {
                                if(error) {//Handle SQL errors
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
                    });
                  }//This implies there was an error adding the cart
                  else {
                    res.send(result);
                  }
                });
              }
            }
          });
        }
      });
    }
    else {//Unauthorized
      res.send("$$REDIRECT$$");
    }
  });
});

//Contents structure:
//ItemID%Quantity$$ItemID%Quantity$$...
router.delete('/item/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/item/add", "ADD", function(result) {//Validate user auth
    if(result == true) {
      //Find user id
      general.pool.query("SELECT * FROM `user` WHERE username = '" + req.signedCookies.session.split("@")[0] + "';", function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          var uid = result[0].id;//Save ID
          //Get user cart
          general.pool.query("SELECT * FROM `cart` WHERE uid = " + uid, function(error, result) {
            if(error) {//Handle SQL Errors
              res.send("There was an error making the query! :: " + error.message);
            }
            else {
              if(result.length > 0) {//If there is a cart
                if(result[0].contents == '') {
                  res.send('There is no product with that ID in the cart.');
                }
                else {//Split up the items in the cart, remove the item requested
                  var newContents = '';
                  var contents = result[0].contents.split('$$');
                  for(i = 0; i < contents.length; i++) {
                    if(contents[i].split("%")[0] != req.params.id) {
                      if(newContents == '') {
                        newContents = contents[i];
                      }
                      else {
                        newContents = newContents + "$$" + contents[i];
                      }
                    }
                  }
                  //Update the cart string
                  general.pool.query("UPDATE `cart` SET `contents` = " + general.mysql.escape(newContents) + " WHERE uid = " + uid, function(error, result) {
                    if(error) {
                      res.send("There was an error making the query! :: " + error.message);
                    }
                    else {//Confirm action completion
                      res.send('1');
                    }
                  });
                }
              }
              else {//Send back to the user that there is no cart to delete items from
                res.send('$$NORESULT$$');
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

router.delete('/', function(req, res) {
  general.PostTokenCheck(req, res, "cart/delete", "DELETE/ID=", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `user` WHERE username = '" + req.signedCookies.session.split("@")[0] + "';", function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          var uid = result[0].id;
          general.pool.query("SELECT * FROM `cart` WHERE uid = " + general.mysql.escape(uid), function(error, result) {
            if(error) {
              res.send("There was an error making the query! :: " + error.message);
            }
            else {
              if(result.length > 0) {
                general.pool.query("DELETE FROM `cart` WHERE uid = " + general.mysql.escape(uid), function(error, result) {
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
      });
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.get('/', function(req, res) {
  general.PostTokenCheck(req, res, "product/get", "GET", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `user` WHERE username = '" + req.signedCookies.session.split("@")[0] + "';", function(error,result) {
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
                res.send(result[0]);
              }
              else {
                res.send('$$NORESULT$$');
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

module.exports = router;

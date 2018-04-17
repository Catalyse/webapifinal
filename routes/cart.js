var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/add", "ADD", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `cart` WHERE complete = 0 AND uid = " + general.mysql.escape(req.params.id), function(error, result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          if(result.length > 0) {
            res.send("Your old cart must be deleted before creating a new one!");
          }
          else {
            general.pool.query("INSERT INTO `cart` (`uid`) VALUES (" + general.mysql.escape(req.params.id) + ");", function(error, result) {
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

//Contents structure:
//ItemID%Quantity$$ItemID%Quantity$$...
router.post('/item/add/:id/:quantity', function(req, res) {
  general.PostTokenCheck(req, res, "cart/item/add", "ADD", function(result) {
    if(result == true) {
      general.pool.query("SELECT * FROM `user` WHERE username = '" + req.signedCookies.session.split("@")[0] + "';", function(error,result) {
        if(error) {
          res.send("There was an error making the query! :: " + error.message);
        }
        else {
          var uid = result[0].id;
          general.pool.query("SELECT * FROM `cart` WHERE complete = 0 AND uid = " + uid, function(error, result) {
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
                      if(cart.contents == '' || cart.contents == 'null' || cart.contents == 'NULL' || cart.contents == undefined) {
                        var contents = req.params.id + "%" + req.params.quantity;
                      }
                      else {
                        var contents = cart.contents + "$$" + req.params.id + "%" + req.params.quantity;
                      }
                      general.pool.query("UPDATE `cart` SET `contents` = " + general.mysql.escape(contents) + " WHERE complete = 0 AND uid = " + uid, function(error, result) {
                        if(error) {
                          res.send("There was an error making the query! :: " + error.message);
                        }
                        else {
                          res.send('1');
                        }
                      });
                    }
                    else {
                      res.send("Error: This item is out of stock!");
                    }
                  }
                });
              }
              else {
                AddCart(uid, function(result) {
                  if(result == '1') {
                    general.pool.query("SELECT * FROM `cart` WHERE complete = 0 AND uid = " + uid, function(error, result) {
                      if(error) {
                        res.send("There was an error making the query! :: " + error.message);
                      }
                      else {
                        var cart = result[0];
                        general.pool.query("SELECT * FROM `product` WHERE id = " + general.mysql.escape(req.params.id), function(error,result) {
                          if(error) {
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
                    });
                  }
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
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

//Contents structure:
//ItemID%Quantity$$ItemID%Quantity$$...
router.delete('/item/:id', function(req, res) {
  general.PostTokenCheck(req, res, "cart/item/add", "ADD", function(result) {
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
                if(result[0].contents == '') {
                  res.send('There is no product with that ID in the cart.');
                }
                else {
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
                  general.pool.query("UPDATE `cart` SET `contents` = " + general.mysql.escape(newContents) + " WHERE uid = " + uid, function(error, result) {
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
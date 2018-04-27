var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add/:donating/:charity', function(req, res) {
  general.PostTokenCheck(req, res, "cart/add", "ADD", function(result) {
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
              var cartid = result[0].id;
              var cart = result[0];
              general.pool.query("SELECT * FROM `product`", function(error, result) {
                if(error) {
                  res.send("There was an error making the query! :: " + error.message);
                }
                else {
                  var allInStock = true;
                  var outOfStockArr = '$$NOSTOCK$$'
                  var products = result;
                  var contents = cart.contents.split('$$');
                  var totalCost = 0;
                  for(i = 0; i < contents.length; i++) {
                    for(j = 0; j < products.length; j++) {
                      if(contents[i].split("%")[0] == products[j].id) {
                        if(products[j].quantity < contents[i].split("%")[1]) {
                          allInStock = false;
                          outOfStockArr += "&" + products[j].id;
                        }
                        totalCost += parseFloat(products[j].cost) * contents[i].split("%")[1];
                        break;
                      }
                    }
                  }
                  if(allInStock) {
                    if(req.params.donating == 'true') {
                      var roundup = totalCost % 1;
                      roundup = 1 - roundup;
                      general.pool.query("UPDATE `charity` SET donated = donated + " + roundup + " WHERE id = " + general.mysql.escape(req.params.charity), function(error, result) {
                        if(error) {
                          res.send("There was an error making the query! :: " + error.message);
                        }
                        else {
                          general.pool.query("UPDATE `user` SET donated = donated + " + roundup + " WHERE id = " + uid, function(error,result) {
                            if(error) {
                              res.send("There was an error making the query! :: " + error.message);
                            }
                            else {
                              general.pool.query("INSERT INTO `transaction` (`uid`, `cid`, `items`, `totalcost`, `datetime`, `donated`, `charity`, `donatedamount`)" + 
                              " VALUES (" + uid + "," + cartid + ",'" + cart.contents + "','" + totalCost + "','" + general.DateToSql(new Date) + 
                              "',true," + general.mysql.escape(req.params.charity) + ",'" + roundup + "')", function(error,result) {
                                if(error) {
                                  res.send("There was an error making the query! :: " + error.message);
                                }
                                else {
                                  general.pool.query("UPDATE `cart` SET `uid` = -1 WHERE id = " + cartid, function(error,result) {
                                    if(error) {
                                      res.send("There was an error making the query! :: " + error.message);
                                    }
                                    else {
                                      var contents = cart.contents.split('$$');
                                      for(i = 0; i < contents.length; i++) {
                                        for(j = 0; j < products.length; j++) {
                                          if(contents[i].split("%")[0] == products[j].id) {
                                            general.pool.query("UPDATE `product` SET quantity = (quantity - " + contents[i].split("%")[1] + ") WHERE id = " + products[j].id)
                                            break;
                                          }
                                        }
                                      }
                                      res.send("1");
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                    else {
                      general.pool.query("INSERT INTO `transaction`(`uid`, `cid`, `items`, `totalcost`, `datetime`, `donated`, `charity`, `donatedamount`)" + 
                      " VALUES (" + uid + "," + cartid + ",'" + cart.contents + "','" + totalCost + "','" + general.DateToSql(new Date) + 
                      "',false,'-1','0')", function(error,result) {
                        if(error) {
                          res.send("There was an error making the query! :: " + error.message);
                        }
                        else {
                          general.pool.query("UPDATE `cart` SET `uid` = -1 WHERE id = " + cartid, function(error,result) {
                            if(error) {
                              res.send("There was an error making the query! :: " + error.message);
                            }
                            else {
                              var contents = cart.contents.split('$$');
                              for(i = 0; i < contents.length; i++) {
                                for(j = 0; j < products.length; j++) {
                                  if(contents[i].split("%")[0] == products[j].id) {
                                    general.pool.query("UPDATE `product` SET quantity = (quantity - " + contents[i].split("%")[1] + ") WHERE id = " + products[j].id)
                                    break;
                                  }
                                }
                              }
                              res.send("1");
                            }
                          });
                        }
                      });
                    }
                  }
                  else {
                    res.send(outOfStockArr);
                  }
                }
              });
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
  general.PostTokenCheck(req, res, "transaction/delete", "DELETE/ID=" + req.params.id, function(result) {
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
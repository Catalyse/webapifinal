var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var passcrypt = require('password-hash-and-salt');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://catalyse:password123@ds215019.mlab.com:15019/hw3");

var userSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String
});

var movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: {unique: true}
  },
  releaseyear: {
    type: Number,
    required: true,
    index: {unique: false}
  },
  genre: {
    type: String,
    required: true,
    enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western']
  },
  actors: {
    type: [{actorname: {
      type: String,
      required: true
    }, 
    charactername: {
      type: String,
      required: true
    }}],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 3;
      },
      message: 'You must have at least 3 actors!'
    }
  }
});

var user = mongoose.model('user', userSchema);
var movie = mongoose.model('movie', movieSchema);

router.post('/login', function(req,res) {
  user.find({'username': req.body.username}, function(err, user) {
    if(err) res.send(err);
    else {
      if(user.length > 0) {
        ValidatePass(req.body.password, user[0].password, function(result) {
          if(result) {
            var userToken = {name: user[0].name, username: user[0].username};
            var token = jwt.sign(userToken, process.env.SECRET_KEY);
            res.json({success: true, token: 'JWT ' + token});
          }
          else {
            res.send("Invalid Password");
          }
        });
      }
      else {
        res.send("User not found");
      }
    }
  });
});

router.post('/register', function(req,res) {
  user.find({'username': req.body.username}, function(err, users) {
    if(err) res.send(err);
    else {
      if(users.length > 0) {
        res.send("A user with the username already exists!");
      }
      else {
        passcrypt(req.body.password).hash(function(error, hash) {
          if(error) {
            res.send("There was an error hashing the password!");
          }//TODO: Split salt off hash and store in separate table.
          else {
            var newUser = new user({
              username: req.body.username,
              name: req.body.name,
              password: hash
            });
            newUser.save(function(err, data) {
              if(err) {
                res.send("There was an error registering the user!");
              }
              else {
                res.send("Registration Successful!");
              }
            });
          }
        });
      }
    }
  });
});

//All movies are indexed by title since the title is unique.

router.get('/movies/all', function(req, res) {//get all movies
  CheckToken(req.headers.jwt, function(result) {
    if(result) {
      movie.find(function(err, movies) {
        if(err) res.send("Error finding movies");
        else {
          if(movies.length > 0)
            res.send(movies);
          else 
            res.send("No movies found");
        }
      });
    }
    else {
      res.status(401).send("Unauthorized to make this request");
    }
  });
});

router.get('/movies/:id', function(req,res) {//get a movie
  CheckToken(req.headers.jwt, function(result) {
    if(result) {
      movie.findById(req.params.id, function(err, movie) {
        if(err) res.send("Error finding movie - Likely an invalid ID - ERR: " + err);
        else {
          if(movie)
            res.send(movie);
          else 
            res.send("No movie found");
        }
      });      
    }
    else {
      res.status(401).send("Unauthorized to make this request");
    }
  });
});

router.post('/movies', function(req,res) {//Add movies
  CheckToken(req.headers.jwt, function(result) {
    if(result) {      
      var newMovie = new movie({
        title: req.body.title,
        releaseyear: req.body.releaseyear,
        genre: req.body.genre,
        actors: req.body.actors
      });
      newMovie.save(function(err, data){
        if(err) {
          if(err.code == '11000'){
            res.send("A movie with this title already exists!");
          }
          else {
            res.send(err);
          }
        }
        else res.send("Save Success");
      });
    }
    else {
      res.status(401).send("Unauthorized to make this request");
    }
  });
});

router.put('/movies/:id', function(req,res) {//Delete Movies
  CheckToken(req.headers.jwt, function(result) {
    if(result) {
      movie.findById(req.params.id, function(err, movie) {
        if(err) res.send("Error finding movie - Likely an invalid ID - ERR: " + err);
        else {
          if(movie) {
            if(req.body.title) {
              movie.title = req.body.title;
            }
            if(req.body.releaseyear) {
              movie.releaseyear = req.body.releaseyear;
            }
            if(req.body.genre) {
              movie.genre = req.body.genre;
            }
            if(req.body.actors) {
              movie.actors = req.body.actors;
            }
            movie.save(function(error) {
              if(err) {
                res.send(error);
              }
              else {
                res.send("Update Success!");
              }
            });
          }
          else 
            res.send("No movie found");
        }
      });      
    }
    else {
      res.status(401).send("Unauthorized to make this request");
    }
  });
});

router.delete('/movies/:id', function(req,res) {
  CheckToken(req.headers.jwt, function(result) {
    if(result) {
      movie.findByIdAndRemove(req.params.id, function(err) {
        if(err) res.send("Error finding movie - Likely an invalid ID - ERR: " + err);
        else {
          res.send("Movie Deleted!");
        }
      });      
    }
    else {
      res.status(401).send("Unauthorized to make this request");
    }
  });
});

router.use('*', function(req, res) {
  res.send('Invalid Request or Type');
});

//This function will take the password and validate it against the existing hash
function ValidatePass(pass, hash, finish) {
  passcrypt(pass).verifyAgainst(hash, function(error, verified) {
    if(error) {
      finish(false);
    }
    if(!verified) {
      finish(false);
    }
    else {
      finish(true);
    }
  })
};

function CheckToken(token, finish) {
  if(token != undefined && token != null) {
    var token = jwt.verify(token, process.env.SECRET_KEY);
    user.find({'username': token.username}, function(err, user) {
      if(err) res.send(err);
      else {
        if(user.length > 0) {
          finish(true);
        }
        else {
          finish(false);
        }
      }
    });
  }
  else {
    finish(false);
  }
}

module.exports = router;

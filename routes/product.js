var express = require('express');
var router = express.Router();
var general = require('../security');

//User Post Requests ------------------------------------------------------------------------------------------------------
router.post('/add', function(req, res) {
  general.PostTokenCheck(req, res, "product/add", "ADD", function(result) {
    if(result == true) {
      
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.post('/edit/:id', function(req, res) {
  general.PostTokenCheck(req, res, "product/edit", "EDIT/ID=" + req.params.id, function(result) {
    if(result == true) {
      
    }
    else {
      res.send("$$REDIRECT$$");
    }
  });
});

router.delete('/:id', function(req, res) {
  general.PostTokenCheck(req, res, "product/delete", "DELETE/ID=" + req.params.id, function(result) {
    if(result == true) {
      
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
var express = require('express');
var router = express.Router();
const customers = require('../database/customer')
const admins = require("../database/admin")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


var express = require('express');
const { dbSync } = require("../controllers/helperController")

var router = express.Router();

router.get("/db-sync", dbSync)



module.exports = router
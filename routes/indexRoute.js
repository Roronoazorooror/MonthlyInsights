const express= require("express")
const router = express.Router()
const indexController = require("../controllers/indexController");
const allMailsController = require("../controllers/allMailsController");
const cronjobController = require("../controllers/cronJobController");


router
.get('/',indexController)
.post('/allmails',allMailsController)
.get('/cronjob',cronjobController)
 
module.exports=router  
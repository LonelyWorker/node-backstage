var express = require('express');


//引入模块
var login = require('./admin/login.js');
var user = require('./admin/user.js');
var product = require('./admin/product.js');


var router = express.Router();  //可使用 express.Router 类创建模块化、可挂载的路由句柄


router.use('/login', login);
router.use('/user', user);
router.use('/product', product);


module.exports = router;
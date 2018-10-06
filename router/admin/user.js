var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
    res.send('user主页');
});

router.get('/add', function(){
    res.send('增加用户页面');
});

module.exports = router;
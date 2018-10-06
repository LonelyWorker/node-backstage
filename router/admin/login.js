var express = require('express');

var router = express.Router();

var DB = require('../../module/db.js');

var md5 = require('md5-node');

//获取post
var bodyParser = require('body-parser');
//设置body-parser中间件
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.get('/', function(req, res){
    // res.send('login主页');
    res.render('admin/login');
});

router.post('/doLogin', function(req, res){
      //res.send('login');
    //console.log(req.body);    /*获取post提交的数据*/

    //req.body ={ username: 'admin', password: '123456' }


    var username=req.body.username;
    var password=md5(req.body.password);  /*要对用户输入的密码加密*/

    //1.获取数据
    //2.连接数据库查询数据
    DB.find('user', {
        username: username,
        password: password
    }, function(err, data){
        if(data.length>0){
            console.log('登录成功');
            //保存用户信息
            req.session.userinfo=data[0];
    
            res.redirect('/admin/product');  /*登录成功跳转到商品列表*/
    
        }else{
            //console.log('登录失败');
            res.send("<script>alert('登录失败');location.href='/admin/login'</script>");
        }
    });
    
});

module.exports = router;
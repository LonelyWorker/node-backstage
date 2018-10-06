var express = require('express');
var app = new express();

//获取post
var bodyParser = require('body-parser');
//设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var md5 = require('md5-node');

// var DB = require('./module/db.js');

//数据库操作
var MongoClient = require('mongodb').MongoClient;

var DbUrl = 'mongodb://localhost:27017/product'; //连接数据库

//保存用户信息
var session = require('express-session');
//配置中间件, 固定格式
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:1000*60*30
    },
    rolling: true
}));


//配置ejs引擎
app.set('view engine', 'ejs');

//配置静态托管
app.use(express.static('public'));



//自定义中间件 判断登录状态
app.use(function(req, res, next){
    if(req.url == '/login' || req.url == '/doLogin'){
        next();
    }else{
        if(req.session.userinfo&&req.session.userinfo.username != ''){  //判断有没有登录
            app.locals['userinfo'] = req.session.userinfo; /*配置全局变量 可以在任何模板里面使用 */
            next();
        }else{
            res.redirect('/login');
        }
    }
});

app.get('/', function(req, res){
    MongoClient.connect(DbUrl,function(err, dbs){
        var db = dbs.db('product');
        if(err){
            console.log(err);
            console.log('数据库连接失败');
            return;
        }
        //查询数据
        var result = db.collection('product').find();
        
        result.toArray(function(error, data){
            if(err){
                console.log(err);
                return;
            }
            dbs.close();
            // console.log(data);
            res.render('index',{
                list: data
            });
        });
    });
    // res.render('index');
});

app.post('/doLogin',function(req,res){
    //res.send('login');
    //console.log(req.body);    /*获取post提交的数据*/

    //req.body ={ username: 'admin', password: '123456' }


    var username=req.body.username;
    var password=md5(req.body.password);  /*要对用户输入的密码加密*/

    //1.获取数据
    //2.连接数据库查询数据

    MongoClient.connect(DbUrl,function(err,dbs){

        var db = dbs.db('product');
        if(err){

            console.log(err);
            return;
        }
        //查询数据  {"username":req.body.username,"password":req.body.password}
        var result=db.collection('user').find({
            username:username,
            password:password
        });

        //另一种遍历数据的方法
        result.toArray(function(err,data){
            console.log(data);

            if(data.length>0){
                console.log('登录成功');
                //保存用户信息
                req.session.userinfo=data[0];

                res.redirect('/');  /*登录成功跳转到商品列表*/

            }else{
                //console.log('登录失败');
                res.send("<script>alert('登录失败');location.href='/login'</script>");
            }
            dbs.close();
        })

    })

})



app.get('/loginOut',function(req, res){
    //销毁session
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    });
});

app.get('/login', function(req, res){
    res.render('login');
});



app.get('/edit', function(req, res){
    res.render('edit');
});



app.listen(3000);
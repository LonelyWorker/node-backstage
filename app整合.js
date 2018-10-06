var express = require('express');
var app = new express();

var md5 = require('md5-node');

var DB = require('./module/db.js');

var fs = require('fs');

var multiparty = require('multiparty'); /* 图片上传模块, 既可以获取表单的数据, 也可以实现上传图片 */

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

app.use('/upload', express.static('upload'));


//自定义中间件 判断登录状态
// app.use(function(req, res, next){
//     if(req.url == '/login' || req.url == '/doLogin'){
//         next();
//     }else{
//         if(req.session.userinfo&&req.session.userinfo.username != ''){  //判断有没有登录
//             app.locals['userinfo'] = req.session.userinfo; /*配置全局变量 可以在任何模板里面使用 */
//             next();
//         }else{
//             res.redirect('/login');
//         }
//     }
// });

app.get('/', function(req, res){
  DB.find('product', {}, function(err, data){
      if(err){
          console.log(err);
          return;
      }
    //   dbs.close();
      // console.log(data);
      res.render('index',{
          list: data
      });
  });
});

//显示添加商品的页面
app.get('/add', function(req, res){
    res.render('add');
});

//获取表单提交的数据, 以及post过来的图片
app.post('/doAdd', function(req, res){
    //获取表单的数据以及post过来的数据
    var form = new multiparty.Form();
    form.uploadDir = 'upload';  //上传图片保存的地址 
    form.parse(req, function(err, fields, files){
        //获取提交的数据以及图片上传成功返回的图片信息
        // console.log(fields);

        // console.log(files);

        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];

        var pic = files.pic[0].path;
        // console.log(pic);
        

        DB.insert('product', {
            title: title,
            price: price,
            fee,
            description,
            pic
        }, function(err ,data){
            if(!err){
                res.redirect('/');//上传成功跳转到主页
            }
        });
    });
});


app.get('/edit', function(req, res){
    //获取get传值id
    var id = req.query.id;
    console.log(id);

    //去除数据库查询这个id对应的数据, 自增长的id要用{"_id":new DB.ObjectID(id)}

    DB.find('product', {"_id": new DB.ObjectID(id)}, function(err, data){
        // console.log(data);

        res.render('edit', {
            list: data[0]
        });
    });
})


app.post('/doEdit', function(req, res){
       //获取表单的数据以及post过来的数据
       var form = new multiparty.Form();
       form.uploadDir = 'upload';  //上传图片保存的地址 
       form.parse(req, function(err, fields, files){
            //console.log(fields);
            //console.log(files);

            var _id = fields._id[0]; //修改的条件
            var title = fields.title[0];
            var price = fields.price[0];
            var fee = fields.fee[0];
            var description = fields.description[0];
    
            var originalFilename = files.pic[0].originalFilename;
            var pic = files.pic[0].path;

            if(originalFilename){
                var setData = {  //修改了图片
                    title: title,
                    price: price,
                    fee,
                    description,
                    pic
                };
            }else{
                var setData = {   //没有修改图片
                    title: title,
                    price: price,
                    fee,
                    description
                };

                //删除临时文件
                fs.unlink(pic);
            }



            DB.update('product', {"_id": new DB.ObjectID(_id)}, setData, function(err, data){
                if(!err){
                    res.redirect('/');
                }
            });

       });
});




app.get('/delete', function(req, res){

    var id = req.query.id;
    DB.deleteOne('product', {}, function(err){
        if(!err){
            res.redirect('/');
        }
    });
    // res.send('delete');
});





app.post('/doLogin',function(req,res){
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
    
            res.redirect('/');  /*登录成功跳转到商品列表*/
    
        }else{
            //console.log('登录失败');
            res.send("<script>alert('登录失败');location.href='/login'</script>");
        }
    });
    
});



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


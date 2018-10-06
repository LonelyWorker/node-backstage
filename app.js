var express = require('express');

var app = new express(); //实例化

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

//引入模块
var admin = require('./router/admin.js');

//配置ejs引擎
app.set('view engine', 'ejs');

//配置静态托管
app.use(express.static('public'));

app.use('/upload', express.static('upload'));

app.use('/admin', admin);

app.listen(3000);
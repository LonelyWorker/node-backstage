var express = require('express');

var router = express.Router();

var DB = require('../../module/db.js');

var multiparty = require('multiparty'); /* 图片上传模块, 既可以获取表单的数据, 也可以实现上传图片 */

router.get('/', function(req, res){
    DB.find('product', {}, function(err, data){
        if(err){
            console.log(err);
            return;
        }
      //   dbs.close();
        // console.log(data);
        res.render('admin/product/index',{
            list: data
        });
    });
});

router.get('/add', function(req, res){
    res.render('admin/product/add');
});

//doAdd
router.post('/doAdd', function(req, res){
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
                res.redirect('/admin/product');//上传成功跳转到主页
            }
        });
    });
});

router.get('/edit', function(req, res){
    //获取get传值id
    var id = req.query.id;
    console.log(id);

    //去除数据库查询这个id对应的数据, 自增长的id要用{"_id":new DB.ObjectID(id)}

    DB.find('product', {"_id": new DB.ObjectID(id)}, function(err, data){
        // console.log(data);

        res.render('admin/product/edit', {
            list: data[0]
        });
    });
});

//doEdit
router.post('/doEdit', function(req, res){
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
                  res.redirect('/admin/index');
              }
          });

     });
});

router.get('/delete', function(req, res){

    var id = req.query.id;
    DB.deleteOne('product', {}, function(err){
        if(!err){
            res.redirect('/admin/index');
        }
    });
  });
  



module.exports = router;
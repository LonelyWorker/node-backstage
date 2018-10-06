//数据库操作
var MongoClient = require('mongodb').MongoClient;

var DbUrl = 'mongodb://localhost:27017/product'; //连接数据库

var ObjectID = require('mongodb').ObjectID;

function ___connectDb(callback){
    MongoClient.connect(DbUrl, function(err, dbs){
        var db = dbs.db('product');
        if(err){
            console.log('连接数据库失败');
            return;
        }
        //增加 修改 删除
        callback(db);
        dbs.close();
    }); 
}

//暴露ObjectID
exports.ObjectID = ObjectID;








//数据库查找
/*
    Db.find('user', {}, function(err, data){
        data数据
    });
*/
exports.find = function(collectionname, json, callback){
    ___connectDb(function(db){
        var result = db.collection(collectionname).find(json);
        result.toArray(function(error, data){
            callback(error, data); //拿到数据执行回调函数
        });
    });
}

//添加数据
exports.insert = function(collectionname, json, callback){
    ___connectDb(function(db){
        db.collection(collectionname).insertOne(json, function(error, data){
            callback(error, data);
        });   
    });
}


//修改数据
exports.update = function(collectionname, json1,json2, callback){
    ___connectDb(function(db){
        db.collection(collectionname).update(json1,{$set:json2}, function(error, data){
            callback(error, data);
        });
    });
}


//删除数据
exports.deleteOne = function(collectionname, json, callback){
    ___connectDb(function(db){
        db.collection(collectionname).deleteOne(json, function(error, data){
            callback(error, data);
        });
    });
}







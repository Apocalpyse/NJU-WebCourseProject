var express = require('express');
var router=express.Router();
var path="";
var fs=require('fs');
var form=require('formidable');


function getConnectedDB() {//连接数据库
    var sqlite3 = require('sqlite3').verbose();
    var dbFile='db/NoteDB.db';
    var dbAccount='cdl';
    var dbPassword='123456';
    var db = new sqlite3.Database(dbFile,dbAccount,dbPassword);
    return db;
}


//初始界面为登录界面
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/index',function (req,res,next) {
    var account=req.body.account;
    var password=req.body.password;
    if(account!==""&&password!==""){
        var db=getConnectedDB();
        if(account.toString()[0]!='m'){
            var stmt="SELECT * FROM user WHERE account='"+account+"' AND password='"+password+"'";
            db.all(stmt,function (err,row) {
                if(!err){
                    if(row.length===0){
                        var data={state:"帐号或密码错误"};
                        db.close();
                        res.send(data);
                    }else {
                        res.cookie("account",account,{ maxAge: 1000*60*30,httpOnly:true, path:'/main'});
                        data={account:account,password:password,state:"登录成功",type:"user"};
                        db.close();
                        res.send(data);
                    }
                }
            });
        }else {
            var stmt="SELECT * FROM manager WHERE account='"+account+"' AND password='"+password+"'";
            db.all(stmt,function (err,row) {
                if(!err){
                    if(row.length===0){
                        var data={state:"帐号或密码错误"};
                        db.close();
                        res.send(data);
                    }else {
                        res.cookie("account",account,{ maxAge: 1000*60*30,httpOnly:true, path:'/manager'});
                        data={account:account,password:password,state:"登录成功",type:"manager"};
                        db.close();
                        res.send(data);
                    }
                }
            });
        }
    }
});


//主页
router.get('/main',function (req,res,next) {
    res.render("main");
});

router.post('/main',function (req,res,next) {
    if(req.cookies.account!==undefined){
        var data=[];
        var account=req.cookies.account;
        data.push(account);
        var db=getConnectedDB();
        var stmt="SELECT * FROM notes WHERE owner='"+account+"'";
        db.all(stmt,function (err,row) {
            if(!err){
                row.forEach(function (each) {
                    data.push(each.noteName);
                });
                db.close();
                res.send(data);
            }
        });
    }else {
        res.send("请先登录");
    }
});

router.get('/main/getPages',function (req,res,next) {
    var data=[];
    var noteName=req.query.noteName;
    var owner=req.query.account;
    var db=getConnectedDB();
    var stmt="SELECT noteId FROM notes WHERE noteName='"+noteName+"' AND owner='"+owner+"'";
    db.all(stmt,function (err,row) {
        if(!err){
            stmt="SELECT * FROM pages WHERE noteId='"+row[0].noteId+"'";
            db.all(stmt,function (err,row) {
                if(!err){
                    row.forEach(function (each) {
                        data.push(each.title);
                    });
                    db.close();
                    res.send(data);
                }
            });
        }
    });
});

router.get('/main/getPagesContext',function (req,res,next) {
    var data=[];
    var title=req.query.title;
    var db=getConnectedDB();
    var stmt="SELECT context FROM pages WHERE title='"+title+"'";
    db.all(stmt,function (err,row) {
        if(!err){
           var data={context:row[0].context};
            db.close();
           res.send(data);
        }
    });
});

router.get('/main/deleteNote',function (req,res,next) {
    var noteName=req.query.noteName;
    var owner=req.query.owner;
    var db=getConnectedDB();
    var stmt="DELETE FROM notes WHERE noteName='"+noteName+"' AND owner='"+owner+"'";
    db.run(stmt,function () {
        var data={state:"删除成功"};
        db.close();
        res.send(data);
    });
});

router.get('/main/deletePage',function (req,res,next) {
    var title=req.query.title;
    var noteName=req.query.noteName;
    var owner=req.query.owner;
    var db=getConnectedDB();
    var stmt="SELECT noteId FROM notes WHERE noteName='"+noteName+"' AND owner='"+owner+"'";
    console.log(stmt);
    db.all(stmt,function (err,row) {
       stmt="DELETE FROM pages WHERE noteid='"+row[0].noteId+"' AND title='"+title+"'";
       console.log(stmt);
       db.run(stmt,function () {
           var data={state:"删除成功"};
           db.close();
           res.send(data);
       });
    });
});

router.get('/main/createNote',function (req,res,next) {
    var noteName=req.query.noteName;
    var owner=req.query.owner;
    var db=getConnectedDB();
    var stmt="INSERT INTO notes(noteName,owner) VALUES('"+noteName+"','"+owner+"')";
    db.run(stmt,function (err) {
        if(!err){
            var data={state:"创建成功"};
            db.close();
            res.send(data);
        }
    });
});

//注册界面
router.get('/register',function (req,res,next) {
    path='/register';
    res.render('register');
});

router.post('/register',function (req,res,next) {
    var account=req.body.newAccount;
    var password1=req.body.password1;
    var password2=req.body.password2;
    if(account!==""&&password1!==""&&password2!==""){
        var db=getConnectedDB();
        if(account.toString()[0]==='m'){
            var data={state:"不可以注册管理员账户"};
            db.close();
            res.send(data);
        }else {
            var stmt="SELECT * FROM user WHERE account='"+account+"'";
            db.all(stmt,function (err,row) {
                if(!err){
                    if(row.length===0){
                        stmt="INSERT INTO user values('"+account.toString()+"','"+password1.toString()+"')";
                       db.run(stmt);
                       var data={state:"注册成功"};
                        db.close();
                       res.send(data);
                    }else {
                        var data={state:"该账户已经存在"};
                        db.close();
                        res.send(data);
                    }
                }
            })
        }
    }
});


//管理员界面
router.get('/manager',function (req,res,next) {
    res.render('manager');
});

//查找所有用户
router.post('/manager/searchUser',function (req,res,next) {
    var data=[];
    var db=getConnectedDB();
    var stmt="SELECT account FROM user";
    db.all(stmt,function (err,row) {
        if(!err){
            row.forEach(function (each) {
                data.push(each.account);
            });
            db.close();
            res.send(data);
        }
    });
});

//删除用户
router.get('/manager/deleteUser',function (req,res,next) {
    var account=req.query.account;
    var db=getConnectedDB();
    var stmt="DELETE FROM user WHERE account='"+account+"'";
    db.run(stmt);
    var data={state:"删除成功"};
    res.send(data);
});

//管理员改用户密码
router.get('/manager/changeUserPW',function (req,res,next) {
  var account=req.query.account;
  var password=req.query.password;
  var db=getConnectedDB();
  var stmt="UPDATE user SET password='"+password+"' WHERE account='"+account+"'";
  db.run(stmt,function (err,row) {
      if(!err){
          var data={state:"修改密码成功"};
          res.send(data);
      }
  });
});

//改密界面
router.get('/changePW',function (req,res,next) {
    res.render('changePW');
});

router.post('/changePW',function (req,res,next) {
    var oldAccount=req.body.oldAccount;
    var oldPassword=req.body.oldPassword;
    var newPassword=req.body.newPassword;
    if(oldAccount!==""&&oldPassword!==""&&newPassword!==""){
        var db=getConnectedDB();
        var stmt="SELECT * FROM user WHERE account='"+oldAccount+"'";
        db.all(stmt,function (err,row) {
            if(!err){
                if(row.length===0){
                    var data={state:"帐号不存在"};
                    db.close();
                    res.send(data);
                }else {
                    stmt="SELECT * FROM user WHERE account='"+oldAccount+"' AND password='"+oldPassword+"'";
                    db.all(stmt,function (err,row) {
                        if(!err){
                            if(row.length===0){
                                var data={state:"原密码错误"};
                                db.close();
                                res.send(data);
                            }else {
                                stmt="UPDATE user SET password='"+newPassword+"' WHERE account='"+oldAccount+"'";
                                db.run(stmt);
                                var data={state:"成功修改密码"};
                                db.close();
                                res.send(data);
                            }
                        }
                    });
                }
            }
        });
    }
});




//保存笔记
router.get('/main/submit',function (req,res,next) {
   var noteName=req.query.note;
   var title=req.query.title;
   var context=req.query.context;
   var user=req.query.account;
   var db=getConnectedDB();
   var stmt="SELECT noteId FROM notes WHERE noteName='"+noteName+"' AND owner='"+user+"'";
   db.all(stmt,function (err,row) {
       if(!err){
           var noteid=row[0].noteId;
           stmt="SELECT * FROM pages WHERE noteid='"+noteid+"' AND title='"+title+"'";
           db.all(stmt,function (err,row) {
               if(row.length===0){
                   stmt="INSERT INTO pages VALUES('"+noteid+"','"+title+"','"+context+"')";
                   db.run(stmt);
                   var data={state:"保存成功"};
                   db.close();
                   res.send(data);
               }else {
                   stmt="UPDATE pages SET context='"+context+"' WHERE noteid='"+noteid+"' AND title='"+title+"'";
                   db.run(stmt);
                   var data={state:"保存成功"};
                   db.close();
                   res.send(data);
               }
           });

       }
   });
});



module.exports = router;

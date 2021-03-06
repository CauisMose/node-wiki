var Wikis = require('../models/wiki');
var Manages = require('../models/manage');
var Trends = require('../models/trend');



exports.edit = function(req, res){ 
    Wikis.findOne({'title': req.body.title}, function(err,wiki){
        if(!wiki) return res.status(404).json({error: "wiki does not exist"});
            var newcon = req.body.contents;
            wiki.date = new Date();
            Trends.findOne({"title": req.body.title}, function(err, list){
                if(!list){
                    var list = new Trends();
                    list.title = req.body.title;
                    list.search = 0;
                } else {
                    list.edit += 1;
                }
                list.save();
            })
            if(err){
                res.status(500).send("update error");
                return;
            };
            wiki.contents = newcon;
            wiki.save(function(err){
                if(err) res.status(500).json({error: "failed to update"});
                res.send({status:1});
            });
        });
};


exports.create = function(req, res){
    Manages.findOne({title: 'manager1'},function(err, manage){
        Wikis.findOne({'title': req.body.title}, function(err, wiki){
            if(wiki){
                return res.send({status:404})
            } else {
                var wiki = new Wikis();
                if(req.body.password){
                    wiki.password = req.body.password;
                }
                req.body.title = req.body.title.replace(/(<([^>]+)>)/gi, ""); //태그 제거 정규표현식
                wiki.title = req.body.title;
                wiki.number = manage.number;
                wiki.contents = req.body.contents;
                wiki.date = new Date();

                wiki.save(function(err){
                    if(err){
                        console.error(err);
                        res.render({status: 0});
                        console.log({status: 0});
                        return;
                    }
                    res.send({status:'success', newtitle: req.body.title});
                });
                manage.number = manage.number+1;
                manage.save(function(err){
                    if(err){
                        console.error(err);
                        res.render({status: 0});
                        console.log({status: 0});
                        return;
                    }
                })
            }
        }); //wiki findone

    }); //manage fine 
};

exports.delete = function(req, res){
    Wikis.findOne({title: req.body.title}, function(err, wiki){
        if(wiki.permission==1){
            Wikis.remove({title: req.body.title}, function(err, output){
                Trends.remove({title:req.body.title}, function(err, output){
                }); // 만약 trend에 있다면 해당 document 지우기
                if(err) return res.status(500).json({ error: "database failure" });
                res.send({status:'success'});    
            })
        }
        if(wiki.permission==0){
            if(err)  return res.status(500).json({ error: "database failure" });
            res.send({status:'fail'});
        }
    })


};


exports.existPw = function(req, res){
    Wikis.findOne({title:req.body.path}, function(err, wiki){
        if(wiki.password != null){
            res.send({status:'existent'});// password가 존재
        } else{
            res.send({status:'nonexistent'}); // password가 존재X
        }
            
    })
}

exports.checkPw = function(req, res){
    if(req.body.path){ // path가 존재한다는 건 show page에서 보낸 요청
        Wikis.findOne({title: req.body.path}, function(err, wiki){
            if(wiki.password === req.body.password){
                res.send({status:'success'});
            }// 패스워드 성공 
            else
                res.send({status:'fail'}); // 패스워드 실패
        })
    } else { // path가 없는 것은 create page에서 보낸 요청 
        Manages.findOne({title:'manager1'}, function(err, manage){
            if(req.body.password == manage.password){
                res.send({status:'success'});
            } else 
                res.send({status:'fail'});
        })
    }
}

exports.random = function(req, res){
    Wikis.find({}, function(err, wikis){
        if(wikis.length == 0){ // 글이 아무것도 없으면
            res.send({status:2});
        }
        var random = Math.floor(Math.random() * wikis.length);
        res.send({status:1, path: wikis[random].title})
    })
}

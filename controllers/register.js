const path = require('path');

module.exports = [get, post];

function get(req,res){
    res.render(path.join(__dirname,'../static/register.html'));
}

function post(req,res){
    let db = require('../helpers/database')(require('../config.json'));
    let bcrypt = require('bcrypt');
    db.query("INSERT INTO clients (username, password, name, surname) VALUES (?, ?, ?, ?)",[req.body.username, bcrypt.hashSync(req.body.password, 10), req.body.name, req.body.surname],(err)=>{
        if(err){
            console.log(err);
            res.render(path.join(__dirname,'../static/register.html'), {danger:"Kullanıcı oluşturulamadı: Sunucu Hatası."});
        }else{
            res.render(path.join(__dirname,'../static/register.html'), {success:"Kullanıcı başarıyla oluşturuldu."});
        }
    });
}
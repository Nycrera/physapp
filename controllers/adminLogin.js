const path = require('path');

module.exports = [get, post];

function get(req, res, next) {
    if (req.session.loggedIn) {
        res.redirect('/admin_dashboard');
    } else {
        res.render(path.join(__dirname,'../pages/admin_login.html'));
    }

}

function post(req, res, next) {
    checkAdminCredentails(req.body.username, req.body.password, (isValid, id) => {
        if (isValid) {
            req.session.loggedIn = true;
            req.session.isAdmin = true;
            req.session.adminId = id;
            res.redirect('/admin_dashboard');
        } else {
            res.render(path.join(__dirname,'../pages/admin_login.html'), {danger: "Giriş Başarısız: Kullanıcı adı veya şifre hatalı girildi."});
        }
    });
};

function checkAdminCredentails(uname, pass, cb) {
    if (uname && pass) {
        let bcrypt = require('bcrypt');
        let db = require('../helpers/database')(require('../config.json'));
        db.query('SELECT * FROM admins WHERE username = ?', [uname], (err, result, fields) => {
            if(err){
                console.log(err);
                res.end(500);
                return;
            }
            if (result.length > 0 && bcrypt.compareSync(pass,result[0].password)) {
                cb(true, result[0].id);
            } else {
                cb(false);
            }
        });
    }
}
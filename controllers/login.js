module.exports = [get, post];

function get(req, res, next) {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render(path.join(__dirname, '../static/login.html'));
    }

}

function post(req, res, next) {
    checkUserCredentails(req.body.username, req.body.password, (isValid, id) => {
        if (isValid) {
            req.session.loggedIn = true;
            req.session.username = req.body.username;
            req.session.userId = id;
            res.redirect('/dashboard');
        } else {
           res.render(path.join(__dirname, '../static/login.html'),{danger: "Giriş Başarısız: Kullanıcı adı veya şifre hatalı girildi."});
        }
    });
};

function updateLastLogin(userId, db) {
    db.query('UPDATE clients SET lastlogin = NOW() WHERE id = ?', [userId], (err, result, fields) => {
        if (err) console.log(err);
    });
};

function checkUserCredentails(username, pass, cb) {
    if (username && pass) {
        let bcrypt = require('bcrypt');
        let db = require('../helpers/database')(require('../config.json'));
        db.query('SELECT * FROM clients WHERE username = ? AND password = ?', [username, bcrypt.hashSync(pass, 10)], (err, result, fields) => {
            if (result.length > 0) {
                cb(true, result[0].id);
                updateLastLogin(result[0].id, db);
            } else {
                cb(false);
            }
        });
    }
}
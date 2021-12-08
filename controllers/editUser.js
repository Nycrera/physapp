const path = require('path');

module.exports = [get, post];

function get(req, res, next) {
    if (!req.query.id) res.redirect('/admin_dashboard');
    else {
        let db = require('../helpers/database')(require('../config.json'));
        db.query('SELECT * FROM clients WHERE id = ?', [req.query.id], (err, result) => {
            if (result.length == 0 || err) {
                console.log('error white fetching user');
                console.log(err);
                res.redirect('/admin_dashboard');
            } else {
                let user = result[0];
                res.render(path.join(__dirname, '../pages/edituser.html'), { user: user });
            }
        });
    }
}

function post(req, res, next) {
    if (!req.body.id) {
        res.redirect('/admin_dashboard');
    } else {
        let queryString = queryGenerator(req.body);
        let db = require('../helpers/database')(require('../config.json'));
        db.query(queryString, [req.body.id], (err) => {
            db.query('SELECT * FROM clients WHERE id = ?', [req.body.id], (err, result) => {
                let user = result[0];
                if (err) {
                    console.log(err);
                    res.render(path.join(__dirname, '../pages/edituser.html'), { user: user, danger: 'Kullanıcı güncellemesi sırasında hata.' });
                } else {
                    res.render(path.join(__dirname, '../pages/edituser.html'), { user: user, success: 'Kullanıcı başarıyla güncellendi.' });
                }
            });
        });
    }
}

function queryGenerator(data) {
    const mysql = require('mysql');
    params = '';

    for (var key in data) {
        if (prop == 'id') continue;
        if (data[key]) params += mysql.escapeId(key) + ' = ' + mysql.escape(data[key]) + ', ';
    }


    params = params.slice(0, -2); //Remove last ","
    return 'UPDATE clients SET ' + params + ' WHERE id = ?';
}
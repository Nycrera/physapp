const path = require('path');

module.exports = function (req, res, next) {
    if (!req.query.id) {
        res.redirect('/admin_dashboard');
        return;
    }
    let db = require('../helpers/database')(require('../config.json'));
    db.query('SELECT * FROM clients WHERE id = ?', [req.query.id], (err, clients) => {
        db.query('SELECT * FROM exercises', [], (err2, exercises) => {
            db.query('SELECT * FROM user_exercises WHERE  client = ? AND expiration_time >= NOW() AND disabled = FALSE', [req.query.id], (err3, user_exercises) => {
                db.query('SELECT * FROM user_exercises WHERE  client = ? AND disabled = FALSE', [req.query.id], (err4, all_user_exercises) => {
                    if (err || err2 || err3 || err4) {
                        console.log(err);
                        console.log(err2);
                        console.log(err3);
                        console.log(err4);
                        res.status(500);
                        res.end();
                        return;
                    }
                    var months = [];
                    var years = [];
                    all_user_exercises.forEach(el => {
                        if (!months.find(val => val == el.expiration_time.getMonth() + 1)) {
                            months.push(el.expiration_time.getMonth() + 1);
                        }
                        if (!years.find(val => val == el.expiration_time.getFullYear())) {
                            years.push(el.expiration_time.getFullYear());
                        }
                    });


                    var client = clients[0];
                    res.render(path.join(__dirname, '../pages/viewprofile.html'), { client: client, exercises: exercises, months: months, years: years, user_exercises: user_exercises/*USER DATA*/ });
                });
            });
        });
    });
}
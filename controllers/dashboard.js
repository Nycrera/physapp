var path = require('path');

module.exports = function (req, res, next) {
    let db = require('../helpers/database')(require('../config.json'));
    db.query('SELECT * FROM user_exercises WHERE client = ? AND expiration_time >= NOW() AND disabled = FALSE', [req.session.userId], (err, result) => {
        if (err) console.log(err);
        let countOfRows = result.length;
        let exercisesProcessed = 0;
        let exercisesData = [];
        if (countOfRows == 0) {
            res.render(path.join(__dirname, '../pages/dashboard_empty.html'));
            return;
        } else {
            result.forEach(el => {
                db.query('SELECT * FROM exercises WHERE id = ?', [el.exercise], (err2, result2) => {
                    exercisesProcessed++;
                    if (err2) console.log(err2);
                    exercisesData.push({ id: el.id,name: result2[0].name ,typeId: result2[0].id, video: result2[0].video, done: el.done });
                    if (exercisesProcessed == countOfRows) {
                        res.render(path.join(__dirname, '../pages/dashboard.html'), { exercises: exercisesData });
                    }
                });
            });
        }
    });
}
module.exports = function (req, res, next) {
    if (req.body.exercise) {
        let exercise = req.body.exercise;
        let db = require('../helpers/database')(require('../config.json'));
        db.query('UPDATE user_exercises SET done = ? WHERE id = ? AND client = ?', [exercise.done, exercise.id, req.session.userId], (err, result, fields) => {
            if (err) console.log(err);
            res.send('ok');
        });
    } else {
        res.status(400);
        res.send('Malformed input');
    }
}
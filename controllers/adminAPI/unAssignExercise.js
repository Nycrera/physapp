module.exports = function (req, res, next) {
    let exerciseId = req.body.exerciseId
    let db = require('../../helpers/database')(require('../../config.json'));
    db.query('UPDATE user_exercises SET disabled = TRUE WHERE id = ?', [exerciseId], (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.end();
            return;
        }
        res.json({});
    });
}
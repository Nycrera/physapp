module.exports = function (req, res, next) {
    let db = require('../../helpers/database')(require('../../config.json'));
    let exercise = req.body;
    db.query("INSERT INTO exercises (name, video) VALUES (?,?)", [exercise.name, exercise.video], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.end();
        } else {
            res.json({ id: result.insertId, name: exercise.name, video: exercise.video });
        }
    });
}
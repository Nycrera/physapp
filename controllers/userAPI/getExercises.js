module.exports = function (req, res, next) {
    let db = require('../../helpers/database')(require('../../config.json'));
    db.query('SELECT * FROM user_exercises WHERE client = ? AND expiration_time >= NOW() AND disabled = FALSE', [req.session.userId], (err, result) => {
        if (err) console.log(err);
        let countOfRows = result.length;
        let exercisesProcessed = 0;
        let exercisesData = { exercises: [] };
        if (countOfRows == 0) return;
        result.forEach(el => {
            db.query('SELECT * FROM exercises WHERE id = ?', [el.exercise], (err2, result2) => {
                exercisesProcessed++;
                if(!el.disabled) exercisesData.exercises.push({ id: el.id, typeId: result2[0].id, video: result2[0].video, done: el.done });
                if (exercisesProcessed == countOfRows) {
                    res.json(exercisesData);
                }
                if(err2) console.log(err2);
            });
        });
    });
}
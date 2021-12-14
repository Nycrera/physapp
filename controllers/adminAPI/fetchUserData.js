module.exports = function (req, res, next) {
    if (!req.body.client_id || !req.body.month || !req.body.year) {
        res.status(500);
        res.end();
        return;
    }

    let db = require('../../helpers/database')(require('../../config.json'));
    db.query('SELECT * FROM user_exercises WHERE client = ? AND MONTH(expiration_time) = ? AND YEAR(expiration_time) = ? AND disabled = FALSE', [parseInt(req.body.client_id), parseInt(req.body.month), parseInt(req.body.year)], (err, user_exercises) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.end();
            return;
        }
        db.query('SELECT * FROM exercises',[], (err2,exercises)=>{
            if (err2) {
                console.log(err2);
                res.status(500);
                res.end();
                return;
            }
            for(let i=0;i<user_exercises.length;i++){
                var foundExercise = exercises.find((e) => e.id == user_exercises[i].exercise);
                user_exercises[i].name = foundExercise.name;
            }
            res.json({ user_exercises: user_exercises });
        });
    });
}
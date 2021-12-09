// This should be executed at the beggining of each day at 00:10:00, 10 minute delay because why not.
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = function () {
    let db = require('./database')(require('../config.json'));
    db.query('SELECT * FROM user_exercises WHERE disabled = FALSE AND expiration_time >= CURDATE() - INTERVAL 1 DAY AND expiration_time < CURDATE();', [], (err, exercisesToCopy) => {
        var length = exercisesToCopy.length;
        var counter = 0;
        exercisesToCopy.forEach(user_exercise => {
            db.query('INSERT INTO user_exercises (client,exercise,expiration_time) VALUES (?,?,date_add(CURDATE(), interval 24*60*60 - 1 second))', [user_exercise.client,user_exercise.exercise], (err2) => {
                counter++;
                if (counter == length) {
                    if (err || err2) {
                        console.log(err);
                        console.log(err2);
                        fetch('https://ntfy.sh/physapp', {
                            method: 'POST',
                            body: 'ERROR: Failed to populate new exercise assignments.'
                        });
                    }
                    return;
                }
            });
        });
    });
}
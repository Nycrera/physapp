const path = require('path');

module.exports = function(req, res){
    let db = require('../helpers/database')(require('../config.json'));
    db.query('SELECT * FROM exercises', [], (err, exercises) => {
        db.query('SELECT * FROM videos', [], (err2, videos) => {
            if(err || err2){
                console.log(err);
                console.log(err2);
            }

            res.render(path.join(__dirname,'../pages/exercises.html'),{exercises:exercises, videos:videos});
        });
    });
}
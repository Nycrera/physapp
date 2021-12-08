module.exports = function(req, res, next){
    let db = require('../helpers/database')(require('../config.json'));
    db.query('UPDATE exercises SET name = ? ,video = ? WHERE id = ?', [req.body.data.name, req.body.data.video, req.body.id], (err) => {
        db.query('SELECT * FROM exercises WHERE id = ? WHERE disabled = FALSE', [req.body.id], (err2, result2) => {
            if(err || err2){
                console.log(err);
                console.log(err2);
                res.end(500);
                return;
            }
            res.json(result2[0]);
        });
    });
}
module.exports = function(req, res, next){
    if(!req.body.client_id || !req.body.month || !req.body.year){
        res.end(500);
        return;
    }

    let db = require('../../helpers/database')(require('../../config.json'));
            db.query('SELECT * FROM user_exercises WHERE client = ? AND MONTH(expiration_time) = ? AND YEAR(expiration_time) = ? AND disabled = FALSE',[parseInt(req.body.client_id),parseInt(req.body.month),parseInt(req.body.year)], (err,user_exercises)=>{
            if(err){
                console.log(err);
                res.end(500);
                return;
            }
            res.json({user_exercises: user_exercises}); 
        });
}
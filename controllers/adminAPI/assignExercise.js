module.exports = function(req,res,next){
    let exerciseTypeId = req.body.exerciseTypeId;
    let clientId = req.body.clientId;
    let db = require('../../helpers/database')(require('../config.json'));
    db.query('INSERT INTO user_exercises (client,exercise,expiration_time) VALUES (?,?,date_add(CURDATE(), interval 24*60*60 - 1 second))',[clientId,exerciseTypeId], (err,result)=>{
        if(err){
            console.log(err);
            res.end(500);
            return;
        }
        res.json({user_exercise:{id:result.insertId}});
    });
}
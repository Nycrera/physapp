module.exports = function(req,res,next){
    let exerciseTypeId = req.body.exerciseTypeId;
    let clientId = req.body.clientId;
    let db = require('../../helpers/database')(require('../../config.json'));
    db.query('INSERT INTO user_exercises (client,exercise,expiration_time) VALUES (?,?,date_add(CURDATE(), interval 24*60*60 - 1 second))',[clientId,exerciseTypeId], (err,result)=>{
        if(err){
            console.log(err);
            res.end(500);
            return;
        }
        db.query('SELECT (exercise) FROM user_exercises WHERE id=?',[result.insertId], (err2,exerciseData)=>{
            db.query('SELECT * FROM exercises WHERE id=?',[exerciseData.exercise], (err3,exerciseTypeData)=>{
            res.json({user_exercise:{id:result.insertId},exerciseType:exerciseTypeData});
        });
        });

    });
}
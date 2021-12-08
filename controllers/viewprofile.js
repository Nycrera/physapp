const path = require('path');

module.exports = function(req, res, next){
    if(!req.query.id){
        res.redirect('/admin_dashboard');
        return;
    }
    let db = require('../helpers/database')(require('../config.json'));
    db.query('SELECT * FROM clients WHERE id = ?',[req.query.id], (err,clients)=>{
        db.query('SELECT * FROM exercises WHERE disabled = FALSE',[], (err2,exercises)=>{
            db.query('SELECT * FROM user_exercises WHERE  client = ? AND expiration_time >= NOW() AND disabled = FALSE',[req.query.id], (err3,user_exercises)=>{
            if(err || err2 || err3){
                console.log(err);
                console.log(err2);
                console.log(err3);
                res.end(500);
                return;
            }
            var client = clients[0];
            res.render(path.join(__dirname,'../static/viewprofile.html'), {client:client, exercises:exercises, user_exercises: user_exercises/*USER DATA*/} );
        });
        });
    });
}
module.exports = function (req, res, next) {
    let db = require('../../helpers/database')(require('../../config.json'));
    db.query('SELECT * FROM clients WHERE disabled != TRUE', [req.session.userId], (err, result) => {
        if (err) console.log(err);
        let countOfUsers = result.length;
        let usersProcessed = 0;
        if(countOfUsers == 0){
            res.json({users:[]});
            return;
        }
        result.forEach((user,index) => {

            result[index].register_date = formatDate(result[index].register_date);
            result[index].lastlogin = formatDate(result[index].lastlogin);
            getProgress(db, user.id, (percentage) => {
                usersProcessed++;
                result[index].todayProgress = percentage;
                
                if (usersProcessed == countOfUsers) {
                    res.json({users:result});
                    return;
                }
            });

        });

    });
}

function getProgress(db, uid, cb) {
    db.query("SELECT * FROM user_exercises WHERE expiration_time >= NOW() AND disabled != TRUE AND client = ?", [uid], (err, result) => {
        let count = 0;
        result.forEach(el =>{
            if(!result.disabled) count++;
        });
        cb(Math.round(count / result.length * 100));
    });
}

function formatDate(date){
    return date.getFullYear().toString()+"-"+((date.getMonth()+1).toString().length==2?(date.getMonth()+1).toString():"0"+(date.getMonth()+1).toString())+"-"+(date.getDate().toString().length==2?date.getDate().toString():"0"+date.getDate().toString())+" "+(date.getHours().toString().length==2?date.getHours().toString():"0"+date.getHours().toString())+":"+((parseInt(date.getMinutes()/5)*5).toString().length==2?(parseInt(date.getMinutes()/5)*5).toString():"0"+(parseInt(date.getMinutes()/5)*5).toString())+":00";
    // format to type like 2015-03-31 13:35:00

}
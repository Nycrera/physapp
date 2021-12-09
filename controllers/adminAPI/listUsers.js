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

const formatDate = (d)=> {
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date} ${time}`
  }
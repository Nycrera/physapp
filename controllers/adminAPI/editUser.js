module.exports = function (req, res, next) {
    if (!req.body.id) {
        res.status(500);
        res.end();
    } else {
        let queryString = queryGenerator(req.body);
        let db = require('../../helpers/database')(require('../../config.json'));
        db.query(queryString, [req.body.id], (err) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.end();
            } else {
                res.json({});
            }
        });
    }
}

function queryGenerator(data) {
    const mysql = require('mysql');
    params = '';

    for (var key in data) {
        if (key == 'id') continue;
        if (typeof (data[key]) !== 'undefined') params += mysql.escapeId(key) + ' = ' + mysql.escape(data[key]) + ', ';
    }

    params = params.slice(0, -2); //Remove last ","
    return 'UPDATE clients SET ' + params + ' WHERE id = ?';
}
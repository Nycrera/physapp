module.exports = function (req, res, next) {
    if (!req.body.id) {
        res.end(500);
    } else {
        let queryString = queryGenerator(req.body);
        let db = require('../helpers/database')(require('../config.json'));
        db.query(queryString, [req.body.id], (err) => {
                if (err) {
                    console.log(err);
                    res.end(500);
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
        if (data[key]) params += mysql.escapeId(key) + ' = ' + mysql.escape(data[key]) + ', ';
    }

    params = params.slice(0, -2); //Remove last ","
    return 'UPDATE clients SET ' + params + ' WHERE id = ?';
}
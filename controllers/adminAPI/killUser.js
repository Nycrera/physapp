
module.exports = function (req, res, next) {
    if (!req.body.id || typeof (req.body.disabled) === 'undefined') {
        res.status(500);
        res.end();
        return;
    }
    let db = require('../../helpers/database')(require('../../config.json'));
    db.query('UPDATE clients SET disabled = ? WHERE id = ?', [req.body.disabled, req.body.id], (err) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.end();
            return;
        }
        res.json({});
    });
}
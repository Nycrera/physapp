
module.exports = function (req, res, next) {
    if (!req.body.id || typeof (req.body.disabled) === 'undefined') {
        res.end(500);
        return;
    }
    let db = require('../../helpers/database')(require('../../config.json'));
    db.query('UPDATE clients SET disabled = ? WHERE id = ?', [req.body.disabled, req.body.id], (err) => {
        if (err) {
            console.log(err);
            res.end(500);
            return;
        }
        res.json({});
    });
}
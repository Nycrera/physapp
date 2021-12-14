const path = require('path');

module.exports = function (req, res) {
    if (!req.query.id || !req.query.name) {
        res.status(500);
        res.end("Hatalı Parametre");
        return;
    }
    res.render(path.join(__dirname, '../pages/killaccount.html'), { id: req.query.id, name: req.query.name });
}
const path = require('path');
const fs = require('fs');
module.exports = function (req, res, next) {

  let db = require('../../helpers/database')(require('../../config.json'));
  db.query('INSERT INTO videos (name) VALUES (?)', [req.body.name], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.end();
      return;
    }
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../../static/videos/", 'id_' + result.insertId.toString() + '.mp4' /* Video filename/id */);
    if (path.extname(req.file.originalname).toLowerCase() === ".mp4") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);
        res
          .status(200)
          .contentType("text/plain")
          .end(result.insertId.toString());
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        res
          .status(403)
          .contentType("text/plain")
          .end("Only .mp4 files are allowed!");
      });
    }
  });
}

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Well... Somethings' terribly wrong.");
};
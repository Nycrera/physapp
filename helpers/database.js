module.exports = function(config){
    var mysql      = require('mysql');
    var pool = mysql.createPool({
      host     : config.db.host,
      user     : config.db.user,
      password : config.db.password,
      database : config.db.database
    });
    return pool;  
}
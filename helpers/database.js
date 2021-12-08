module.exports = function(config){
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : config.db.host,
      user     : config.db.user,
      password : config.db.password,
      database : config.db.database
    });
    connection.connect();
    return connection;    
}
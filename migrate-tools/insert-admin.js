const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Username: ", function(username) {
    rl.question("Password: ", function(password) {
        let bcrypt = require('bcrypt');
        let db = require('../helpers/database')(require('../config.json'));
        db.query("INSERT INTO admins (username, password) VALUES (?, ?)",[username, bcrypt.hashSync(password, 10)],(err)=>{
            if(err){
                console.error("Registering failed:");
                console.error(err);
            }
            else
                console.log('Registering new admin is completed.')
        rl.close();
        });
        
    });
});

rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});

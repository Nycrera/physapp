const express = require('express');
const path = require('path');
const app = express();
const port = 1496;


var session = require('express-session');
var multer = require('multer');

app.set('trust proxy', 'loopback');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('static'));


app.use(session({ secret: 'Keep it secret', resave: true,name: 'uniqueSessionID', saveUninitialized: false }));

const admin_auth = require('./middleware/adminAuth');
const auth = require('./middleware/auth');
const upload = multer({
    dest: './tmp' // Temporary path to store uploaded data
});

app.get('/', (req, res) => {
    if (req.session.loggedIn){
        if(req.session.isAdmin)
            res.redirect('/admin_dashboard');
        else
            res.redirect('/dashboard');
    }
    else
        res.redirect('/login');
});

//admin Pages
app.get('/admin_dashboard', admin_auth, (req, res) => {
    res.render(path.join(__dirname,'./pages/admin_dashboard.html'));
});


app.get('/registerUser',admin_auth,require('./controllers/register')[0]);
app.post('/registerUser',admin_auth, express.urlencoded({ extended: true }), require('./controllers/register')[1]);
app.get('/editUser', admin_auth, require('./controllers/editUser')[0]);
app.post('/editUser', admin_auth, express.urlencoded({ extended: true }), require('./controllers/editUser')[1]);
app.get('/killaccount',admin_auth,require('./controllers/killAccount'));
app.get('/exercises', admin_auth, require('./controllers/exercises'));
app.get('/viewprofile', admin_auth, require('./controllers/viewprofile'));

// useful redirections
app.get('/admin', (req,res) => res.redirect('/admin_login'));
app.get('/admin_logout',(req,res) => res.redirect('/logout'));
// ADMIN API
app.get('/adminAPI/listUsers', admin_auth, express.json(), require('./controllers/adminAPI/listUsers'));

app.post('/adminAPI/fetchUserData', admin_auth, express.json(), require('./controllers/adminAPI/fetchUserData'));
app.post('/adminAPI/editUser', admin_auth, express.json(), require('./controllers/adminAPI/editUser'));
app.post('/adminAPI/killUser', admin_auth, express.json(), require('./controllers/adminAPI/killUser'));
app.post('/adminAPI/createExercise', admin_auth, express.json(), require('./controllers/adminAPI/createExercise'));
app.post('/adminAPI/updateExercise', admin_auth, express.json(), require('./controllers/adminAPI/updateExercise'));
app.post('/adminAPI/assignExercise', admin_auth, express.json(), require('./controllers/adminAPI/assignExercise'));
app.post('/adminAPI/unAssignExercise', admin_auth, express.json(), require('./controllers/adminAPI/unAssignExercise'));

app.post('/adminAPI/upload', admin_auth, upload.single('file'), require('./controllers/adminAPI/upload'));

//user Pages

app.get('/dashboard', auth, require('./controllers/dashboard'));

// USER API
app.get('/userAPI/assignedExercises', auth, require('./controllers/userAPI/getExercises'));
app.post('/userAPI/updateStatus', auth, express.json(), require('./controllers/userAPI/updateExerciseStatus'));

// Log in and Log out routes
app.post('/admin_login', express.urlencoded({ extended: true }), require("./controllers/adminLogin")[1]);
app.get('/admin_login', require("./controllers/adminLogin")[0]);

app.post('/login', express.urlencoded({ extended: true }), require("./controllers/login")[1]);
app.get('/login', require("./controllers/login")[0]);
app.get('/logout', require("./controllers/logout"));

// Auto assigner cronjob
var CronJob = require('cron').CronJob;
var job = new CronJob('10 0 * * *', function() {
    require('./helpers/autoAssigner')();
}, null, true, 'Europe/Istanbul');
job.start();


app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
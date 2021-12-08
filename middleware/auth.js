module.exports = function(req,res,next){
    if(req.session.loggedIn && !req.session.isAdmin){
        next();
    }else{
        res.redirect('/login');
    }
};
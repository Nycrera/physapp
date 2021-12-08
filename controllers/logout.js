module.exports = function(req,res,next){
    let isAdmin = req.session.isAdmin ? true : false;
    req.session.destroy((err)=>{});
    if(isAdmin) res.redirect('/admin_login');
    else res.redirect('/');
}
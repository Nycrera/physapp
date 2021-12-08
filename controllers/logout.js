module.exports = function(req,res,next){
    req.session.destroy((err)=>{});
    res.redirect('/');
}
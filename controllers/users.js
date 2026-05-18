const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.register = async (req, res) => {
    // Accept either flat body { username, email, password } or nested { user: { ... } }
    const payload = req.body && req.body.user ? req.body.user : req.body;
    const { email, username, password } = payload;
    if (!username || !password) {
        req.flash('error', 'Username and password are required');
        return res.redirect('/register');
    }
    try {
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err)
        req.flash('success', 'Welcome to FieldFinder!');
        res.redirect('/fields');
    })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) =>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || req.session.returnTo || '/fields'
    delete res.locals.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash('success', 'Goodbye!');
    res.redirect('/fields');
  });
};

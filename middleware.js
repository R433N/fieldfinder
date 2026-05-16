const {fieldSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateField = (req, res, next) => {
       //if(!req.body.field) throw new ExpressError('Invalid Field Data', 400)

   const { error } = fieldSchema.validate(req.body);
   if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
   }
   else{
        next();
   }
}

module.exports.isAuthor = async( req, res, next) => {
    const {id} = req.params;
    const field = await Field.findById(id)
    if(!field.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this field')
        return res.redirect(`/fields/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {

    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}
const Field = require('../models/field');

module.exports.index = async (req, res) => {
    const fields = await Field.find({});
    res.render('fields/index', { fields });
};

module.exports.renderNewForm = (req, res) => {
    res.render('fields/new');
};

module.exports.createField = async (req, res) => {
    const field = new Field(req.body.field);
    field.images = req.files.map(f => ({url: f.path, filename:f.filename}));
    field.author = req.user._id;
    await field.save();
    console.log(field);
    req.flash('success', 'Successfully made a new field!');
    res.redirect(`/fields/${field._id}`);
};

module.exports.showField = async (req, res) => {
    const field = await Field.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }
    }).populate('author');
    if(!field){
        req.flash('error', 'Cannot find that field');
        return res.redirect('/fields');
    }
    res.render('fields/show', { field });
};

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const field = await Field.findById(id);
    if(!field){
        req.flash('error', 'Cannot find that field');
        return res.redirect('/fields');
    }
    res.render('fields/edit', {field});
};

module.exports.updateField = async (req, res) => {
    const {id} = req.params;
    const field = await Field.findByIdAndUpdate(id, { ...req.body.field });
    const imgs = req.files.map(f => ({url: f.path, filename:f.filename}));
    field.images.push(...imgs);
    await field.save();
    req.flash('success', 'Successfully updated field!');
    res.redirect(`/fields/${field._id}`);
};

module.exports.deleteField = async (req,res) => {
    const {id} = req.params;
    const field = await Field.findById(id)
    if(!field.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this field')
        return res.redirect(`/fields/${id}`);
    }
    await Field.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted field!');
    res.redirect('/fields');
};
const User = require('../models/users');

exports.categoriesController = {
    addCategories(req, res) {
        const query = { '_id' : req.userId };
        const newData = {
            'categories.study':  req.body.study,
            'categories.work':   req.body.work,
            'categories.hobby':  req.body.hobby,
            'categories.chores': req.body.chores
        };

        User.findOneAndUpdate(query, newData, {upsert: true}, (err, doc) => {
            if(err) {
                res.status(500).json({'error': 'Error while adding categories'});
            } else {
                res.status(200).redirect('http://127.0.0.1:5500/wisetime-frontend/home.html');
            }
        })
    }
}
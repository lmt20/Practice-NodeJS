exports.get404 = (req, res, next) => {
    res.status(404).render('errors/404');
}

exports.get500 = (error, req, res, next) => {
    return res.status(500).render('errors/505', {
        message: error.name + ": " + error.message
    });
} 

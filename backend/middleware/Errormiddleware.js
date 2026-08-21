function notFound(req, res, next){
    return res.status(404).json({message: `Route not found ${req.originalUrl}`})
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({message: err.message || "server error"});
}

module.exports = {notFound, errorHandler};
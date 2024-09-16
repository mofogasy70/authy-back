const socketMiddleware = (io) => (req, res, next) => {
    req.body.io = io;
    next();
};

export default socketMiddleware;

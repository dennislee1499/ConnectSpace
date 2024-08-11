const jwt = require('jsonwebtoken'); 
const { getUserInfo } = require('../controllers/AuthController');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Not authorized"); 

    jwt.verify(token, process.env.JWT_SECRET, async(err, payload) => {
        if (err) return res.status(403).send("Invalid Token"); 

        req.userId = payload.userId; 
        next(); 
    })
}

module.exports = { authenticateToken }; 
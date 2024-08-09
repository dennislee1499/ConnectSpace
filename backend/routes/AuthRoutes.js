const { Router } = require("express");
const { signup, login } = require('../controllers/AuthController');

const authRoutes = Router(); 

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

module.exports = authRoutes; 
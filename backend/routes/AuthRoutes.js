const { Router } = require("express");
const { signup } = require('../controllers/AuthController');

const authRoutes = Router(); 

authRoutes.post("/signup", signup);

module.exports = authRoutes; 
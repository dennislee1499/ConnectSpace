const { Router } = require("express");
const { signup, login, getUserInfo, updateProfile } = require('../controllers/AuthController');
const { authenticateToken } = require("../middlewares/AuthMiddleware");

const authRoutes = Router(); 

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", authenticateToken, getUserInfo)
authRoutes.post("/update-profile", authenticateToken, updateProfile);

module.exports = authRoutes; 
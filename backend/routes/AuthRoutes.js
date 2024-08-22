const { Router } = require("express");
const { signup, login, getUserInfo, updateProfile, addProfileImage } = require('../controllers/AuthController');
const { authenticateToken } = require("../middlewares/AuthMiddleware");
const multer = require("multer"); 

const authRoutes = Router(); 
const upload = multer({ dest: "uploads/profiles/" })

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", authenticateToken, getUserInfo)
authRoutes.post("/update-profile", authenticateToken, updateProfile);
authRoutes.post("/add-profile-image", authenticateToken, upload.single("profile-image"), addProfileImage);

module.exports = authRoutes; 
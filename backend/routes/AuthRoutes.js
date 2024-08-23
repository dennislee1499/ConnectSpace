const { Router } = require("express");
const { signup, login, getUserInfo, updateProfile } = require('../controllers/AuthController');
const { addProfileImage, removeProfileImage } = require("../controllers/ImageController"); 
const { authenticateToken } = require("../middlewares/AuthMiddleware");
const multer = require("multer"); 

const authRoutes = Router(); 
const upload = multer({ dest: "uploads/profiles/" })

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", authenticateToken, getUserInfo)
authRoutes.post("/update-profile", authenticateToken, updateProfile);
authRoutes.post("/add-profile-image", authenticateToken, upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", authenticateToken, removeProfileImage)

module.exports = authRoutes; 
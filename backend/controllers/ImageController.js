const User = require('../models/User');
const { renameSync, unlinkSync } = require('fs');

const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required"); 
        }

        const date = Date.now(); 
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            { profileImage: fileName },
            { new: true, runValidators: true }
        ); 

        res.status(200).json({
                profileImage: updatedUser.profileImage,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
}

const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req; 
        const user = await User.findById(userId); 

        if (!user) {
            return res.status(404).send("User not found"); 
        }

        if (user.profileImage) {
            unlinkSync(user.profileImage); 
        }

        user.profileImage = null; 
        await user.save(); 

        res.status(200).send("Profile Image deleted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
}

module.exports = { addProfileImage, removeProfileImage };
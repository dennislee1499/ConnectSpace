const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { renameSync, unlinkSync } = require('fs');

const maxAge = 4 * 24 * 60 * 1000; 

const createToken = (userId, email) => {
    return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body; 
        if (!email || !password) {
            return res.status(400).send("Email and Password are required.")
        }
   
        const createdUser = await User.create({ email, password }); 

        res.cookie('token', createToken(createdUser.id, email), {
            httpOnly: true, 
            maxAge, 
            secure: true,
            sameSite: "None", 
        });
    
        res.status(201).json({
            user: {
                id: createdUser.id,
                email: createdUser.email, 
                profileSetup: createdUser.profileSetup,
            },
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required.")
        } 

        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(404).send("User not found")
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Password is incorrect");
        }

        res.cookie('token', createToken(user.id, email), {
            httpOnly: true, 
            maxAge, 
            secure: true,
            sameSite: "None", 
        });

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email, 
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage,
                color: user.color,
            },
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
}

const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId); 
        if (!userData) {
            return res.status(404).send("User with provided ID not found");
        }

        res.status(200).json({
            user: {
                id: userData.id,
                email: userData.email, 
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                profileImage: userData.profileImage,
                color: userData.color,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req; 
        const { firstName, lastName, color } = req.body; 
        if (!firstName || !lastName) {
            return res.status(404).send("First/Last name and color is required. ");
        }

        const userData = await User.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup: true,
        }, { new: true, runValidators: true }
    );

        res.status(200).json({
            user: {
                id: userData.id,
                email: userData.email, 
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                profileImage: userData.profileImage,
                color: userData.color,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
}

// const addProfileImage = async (req, res, next) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send("File is required"); 
//         }

//         const date = Date.now(); 
//         let fileName = "uploads/profiles/" + date + req.file.originalname;
//         renameSync(req.file.path, fileName);

//         const updatedUser = await User.findByIdAndUpdate(
//             req.userId, 
//             { profileImage: fileName },
//             { new: true, runValidators: true }
//         ); 

//         res.status(200).json({
//                 profileImage: updatedUser.profileImage,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ err: 'Interval server error' });
//     }
// }

// const removeProfileImage = async (req, res, next) => {
//     try {
//         const { userId } = req; 
//         const user = await User.findById(userId); 

//         if (!user) {
//             return res.status(404).send("User not found"); 
//         }

//         if (user.profileImage) {
//             unlinkSync(user.profileImage); 
//         }

//         user.profileImage = null; 
//         await user.save(); 

//         res.status(200).send("Profile Image deleted successfully");
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ err: 'Interval server error' });
//     }
// }

module.exports = { signup, login, getUserInfo, updateProfile }; 
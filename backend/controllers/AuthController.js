const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                profileImageUrl: user.profileImageUrl,
                color: user.color,
            },
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
}

module.exports = { signup, login }; 
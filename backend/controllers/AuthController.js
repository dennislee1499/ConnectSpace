const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const maxAge = '4d'; 

const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body; 
        if (!email || !password) {
            return res.status(400).send("Email and Password are required.")
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const createdUser = await User.create({ email, password: hashedPassword }); 
        const token = await jwt.sign(
            { userId: createdUser._id, email },
            process.env.JWT_SECRET,
            { expiresIn: maxAge }
        );

        res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 4 * 24 * 60 * 1000, 
            secure: true,
            sameSite: "None", 
        });
    
        res.status(201).json({
            user: {
                id: createdUser.id,
                email: createdUser.email, 
                newUser: createdUser.newUser,
            },
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Interval server error' });
    }
};

module.exports = { signup }; 
const { genSalt } = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required."],
        },
        profileImageUrl: {
            type: String,
            required: false,
        },
        color: {
            type: Number,
            required: false,
        },
        newUser: {
            type: Boolean,
            default: false,
        },
    }
);

userSchema.pre("save", async function(next) {
    try {
        const saltRounds = 10;
        const salt = await genSalt(saltRounds);
        this.password = await hash(this.password, salt); 
        next(); 
    } catch (err) {
        next(err); 
    }
});

module.exports = mongoose.model("User", userSchema); 
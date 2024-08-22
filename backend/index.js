const express = require('express'); 
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/AuthRoutes');

mongoose.connect(process.env.MONGO_URI);
const port = process.env.PORT || 4001;
const jwtSecret = process.env.JWT_SECRET;

const app = express(); 

app.use(cors({
    credentials: true, 
    origin: process.env.CLIENT_URL,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json()); 

app.use("/api/auth", authRoutes); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


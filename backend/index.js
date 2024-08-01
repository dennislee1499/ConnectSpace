const express = require('express'); 
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/AuthRoutes');

mongoose.connect(process.env.MONGO_URI);
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET;

const app = express(); 

app.use(cors({
    credentials: true, 
    origin: process.env.CLIENT_URL,
}));

app.use(cookieParser());
app.use(express.json()); 

app.use("/api/auth", authRoutes); 

const server = app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
})


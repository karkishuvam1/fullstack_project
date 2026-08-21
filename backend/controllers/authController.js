const User = require("../models/User");
const generateToken = require("../utils/generateToken");

async function registerUser(req, res){
    try {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields." });
        }
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists." });
        }
        const user = await User.create({name, email, password});
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token:generateToken(user._id),
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: error.message || "Something went wrong. Please try again." });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
        return res.status(400).json({ message: "Please enter your email and password." });
        }
    
        const user = await User.findOne({ email });

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message: "Invalid email or password."});
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);   // or "LOGIN ERROR:" in loginUser
        res.status(500).json({ message: error.message || "Something went wrong. Please try again." });
    }
}

module.exports = {registerUser, loginUser}
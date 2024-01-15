const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
const authMiddlewares = require("../middlewares/authMiddlewares");

// register user 
router.post("/register", async (req, res) => {
    try {
        // check if user already exists 
        const userExits = await User.findOne({ email: req.body.email });
        if (userExits) {
            return res.send({
                success: false,
                message: "User already exists",
            })
        }

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
        req.body.confirmPassword = undefined;

        // save user 
        const user = new User(req.body);
        await user.save();

        return res.send({
            success: true,
            message: 'User registered successfully',
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message,
        })
    }
})

// login user 
router.post("/login", async (req, res) => {
    try {
        // check if user exists 
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send({
                success: false,
                message: "User not found",
            })
        }

        //   compare password 
        const isvalid = await bcrypt.compare(req.body.password, user.password);
        if (!isvalid) {
            return res.send({
                success: false,
                message: "Invalid password",
            });
        }

        // generate token 
        const token = jwt.sign(
            { userId: user._id }, process.env.jwt_secret, { expiresIn: '3d' }
        );

        return res.send({
            success: true,
            message: "User logged in successfully",
            data: token,
        });

    } catch (error) {
        return res.send({
            success: true,
            message: error.message,
        });
    }
})



module.exports = router;
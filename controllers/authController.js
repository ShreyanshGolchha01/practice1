import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const signup =
    async (req, res, next) => {
        try {
            const {
                email,
                password
            }
                =
                req.body;
            const userExists =
                await User.findOne({

                    email

                });
            if (userExists) {

                return res
                    .status(400)
                    .send(
                        "User exists"
                    );

            }
            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );
            const user =
                await User.create({
                    email,
                    role: 'user',
                    password:
                        hashedPassword
                });
            res
                .status(201)
                .json({
                    message:
                        "Signup success",
                    user
                });
        }
        catch (err) {
            next(err);
        }
    };
export const login =
    async (req, res, next) => {
        try{
            const { 
                email,
                password
             } = req.body;
            const user = await User.findOne({ email });
            if(!user){
                return res.status(400).send("Invalid credentials");
             }
             const isMatch = await bcrypt.compare(password, user.password);
             if(!isMatch){
                return res.status(400).send("Invalid credentials");
             }
             const accesstoken = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
            { expiresIn: "1h" })
            const refreshtoken = jwt.sign(
                { id: user._id, role: user.role },
                process.env.REFRESH_SECRET,
            { expiresIn: "7d" })
            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).status(200).json({ accesstoken, message: "Login successful" });
        }
        catch(err){
            next(err);
            }
        };
export const getme =
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select("-password");
            if (!user) {
                return res.status(404).send("User not found");
            }
            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

export const refresh =
    async (req, res, next) => {
        try {
            const token = req.cookies.refreshtoken;
            if (!token) {
                const error = new Error("No token, authorization denied");
                error.status = 401;
                return next(error);
            }
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
            const accesstoken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.status(200).json({ accesstoken });
        }
        catch (err) {
            next(err);
        }
    };
export const logout = (req, res) => {
    res.clearCookie("refreshtoken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }).status(200).json({ message: "Logout successful" });
};
export const adminlogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) {
            const error = new Error("Invalid credentials");
            error.status = 400;
            return next(error);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.status = 400;
            return next(error);
        }
        const accesstoken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        const refreshtoken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({ accesstoken, message: "Admin login successful" });
    }
    catch (err) {
        next(err);
    }
};
export const adminsignup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email, role: 'admin' });
        if (userExists) {
            const error = new Error("Admin user exists");
            error.status = 400;
            return next(error);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            role: 'admin',
            password: hashedPassword
        });
        res.status(201).json({ message: "Admin signup success", user });
    }
    catch (err) {
        next(err);
    }
};
export const uploadFile = async (req, res, next) => {
    try {
        if (!req.files?.length) {
            const error = new Error("No file uploaded");
            error.status = 400;
            return next(error);
        }
        res.json({ message: "File uploaded successfully", files: req.files || [req.file] });
    } catch (err) {
        next(err);
    }
};
export const uploadSingleFile = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("No file uploaded");
            error.status = 400;
            return next(error);
        }
        res.json({ message: "File uploaded successfully", file: req.file });
    } catch (err) {
        next(err);
    }
};
import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const signup =
    async (req, res) => {
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
            res
                .status(500)
                .send(
                    err.message
                );
        }
    };
export const login =
    async (req, res) => {
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
                { id: user._id },
                process.env.JWT_SECRET,
            { expiresIn: "1h" })
            const refreshtoken = jwt.sign(
                { id: user._id },
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
            res.status(500).send(err.message);
            }
        };
export const getme =
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");
            if (!user) {
                return res.status(404).send("User not found");
            }
            res.status(200).json({ user });
        } catch (err) {
            res.status(500).send(err.message);
        }
    };

export const refresh =
    async (req, res) => {
        try {
            const token = req.cookies.refreshtoken;
            if (!token) {
                return res.status(401).send("No token, authorization denied");
            }
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
            const accesstoken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.status(200).json({ accesstoken });
        }
        catch (err) {
            res.status(401).send("Invalid token");
        }
    };
export const logout = (req, res) => {
    res.clearCookie("refreshtoken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }).status(200).json({ message: "Logout successful" });
};
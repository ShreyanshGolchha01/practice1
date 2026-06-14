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
             const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: '1h' });
             res.status(200).json({ message: "Login success", user, token });
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
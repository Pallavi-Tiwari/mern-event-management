import User from '../usermodels/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username) {
        return next(errorHandler(400, 'Username is empty'));
    }
    if (!email) {
        return next(errorHandler(400, 'Email is empty'));
    }
    if (!password) {
        return next(errorHandler(400, 'Password is empty'));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ success: true, message: 'User created successfully!' });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next)=> {
    const {email, password } = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Credentials provided are incorrect!'));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const { password: passW, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24*60*60*1000) })
        .status(200)
        .json(rest);
    } catch (error) {
        next(error)
        
    }
}
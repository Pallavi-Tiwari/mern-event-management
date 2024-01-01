import User from '../usermodels/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: 'Username empty!' });
    }
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email empty!' });
    }
    if (!password) {
        return res.status(400).json({ success: false, message: 'Password empty!' });
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
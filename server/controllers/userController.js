import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary'

//register user api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Người dùng đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({
            success: true,
            user: { email: user.email, name: user.name, _id: user._id, avatar: user.avatar }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

//login api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({ success: false, message: 'Email and password are required' })
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.json({ success: false, message: 'invalid email or password' });
         const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({
            success: true,
            user: { email: user.email, name: user.name, _id: user._id, avatar: user.avatar }
        });
    } catch (error) {
         console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

//check Auth api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//logout api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success:true,message:"Đã đăng xuất"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body
        const userId = req.userId

        const user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy người dùng" })
        }

        // Update basic info
        if (name) user.name = name
        if (email) user.email = email

        // Update avatar if uploaded
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, { 
                    resource_type: 'image',
                    folder: 'avatars'
                })
                user.avatar = result.secure_url
            } catch (uploadError) {
                console.log('Cloudinary upload error:', uploadError)
                return res.json({ success: false, message: "Upload ảnh thất bại " })
            }
        }

        // Update password if provided
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isMatch) {
                return res.json({ success: false, message: "Mật khẩu hieenjtaij không đúng" })
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            user.password = hashedPassword
        }

        await user.save()

        res.json({
            success: true,
            message: "Chỉnh sửa thành công",
            user: { email: user.email, name: user.name, _id: user._id, avatar: user.avatar }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

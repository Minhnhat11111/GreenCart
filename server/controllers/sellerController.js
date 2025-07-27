
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

    if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL)
    {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('sellerToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });
        return res.json({ success: true, message: "Logged In" });
    } else {
        return res.json({ success: false, message: "Invalid Credentails" });
    }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//check Auth api/seller/is-auth
export const isSellerAuth = async (req, res) => {
    try {

        return res.json({ success: true});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//logput //api/seller/logout
export const sellerLogout = async (req, res) => { 
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success:true,message:"Logged Out"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Dashboard stats api/seller/dashboard-stats
export const getDashboardStats = async (req, res) => {
    try {
        // Đếm tổng users
        const totalUsers = await User.countDocuments();
        
        // Đếm tổng products (không bao gồm đã xóa)
        const totalProducts = await Product.countDocuments({ isDeleted: { $ne: true } });
        
        // Tính tổng doanh thu từ các đơn hàng đã thanh toán
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    $or: [
                        { paymentType: "COD" },
                        { isPaid: true }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);
        
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        const totalOrders = revenueResult.length > 0 ? revenueResult[0].totalOrders : 0;
        
        // Đếm tổng coupons
        const totalCoupons = await Coupon.countDocuments();
        
        const stats = {
            totalUsers,
            totalProducts,
            totalRevenue,
            totalOrders,
            totalCoupons
        };
        
        res.json({ success: true, stats });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

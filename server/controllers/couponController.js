import Coupon from '../models/Coupon.js';

// Tạo mã giảm giá
export const createCoupon = async (req, res) => {
    try {
        const { code, discount, minAmount, maxDiscount, expiryDate, usageLimit } = req.body;
        
        const coupon = new Coupon({
            code: code.toUpperCase(),
            discount,
            minAmount,
            maxDiscount,
            expiryDate,
            usageLimit
        });

        await coupon.save();
        res.json({ success: true, message: "Mã giảm giá đã được tạo thành công" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Lấy danh sách mã giảm giá
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Kiểm tra và áp dụng mã giảm giá
export const applyCoupon = async (req, res) => {
    try {
        const { code, amount } = req.body;
        
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            expiryDate: { $gt: new Date() }
        });

        if (!coupon) {
            return res.json({ success: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.json({ success: false, message: "Mã giảm giá đã hết lượt sử dụng" });
        }

        if (amount < coupon.minAmount) {
            return res.json({ success: false, message: `Đơn hàng tối thiểu ${coupon.minAmount}đ để sử dụng mã này` });
        }

        let discountAmount = (amount * coupon.discount) / 100;
        if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }

        res.json({ 
            success: true, 
            discount: discountAmount,
            coupon: {
                code: coupon.code,
                discount: coupon.discount,
                discountAmount
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Sử dụng mã giảm giá (tăng usedCount)
export const useCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        
        await Coupon.findOneAndUpdate(
            { code: code.toUpperCase() },
            { $inc: { usedCount: 1 } }
        );

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
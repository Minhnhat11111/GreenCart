import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true }, // phần trăm giảm giá
    minAmount: { type: Number, default: 0 }, // số tiền tối thiểu để áp dụng
    maxDiscount: { type: Number, default: 0 }, // số tiền giảm tối đa
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 1 }, // số lần sử dụng tối đa
    usedCount: { type: Number, default: 0 }
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const CouponList = () => {
    const { axios, formatCurrency } = useAppContext();
    const [coupons, setCoupons] = useState([]);

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get('/api/coupon/list');
            if (data.success) {
                setCoupons(data.coupons);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Danh sách mã giảm giá</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Mã</th>
                            <th className="border border-gray-300 p-2">Giảm (%)</th>
                            <th className="border border-gray-300 p-2">Đơn tối thiểu</th>
                            <th className="border border-gray-300 p-2">Giảm tối đa</th>
                            <th className="border border-gray-300 p-2">Hết hạn</th>
                            <th className="border border-gray-300 p-2">Đã dùng/Tối đa</th>
                            <th className="border border-gray-300 p-2">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td className="border border-gray-300 p-2 font-mono">{coupon.code}</td>
                                <td className="border border-gray-300 p-2">{coupon.discount}%</td>
                                <td className="border border-gray-300 p-2">{formatCurrency(coupon.minAmount)}</td>
                                <td className="border border-gray-300 p-2">{formatCurrency(coupon.maxDiscount)}</td>
                                <td className="border border-gray-300 p-2">
                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {coupon.usedCount}/{coupon.usageLimit}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        coupon.isActive && new Date(coupon.expiryDate) > new Date()
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {coupon.isActive && new Date(coupon.expiryDate) > new Date()
                                            ? 'Hoạt động'
                                            : 'Hết hạn'
                                        }
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CouponList;

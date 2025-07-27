import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CreateCoupon = () => {
    const { axios } = useAppContext();
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        minAmount: '',
        maxDiscount: '',
        expiryDate: '',
        usageLimit: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/coupon/create', formData);
            if (data.success) {
                toast.success(data.message);
                setFormData({
                    code: '',
                    discount: '',
                    minAmount: '',
                    maxDiscount: '',
                    expiryDate: '',
                    usageLimit: ''
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Tạo mã giảm giá</h2>
            
            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Mã giảm giá</label>
                    <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="VD: SALE20"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Phần trăm giảm (%)</label>
                    <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="VD: 20"
                        min="1"
                        max="100"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Đơn hàng tối thiểu ($)</label>
                    <input
                        type="number"
                        value={formData.minAmount}
                        onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="VD: 50"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Giảm tối đa ($)</label>
                    <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="VD: 100"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
                    <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Số lần sử dụng tối đa</label>
                    <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="VD: 100"
                        min="1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dull transition"
                >
                    Tạo mã giảm giá
                </button>
            </form>
        </div>
    );
};

export default CreateCoupon;
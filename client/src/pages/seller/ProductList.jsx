import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const ProductList = () => {
    const { products, currency, axios, fetchProducts } = useAppContext(); 
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        category: '',
        price: '',
        offerPrice: ''
    });

    const deleteProduct = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const { data } = await axios.delete(`/api/product/delete/${id}`);
                if (data.success) {
                    fetchProducts();
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const startEdit = (product) => {
        setEditingProduct(product._id);
        setEditForm({
            name: product.name,
            category: product.category,
            price: product.price,
            offerPrice: product.offerPrice
        });
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setEditForm({
            name: '',
            category: '',
            price: '',
            offerPrice: ''
        });
    };

    const saveEdit = async (id) => {
        try {
            const { data } = await axios.put(`/api/product/update/${id}`, editForm);
            if (data.success) {
                fetchProducts();
                setEditingProduct(null);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">Tất cả sản phẩm</h2>
                <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 font-semibold w-1/3">Sản phẩm</th>
                                <th className="px-4 py-3 font-semibold w-1/6">Danh mục</th>
                                <th className="px-4 py-3 font-semibold w-1/6">Giá gốc</th>
                                <th className="px-4 py-3 font-semibold w-1/6">Giá bán</th>
                                <th className="px-4 py-3 font-semibold w-1/6 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {products.map((product) => (
                                <tr key={product._id} className="border-t border-gray-500/20 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="border border-gray-300 rounded overflow-hidden flex-shrink-0">
                                                <img src={product.image[0]} alt="Product" className="w-16 h-16 object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                {editingProduct === product._id ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                        className="w-full p-1 border border-gray-300 rounded text-sm"
                                                    />
                                                ) : (
                                                    <span className="font-medium text-gray-900 block truncate">
                                                        {product.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingProduct === product._id ? (
                                            <input
                                                type="text"
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                                className="w-full p-1 border border-gray-300 rounded text-sm"
                                            />
                                        ) : (
                                            product.category
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {editingProduct === product._id ? (
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                                className="w-full p-1 border border-gray-300 rounded text-sm"
                                            />
                                        ) : (
                                            `${currency}${product.price}`
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-primary">
                                        {editingProduct === product._id ? (
                                            <input
                                                type="number"
                                                value={editForm.offerPrice}
                                                onChange={(e) => setEditForm({...editForm, offerPrice: e.target.value})}
                                                className="w-full p-1 border border-gray-300 rounded text-sm"
                                            />
                                        ) : (
                                            `${currency}${product.offerPrice}`
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center space-x-2">
                                            {editingProduct === product._id ? (
                                                <>
                                                    <button
                                                        onClick={() => saveEdit(product._id)}
                                                        className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition"
                                                    >
                                                        Hủy
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(product)}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product._id)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> 
                </div>
            </div>
        </div>
    )
}

export default ProductList

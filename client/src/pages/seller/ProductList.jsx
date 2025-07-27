import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const ProductList = () => {
    const { products, currency, axios, fetchProducts, formatCurrency } = useAppContext(); 
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        category: '',
        price: '',
        offerPrice: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    // Tính toán pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    const goToPage = (page) => {
        setCurrentPage(page);
        setEditingProduct(null); 
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setEditingProduct(null);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setEditingProduct(null);
        }
    };

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

    const toggleProductVisibility = async (id, currentStatus) => {
        try {
            const { data } = await axios.post('/api/product/stock', {
                id,
                inStock: !currentStatus
            });
            if (data.success) {
                fetchProducts();
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
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-lg font-medium">Tất cả sản phẩm</h2>
                    <div className="text-sm text-gray-600">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, products.length)} của {products.length} sản phẩm
                    </div>
                </div>
                
                <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="w-full overflow-hidden">
                        <thead className="text-gray-900 text-sm text-left bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 font-semibold w-1/4">Sản phẩm</th>
                                <th className="px-4 py-3 font-semibold w-1/6">Danh mục</th>
                                <th className="px-4 py-3 font-semibold w-1/6">Giá gốc</th>
                                <th className="px-4 py-3 font-semibold w-1/6">Giá bán</th>
                                <th className="px-4 py-3 font-semibold w-1/12 text-center">Trạng thái</th>
                                <th className="px-4 py-3 font-semibold w-1/6 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-500">
                            {currentProducts.map((product) => (
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
                                            formatCurrency(product.price)
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
                                            formatCurrency(product.offerPrice)
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => toggleProductVisibility(product._id, product.inStock)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                                    product.inStock 
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                {product.inStock ? 'Hiển thị' : 'Ẩn'}
                                            </button>
                                        </div>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-600">
                            Trang {currentPage} của {totalPages}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                ← Trước
                            </button>

                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Hiển thị trang đầu, cuối và các trang xung quanh trang hiện tại
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 2 && page <= currentPage + 2)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                                                    currentPage === page
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        page === currentPage - 3 ||
                                        page === currentPage + 3
                                    ) {
                                        return (
                                            <span key={page} className="px-2 py-2 text-gray-400">
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductList

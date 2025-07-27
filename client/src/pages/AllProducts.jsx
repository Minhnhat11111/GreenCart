import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 20
  
  useEffect(() => {
    let productsCopy = [...products];
    
    // Lọc theo search query
    if (searchQuery.length > 0) {
      productsCopy = productsCopy.filter(
        product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Lọc sản phẩm còn hàng
    productsCopy = productsCopy.filter(product => product.inStock);
    
    // Sắp xếp theo giá
    switch (sortBy) {
      case 'low-high':
        productsCopy.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case 'high-low':
        productsCopy.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      default:
        // Giữ thứ tự mặc định
        break;
    }
    
    setFilteredProducts(productsCopy);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  }, [products, searchQuery, sortBy])

  // Tính toán pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className='mt-16 flex flex-col px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
        <div className='flex flex-col items-start sm:items-end w-max mb-4 sm:mb-0'>
          <p className='text-2xl font-medium uppercase'>Sản phẩm</p>
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
        
        {/* Thanh lọc */}
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-600'>Sắp xếp theo:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value="default">Mặc định</option>
            <option value="low-high">Giá: Thấp đến Cao</option>
            <option value="high-low">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* Thông tin hiển thị */}
      <div className='flex justify-between items-center mb-4'>
        <div className='text-sm text-gray-600'>
          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} của {filteredProducts.length} sản phẩm
        </div>
        {totalPages > 1 && (
          <div className='text-sm text-gray-600'>
            Trang {currentPage} của {totalPages}
          </div>
        )}
      </div>

      {/* Grid sản phẩm */}
      {currentProducts.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 mt-6'>
          {currentProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center h-[60vh]'>
          <p className='text-2xl font-medium text-primary'>Không tìm thấy sản phẩm nào.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
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
  )
}

export default AllProducts

import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('default')
  
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
  }, [products, searchQuery, sortBy])

  return (
    <div className='mt-16 flex flex-col'>
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

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className='flex items-center justify-center h-[40vh]'>
          <p className='text-xl font-medium text-gray-500'>Không tìm thấy sản phẩm nào</p>
        </div>
      )}
    </div>
  )
}

export default AllProducts

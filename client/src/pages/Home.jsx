import React, { useState, useEffect } from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { useAppContext } from '../context/AppContext'

const Home = () => {
  const { products } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('default')
  
  useEffect(() => {
    let productsCopy = [...products];
    
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
  }, [products, sortBy])

  return (
    <div className='mt-10 '>
      <MainBanner />
      <Categories />
     {/* <BestSeller /> */}
      
      {/* Section sản phẩm với thanh lọc */}
      <div className='mt-16'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
          <div className='flex flex-col items-start sm:items-end w-max mb-4 sm:mb-0'>
            <p className='text-2xl md:text-3xl font-medium'>Tất cả sản phẩm</p>
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
          {filteredProducts.slice(0, 10).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
      
      <BottomBanner />
      <NewsLetter />
    </div>
  )
}

export default Home 

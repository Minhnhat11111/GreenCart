import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const { currency, axios } = useAppContext()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCoupons: 0,
    totalOrders: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/seller/dashboard-stats')
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tổng doanh thu',
      value: `${stats.totalRevenue.toLocaleString()}${currency}`,
      icon: '💰',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: '🛒',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Tổng coupon',
      value: stats.totalCoupons,
      icon: '🎫',
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50'
    }
  ]

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[60vh]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-2'>Tổng quan</h1>
  
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8'>
        {statCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow`}>
            <div className='flex items-center justify-between mb-4'>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {card.icon}
              </div>
            </div>
            <h3 className='text-2xl font-bold text-gray-800 mb-1'>
              {card.value}
            </h3>
            <p className='text-gray-600 text-sm font-medium'>
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className='bg-white rounded-xl border border-gray-100 p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Thao tác nhanh</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <button 
            onClick={() => window.location.href = '/seller/add-product'}
            className='flex flex-col items-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors'
          >
            <span className='text-2xl mb-2'>➕</span>
            <span className='text-sm font-medium text-gray-700'>Thêm sản phẩm</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/seller/orders'}
            className='flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors'
          >
            <span className='text-2xl mb-2'>📋</span>
            <span className='text-sm font-medium text-gray-700'>Xem đơn hàng</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/seller/create-coupon'}
            className='flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors'
          >
            <span className='text-2xl mb-2'>🎫</span>
            <span className='text-sm font-medium text-gray-700'>Tạo coupon</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/seller/product-list'}
            className='flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors'
          >
            <span className='text-2xl mb-2'>📦</span>
            <span className='text-sm font-medium text-gray-700'>Quản lý sản phẩm</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
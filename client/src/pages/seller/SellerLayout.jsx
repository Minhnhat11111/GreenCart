import { NavLink, Outlet } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const SellerLayout = () => {
  const { logout } = useAppContext()

  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='flex items-center py-2 px-[4vw] justify-between'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        <button onClick={logout} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
      </div>
      <hr />
      <div className='flex w-full'>
        <div className='w-[18%] min-h-screen border-r-2'>
          <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/seller">
              <img className='w-5 h-5' src={assets.add_icon} alt="" />
              <p className='hidden md:block'>Thêm sản phẩm</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/seller/product-list">
              <img className='w-5 h-5' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>Sản phẩm</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/seller/orders">
              <img className='w-5 h-5' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>Đơn hàng</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/seller/create-coupon">
              <img className='w-5 h-5' src={assets.add_icon} alt="" />
              <p className='hidden md:block'>Tạo coupon</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/seller/coupon-list">
              <img className='w-5 h-5' src={assets.order_icon} alt="" />
              <p className='hidden md:block'>Danh sách coupon</p>
            </NavLink>
          </div>
        </div>
        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default SellerLayout

import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext();
  const { t } = useSettings();

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if (data.success) {
        toast.success(data.message)
        setUser(null)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products")
    }
  }, [searchQuery])

  // tắt dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-12" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-10">
        <NavLink to="/" className="text-lg font-medium hover:text-primary transition">{t('home')}</NavLink>
        <NavLink to="/products" className="text-lg font-medium hover:text-primary transition">{t('products')}</NavLink>
        <NavLink to="/contact" className="text-lg font-medium hover:text-primary transition">{t('contact')}</NavLink>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-4 py-2 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder={t('searchPlaceholder')}
          />
          <img src={assets.search_icon} alt="search" className="w-5 h-5" />
        </div>

        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-7 opacity-80' />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[20px] h-[20px] rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </div>

        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-10 py-3 bg-primary hover:bg-primary-dull transition text-white rounded-full text-lg font-medium"
          >
            {t('login')}
          </button>
        ) : (
          <div className='relative dropdown-container'>
            <img 
              src={user?.avatar || assets.profile_icon} 
              alt='Profile' 
              className='w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-300'
              onClick={() => setShowDropdown(!showDropdown)}
              onError={(e) => {
                e.target.src = assets.profile_icon
              }}
            />
            {showDropdown && (
              <ul className='absolute top-12 right-0 bg-white shadow-lg border border-gray-200 py-2.5 w-36 rounded-md text-sm z-40'>
                <li onClick={() => {navigate("/profile"); setShowDropdown(false)}} className='p-2 pl-4 hover:bg-primary/10 cursor-pointer'>{t('profile')}</li>
                <li onClick={() => {navigate("/my-orders"); setShowDropdown(false)}} className='p-2 pl-4 hover:bg-primary/10 cursor-pointer'>{t('orders')}</li>
                <li onClick={() => {navigate("/settings"); setShowDropdown(false)}} className='p-2 pl-4 hover:bg-primary/10 cursor-pointer'>{t('settings')}</li>
                <li onClick={() => {logout(); setShowDropdown(false)}} className='p-2 pl-4 hover:bg-primary/10 cursor-pointer'>{t('logout')}</li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Menu Icon for Mobile */}
      <button onClick={() => setOpen(!open)} className="sm:hidden">
        <img src={assets.menu_icon} alt="menu" className="w-7 h-7" />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="sm:hidden absolute top-[80px] left-0 w-full bg-white shadow-md py-6 flex flex-col items-start gap-3 px-6 text-base z-50">
          <NavLink to="/" onClick={() => setOpen(false)}>{t('home')}</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>{t('products')}</NavLink>
          {user && (
            <>
              <NavLink to="/profile" onClick={() => setOpen(false)}>{t('profile')}</NavLink>
              <NavLink to="/my-orders" onClick={() => setOpen(false)}>{t('orders')}</NavLink>
              <NavLink to="/settings" onClick={() => setOpen(false)}>{t('settings')}</NavLink>
            </>
          )}
          <NavLink to="/contact" onClick={() => setOpen(false)}>{t('contact')}</NavLink>
          {!user ? (
            <button
              onClick={() => {
                setOpen(false)
                setShowUserLogin(true)
              }}
              className="px-8 py-3 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-base"
            >
             {t('login')}
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-8 py-3 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-base"
            >
              {t('logout')}
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar

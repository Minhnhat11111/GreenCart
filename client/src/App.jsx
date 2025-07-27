import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Route,Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './components/Login.jsx'
import Contact from './pages/Contact';
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer.jsx'
import { useAppContext } from './context/AppContext.jsx'
import AllProducts from './pages/AllProducts.jsx'
import ProductCategory from './pages/ProductCategory.jsx'
import ProductDetails from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import AddAddress from './pages/AddAddress.jsx'
import MyOrders from './pages/MyOrders.jsx'
import SellerLogin from './components/seller/SellerLogin.jsx'
import SellerLayout from './pages/seller/SellerLayout.jsx'
import ProductList from './pages/seller/ProductList.jsx'
import Orders from './pages/seller/Orders.jsx'
import AddProduct from './pages/seller/AddProduct.jsx'
import Loading from './components/Loading.jsx'
import Profile from './pages/Profile.jsx'
import CreateCoupon from './pages/seller/CreateCoupon.jsx'
import CouponList from './pages/seller/CouponList.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import Settings from './pages/Settings.jsx'
import Dashboard from './pages/seller/Dashboard.jsx'

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin,isSeller } = useAppContext();
  
  return (
    <SettingsProvider>
      <div className='text-default min-h-screen text-gray-700 bg-white'>
        {isSellerPath ? null : < Navbar />}
        {showUserLogin ? <Login/>:null}
        <Toaster />
        <div className={`${isSellerPath ? "" :"px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<AllProducts />} />
            <Route path='/product/:category' element={<ProductCategory/>} />
            <Route path='/products/:category/:id' element={<ProductDetails />} />

            <Route path="/contact" element={<Contact />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/add-address' element={<AddAddress />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/loader' element={<Loading />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/seller' element={isSeller ? < SellerLayout /> : <SellerLogin />}>
              <Route index element={isSeller ? <Dashboard /> : null} />
              <Route path='add-product' element={<AddProduct />} />
              <Route path='product-list' element={<ProductList />} />
              <Route path='orders' element={<Orders/>} />
              <Route path='create-coupon' element={<CreateCoupon />} />
              <Route path='coupon-list' element={<CouponList />} />
            </Route>
          </Routes>
        </div>
         {!isSellerPath && <Footer/> }
      </div>
    </SettingsProvider>
  )
}

export default App



import React, { useEffect, useState } from 'react'
  import { useAppContext } from '../context/AppContext.jsx'
  

  const MyOrders = () => {
      const [myOrder, setMyOrders] = useState([])
      const {currency,axios,user} = useAppContext();
      const fetchMyOrders = async () => {
          try {
            const { data } = await axios.get('/api/orders/user')

            console.log(data);
            if (data.success) {
              setMyOrders(data.order)
            }
          } catch (error) {
            console.log(error);
          }
      }

    useEffect(() => {
      if (user) {
          fetchMyOrders()
        }
      },[user])

    return (
        <div className='mt-16 pb-16 '>
            <div className='flex flex-col items-end w-max md-8'>
                <p className='text-2xl font-medium uppercase' >Đơn hàng của tôi</p>
                <div className='w-16 h-0.5 bg-primary rounded-full mb-12'></div>
            </div>
            {myOrder.map((order, index) => (
  <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-5xl'>
    <div className='flex flex-col md:flex-row md:justify-between md:items-center text-gray-400 md:font-medium gap-2 mb-2'>
      <span>Mã đơn hàng: <span className="text-gray-700 font-semibold">{order._id}</span></span>
      <span>Phương thức thanh toán: <span className="text-gray-700 font-semibold">{order.paymentType}</span></span>
      <span>Ngày đặt: <span className="text-gray-700 font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span></span>
    </div>
    <div className="divide-y divide-gray-200">
      {order.items.map((item, idx) => (
        <div
          key={idx}
          className="relative bg-white text-gray-500/70 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl"
        >
          <div className='flex items-center mb-4 md:mb-0'>
            <div className='bg-primary/10 p-4 rounded-lg'>
              <img src={item.product?.image?.[0] || '/placeholder-image.png'} alt='' className='w-16 h-16' />
            </div>
            <div className='ml-4'>
              <h2 className='text-xl font-medium text-gray-800'>{item.product?.name || "Sản phẩm đã bị xóa"}</h2>
              <p>Danh mục: {item.product?.category || "N/A"}</p>
            </div>
          </div>
          <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
            <p>Số lượng: {item.quantity || "1"}</p>
            <p>Trạng thái: {order.status}</p>
          </div>
        </div>
      ))}
    </div>
    {/* Tổng tiền - chỉ hiển thị 1 lần, nổi bật */}
    <div className="flex justify-end mt-4">
      <div className="bg-primary/10 px-6 py-3 rounded-lg">
        <span className="text-lg font-bold text-primary">Tổng tiền: {order.amount} {currency}</span>
      </div>
    </div>
  </div>
))}
      </div>
    )
  }

  export default MyOrders

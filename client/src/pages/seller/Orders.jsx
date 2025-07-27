import React, { useEffect, useState  } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
    const { currency,axios } = useAppContext()
    const [orders, setOrders] = useState([])
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders/seller');
            if (data.success) {
                setOrders(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };
    useEffect(() => {
        fetchOrders();
    })
    return (
      <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
        <div className="md:p-10 p-4 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Đơn hàng</h2>
          
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {/* Header đơn hàng */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img className="w-8 h-8" src={assets.box_icon} alt="boxIcon" />
                  <span className="text-lg font-medium text-gray-800">Đơn hàng #{order._id.slice(-6)}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{order.amount} {currency}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Nội dung đơn hàng */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sản phẩm */}
                <div className="lg:col-span-1">
                  <h4 className="font-medium text-gray-700 mb-3">Sản phẩm</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate">
                            {item.product?.name || "Sản phẩm đã bị xóa"}
                          </p>
                          <span className="text-primary text-sm font-medium">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="lg:col-span-1">
                  <h4 className="font-medium text-gray-700 mb-3">Địa chỉ giao hàng</h4>
                  <div className="space-y-1 text-gray-600">
                    <p className="font-medium text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="truncate" title={`${order.address.street}, ${order.address.city}`}>
                      {order.address.street.length > 25 
                        ? `${order.address.street.substring(0, 25)}...` 
                        : order.address.street}
                    </p>
                    <p className="truncate" title={`${order.address.city}, ${order.address.state}`}>
                      {order.address.city}, {order.address.state}
                    </p>
                    <p>{order.address.zipcode}, {order.address.country}</p>
                    <p className="font-medium text-gray-700">📞 {order.address.phone}</p>
                  </div>
                </div>

                {/* Thông tin thanh toán */}
                <div className="lg:col-span-1">
                  <h4 className="font-medium text-gray-700 mb-3">Thông tin thanh toán</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium">{order.paymentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
}

export default Orders

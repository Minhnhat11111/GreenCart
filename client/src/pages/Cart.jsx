import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { assets } from "../assets/assets";
import toast from "react-hot-toast";


const Cart = () => {
    const { products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios,user,setCartItems, formatCurrency } = useAppContext();
    const [cartArray, setCartArray] = useState([])
    const [addresses,setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setselectedAddress] = useState(null)
    const [paymentOption, setPaymenOption] = useState("COD")
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key)
            product.quantity = cartItems[key]
            tempArray.push(product)
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses)
                if (data.addresses.length > 0) {
                    setselectedAddress(data.addresses[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("vui lòng chọn địa chỉ")
            }
            
            const orderData = {
                userId: user._id,
                items: cartArray.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                })),
                address: selectedAddress._id,
                couponCode: appliedCoupon?.code || null,
                discount: discount || 0
            };

            if (paymentOption === "COD") {
                const { data } = await axios.post('/api/orders/cod', orderData);
                if (data.success) {
                    toast.success(data.message)
                    setCartItems({})
                    setAppliedCoupon(null);
                    setDiscount(0);
                    setCouponCode('');
                    navigate('/my-orders')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post('/api/orders/stripe', orderData);
                if (data.success) {
                    window.location.replace(data.url)
                } else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            return toast.error('Vui lòng nhập mã giảm giá');
        }

        try {
            const { data } = await axios.post('/api/coupon/apply', {
                code: couponCode,
                amount: getCartAmount()
            });

            if (data.success) {
                setAppliedCoupon(data.coupon);
                setDiscount(data.discount);
                toast.success(`Áp dụng mã thành công! Giảm $${data.discount}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponCode('');
        toast.success('Đã hủy mã giảm giá');
    };

    const deleteAddress = async (addressId) => {
        try {
            const { data } = await axios.delete(`/api/address/delete/${addressId}`);
            if (data.success) {
                toast.success(data.message);
                // Cập nhật lại danh sách địa chỉ
                const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
                setAddresses(updatedAddresses);
                
                // Nếu địa chỉ đang được chọn bị xóa, chọn địa chỉ đầu tiên còn lại
                if (selectedAddress && selectedAddress._id === addressId) {
                    setselectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0] : null);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa địa chỉ');
        }
    };

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart() 
        }
    }, [products, cartItems])
    
    useEffect(() => {
        if (user) {
            getUserAddress()
        }
    },[user])
    
    return products.length> 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Giỏ hàng của bạn <span className="text-sm text-primary">{getCartCount()}
                        món hàng
                    </span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Chi tiết sản phẩm</p>
                    <p className="text-center">Giá tiền</p>
                    <p className="text-center">Thao tác</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Trọng lượng: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Số lượng:</p>
                                        <input
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={cartItems[product._id]}
                                            onChange={(e) => {
                                                const newQty = parseInt(e.target.value) || 1;
                                                if (newQty >= 1 && newQty <= 99) {
                                                    updateCartItem(product._id, newQty);
                                                }
                                            }}
                                            className='outline-none border border-gray-300 rounded px-2 py-1 w-16 ml-2'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{formatCurrency(product.offerPrice * product.quantity)}</p>
                        <button onClick={()=> removeFromCart(product._id)} className="cursor-pointer mx-auto">
                          <img src={assets.remove_icon} alt="remove"  className="inline-block w-6 h-6"/>
                        </button>
                    </div>)
                )}

                <button onClick={() => { navigate("/products");scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                    Tiếp tục mua sắm
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Đơn hàng</h2>
                <hr className="border-gray-300 my-5" />
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Địa chỉ </p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {selectedAddress
                                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                                : "No address found"}
                        </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Thay đổi
                        </button>

                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-50 shadow-lg">
                                {addresses.map((address, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                                        <p
                                            onClick={() => {
                                                setselectedAddress(address);
                                                setShowAddress(false);
                                            }}
                                            className="text-gray-500 cursor-pointer flex-1 pr-2"
                                        >
                                            {address.street}, {address.city}, {address.state}, {address.country}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteAddress(address._id);
                                            }}
                                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                                <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    Thêm địa chỉ
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Phương thức thanh toán</p>

                    <select onChange={e => setPaymenOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Thanh toán khi nhận hàng</option>
                        <option value="Online">Chuyển khoản</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                {/* Thêm phần mã giảm giá */}
                <div className="mt-4 mb-4">
                    <h3 className="text-sm font-medium uppercase mb-3">Mã giảm giá</h3>
                    {!appliedCoupon ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Nhập mã giảm giá"
                                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                            />
                            <button
                                onClick={applyCoupon}
                                className="px-3 py-2 bg-primary text-white rounded hover:bg-primary-dull transition text-sm"
                            >
                                Áp dụng
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded border">
                            <div>
                                <p className="font-medium text-green-800 text-sm">Mã: {appliedCoupon.code}</p>
                                <p className="text-xs text-green-600">Giảm {appliedCoupon.discount}% (- {discount}{currency})</p>
                            </div>
                            <button
                                onClick={removeCoupon}
                                className="text-red-600 hover:text-red-800 transition text-sm"
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Giá</span><span>{formatCurrency(getCartAmount())}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Phí giao hàng</span><span className="text-green-600">Miễn phí</span>
                    </p>
                    
                    {/* <p className="flex justify-between">
                        <span>Thuế (2%)</span><span>{currency}{getCartAmount() *2/100}</span>
                    </p> */}

                    {appliedCoupon && (
                        <p className="flex justify-between text-green-600">
                            <span>Giảm giá ({appliedCoupon.code})</span><span>-{formatCurrency(discount)}</span>
                        </p>
                    )}
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Tổng tiền :</span><span>{formatCurrency(getCartAmount() - discount)}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition">
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : null
}
export default Cart

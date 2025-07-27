import {useState,useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetails = () => {

    const {products, navigate, currency, addToCart, axios, user, formatCurrency} = useAppContext()
    const {id} = useParams()

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });

    const product = products.find((item)=> item._id===id);

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/review/product/${id}`);
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/review/add', {
                productId: id,
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            
            if (data.success) {
                toast.success(data.message);
                setShowReviewForm(false);
                setReviewData({ rating: 5, comment: '' });
                fetchReviews(); // Refresh reviews
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (id) {
            fetchReviews();
        }
    }, [id]);

    useEffect(() => {
        if (products.length >0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item)=>product.category === item.category)
            setRelatedProducts(productsCopy.slice(0,5));
        }
    }, [product, products]);

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null)
    }, [product]);


    return product && (
        <div className="mt-12">
            <p>
                <Link to={"/"}>Trang chủ</Link> /
                <Link to={"/products"}> Sản phẩm</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-primary"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < Math.floor(product.rating || 0) ? assets.star_icon : assets.star_dull_icon } alt="" className='md:w-4 w-3.5'/>
                        ))}
                        <p className="text-base ml-2">({product.rating || 0}) ({product.reviewCount || 0} reviews)</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">Giá gốc : {formatCurrency(product.price)}</p>
                        <p className="text-2xl font-medium">Giá khuyến mãi : {formatCurrency(product.offerPrice)}</p>
                        <span className="text-gray-500/70">(đã bao gồm thuế)</span>
                    </div>

                    <p className="text-base font-medium mt-6">Mô tả</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button  onClick={()=> addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                           Thêm vào giỏ hàng
                        </button>
                        <button onClick={()=> { addToCart(product._id), navigate("/cart")}} className="w-full py-3.5 cursor-pointer font-medium bg-primary-dull text-white hover:bg-primary transition" >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-medium">Đánh giá</h3>
                    {user && (
                        <button 
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
                        >
                            Đánh giá
                        </button>
                    )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <form onSubmit={submitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex gap-1">
                                {Array(5).fill('').map((_, i) => (
                                    <img
                                        key={i}
                                        src={i < reviewData.rating ? assets.star_icon : assets.star_dull_icon}
                                        alt=""
                                        className="w-6 h-6 cursor-pointer"
                                        onClick={() => setReviewData({...reviewData, rating: i + 1})}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Đánh giá</label>
                            <textarea
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                rows="4"
                                placeholder="Write your review..."
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dull transition">
                                Đánh giá
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowReviewForm(false)}
                                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <img 
                                    src={review.userId.avatar || assets.profile_icon} 
                                    alt="" 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium">{review.userId.name}</p>
                                    <div className="flex items-center gap-1">
                                        {Array(5).fill('').map((_, i) => (
                                            <img
                                                key={i}
                                                src={i < review.rating ? assets.star_icon : assets.star_dull_icon}
                                                alt=""
                                                className="w-4 h-4"
                                            />
                                        ))}
                                        <span className="text-sm text-gray-500 ml-2">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* realated products */}
            <div className='flex flex-col items-center mt-20'>
                <div className='flex flex-col items-center w-max'>
                    <p className='text-3xl font-medium'>Sản phẩm liên quan</p>
                    <div className='w-20 h-0.5 bg-primary rounded-full mt-2'>
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full'>
                        {relatedProducts.filter((product) => product.inStock).map((product, index) => (
                            <ProductCard key = {index} product={product} />
                        ))}
                    </div>
                    <button onClick={() => { navigate('/products'); scrollTo(0,0) }} className='mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition'> Xem thêm</button>
                </div>
            </div>
        </div>
    );
};
export default ProductDetails

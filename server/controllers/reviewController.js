import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Add review
export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.userId;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
            return res.json({ success: false, message: "Bạn đã đánh giá sản phẩm này rồi !" });
        }

        // Create review
        await Review.create({ userId, productId, rating, comment });

        // Update product rating
        await updateProductRating(productId);

        res.json({ success: true, message: "Thêm đánh giá thành công !" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).populate("userId").sort({ createdAt: -1 });
        res.json({success: true, reviews})
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update product rating
const updateProductRating = async (productId) => {
    try {
        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length
        });
    } catch (error) {
        console.log('Error updating product rating:', error);
    }
};



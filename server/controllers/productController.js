import { v2 as cloudianry } from 'cloudinary'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

// add product api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)
        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudianry.uploader.upload(item.path, { resource_type: 'image' })
                 return result.secure_url
            })
        )
        await Product.create({...productData,image: imagesUrl})
        res.json({success: true, message: "Đã thêm sản phẩm"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false , message: error.message})
    }
}


// add product api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({success:true, products})
    } catch (error) {
         console.log(error.message);
        res.json({success:false , message: error.message})
    }
}

// get  product api/product/id
export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById({})
        res.json({success: true , product})
    } catch (error) {
        console.log(error.message);
        res.json({success:false , message: error.message}) 
    }
}

// change product api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, { inStock })
        res.json({success: true, message: inStock ? 'Sản phẩm đã được hiển thị' : 'Sản phẩm đã được ẩn'}) 
    } catch (error) {
         console.log(error.message);
        res.json({success:false , message: error.message}) 
    }
}

// sửa
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, offerPrice } = req.body;
        
        await Product.findByIdAndUpdate(id, {
            name,
            category,
            price: Number(price),
            offerPrice: Number(offerPrice)
        });
        
        res.json({success: true, message: "Cập nhật thành công"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Thay vì xóa hoàn toàn, đánh dấu là deleted
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra xem sản phẩm có trong đơn hàng nào không
        const ordersWithProduct = await Order.find({ "items.product": id });
        
        if (ordersWithProduct.length > 0) {
            // Nếu có đơn hàng, chỉ đánh dấu là deleted
            await Product.findByIdAndUpdate(id, { 
                isDeleted: true,
                inStock: false 
            });
            res.json({success: true, message: "Sản phẩm đã được ẩn khỏi cửa hàng"});
        } else {
            // Nếu không có đơn hàng nào, có thể xóa hoàn toàn
            await Product.findByIdAndDelete(id);
            res.json({success: true, message: "Xóa sản phẩm thành công"});
        }
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

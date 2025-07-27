import { response } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from '../models/User.js'
import axios from 'axios';
import Coupon from '../models/Coupon.js';

// place order cod api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address, couponCode, discount } = req.body;
        if (!address || items.length === 0) {
            return res.json({success : false , message : "invalid data"})
        }
        let amount = await items.reduce(async(acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)
      //  amount += Math.floor(amount * 0.02);
        
        // Trừ discount nếu có
        if (discount && discount > 0) {
            amount -= discount;
        }

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            couponCode: couponCode || null,
            discount: discount || 0
        });

        // Cập nhật số lần sử dụng coupon trực tiếp
        if (couponCode) {
            await Coupon.findOneAndUpdate(
                { code: couponCode.toUpperCase() },
                { $inc: { usedCount: 1 } }
            );
        }

        return res.json({success:true,message : " Đặt hàng thành công"})
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address, couponCode, discount } = req.body;

        const origin = req.headers.origin || "https://localhost:4000" || 'https://green-cart-dusky-five.vercel.app';

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Dữ liệu không hợp lệ." });
        }

        let productData = [];
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({ success: false, message: "Sản phẩm không tồn tại." });
            }

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });

            amount += product.offerPrice * item.quantity;
        }

        // Cộng thêm phí xử lý 2%
    //    amount += Math.floor(amount * 0.02);
        
        // Trừ discount nếu có
        if (discount && discount > 0) {
            amount -= discount;
        }

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            couponCode: couponCode || null,
            discount: discount || 0
        });

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = productData.map(item => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
               unit_amount: Math.round(item.price  * 100), // cộng 2% phí xử lý
            },
            quantity: item.quantity,
        }));

        // Thêm discount vào metadata
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
                couponCode: couponCode || '',
                discount: discount || 0
            },
        });

        return res.json({ success: true, url: session.url });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const stripeWebhooks = async (request,reponse) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event; 
    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`);
    }
    switch (key.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId, userId } = session.data[0].metadata;
            await Order.findByIdAndUpdate(orderId, { isPaid: true })
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            break;
        }
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            })
            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            }
        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({received: true})
}

export const getUserOrders = async (req, res) => {
    try {
        const  userId  = req.userId;
        const order = await Order.find({ userId }).populate("items.product address").sort({ createdAt: -1 });
        res.json({success:true , order})
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//api/order/seller

export const getAllOrders = async (req, res) => {
    try {
        const order = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({success:true , order})
    } catch (error) {
        res, json({ success: false, message: error.message });
    }
}

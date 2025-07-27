import express from 'express';
import { createCoupon, getCoupons, applyCoupon, useCoupon } from '../controllers/couponController.js';
import sellerAuth from '../middlewares/authSeller.js';

const couponRouter = express.Router();

couponRouter.post('/create'/*, sellerAuth*/, createCoupon);
couponRouter.get('/list', /*sellerAuth*/ getCoupons);
couponRouter.post('/apply', applyCoupon);
couponRouter.post('/use', useCoupon);

export default couponRouter;
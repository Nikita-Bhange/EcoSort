import express from 'express';
import { addToCart, updateCart, getUserCart, deleteCartItem } from '../controllers/cartController.js';

const cartRoutes = express.Router();

cartRoutes.get('/:userId', getUserCart);
cartRoutes.post('/add/:pid', addToCart);
cartRoutes.put('/:cartId', updateCart);
cartRoutes.delete('/:cartId', deleteCartItem);
export default cartRoutes;


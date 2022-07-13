import { Router } from 'express';
import {
  getProducts,
  addProduct,
  getCart,
  delCart,
  sendOrder,
} from '../handlers/routers/user_views.js';

const router = Router();

// Gets products catalog
router.get('/prods', getProducts);

// Gets cart contents
router.get('/cart/:cartId', getCart);

// Adds / updates product in cart
router.get('/cart/:cartId/:prodId/:qty', addProduct);

// Deletes cart
router.get('/cart/delcart/:cartId', delCart);

router.get('/cart/order/:cartId', sendOrder);

export default router;

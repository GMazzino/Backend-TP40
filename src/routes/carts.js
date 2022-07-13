import { Router } from 'express';
import { carts } from '../dao/dao.js';
import { isAuth } from '../midwares/auth.js';

const router = Router();

// Creates empty cart
router.post('/', async (req, res) => {
  let ans = await carts.createCartId();
  res.status(ans.status).json(ans.content);
});

router.get('/', isAuth, async (req, res) => {
  let ans = await carts.getCartIdByUser(req.user.user);
  console.log(ans.content);
  res.status(200).json(ans.content);
});
// Adds/updates product to/in cart
router.post('/:id/productos', async (req, res) => {
  let ans = await carts.addProductToCart(
    req.params.id,
    req.body.productId,
    req.body.quantity
  );
  res.status(ans.status).json(ans.content);
});

// Gets cart products
router.get('/:id/productos', async (req, res) => {
  let ans = await carts.getCartProducts(req.params.id);
  res.status(ans.status).json(ans.content);
});

// Deletes cart product
router.delete('/:id/productos/:id_prod', async (req, res) => {
  let ans = await carts.delProductFromCart(req.params.id, req.params.id_prod);
  res.status(ans.status).json(ans.content);
});

// Deletes cart and products
router.delete('/:id', async (req, res) => {
  let ans = await carts.delCart(req.params.id);
  res.status(ans.status).json(ans.content);
});

export default router;

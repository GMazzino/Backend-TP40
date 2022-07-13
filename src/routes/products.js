import { Router } from 'express';
import { products, carts } from '../dao/dao.js';
import { cart } from '../dao/mongoDB_carts.js';
import { isAuth } from '../midwares/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const ans = await products.getProducts();
  res.status(ans.status).json(ans.content);
});

router.get('/:id', async (req, res) => {
  let ans = await products.getProductById(req.params.id);
  res.status(ans.status).json(ans.content);
});

router.post('/' /*, isAuth */, async (req, res) => {
  let ans = await products.addNewProduct(req.body);
  res.status(ans.status).json(ans.content);
});

router.put('/:id', isAuth, async (req, res) => {
  let ans = await products.updateProduct(req.params.id, req.body);
  res.status(ans.status).json(ans.content);
});

router.delete('/:id', isAuth, async (req, res) => {
  let ans = await products.delProductById(req.params.id);
  res.status(ans.status).json(ans.content);
});

export default router;

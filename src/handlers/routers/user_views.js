import { type } from 'os';
import { HOST } from '../../../config.js';
import logger from '../../utils/logger.js';
import sendMail from '../../utils/mailer.js';
import twilio from '../../utils/twilio.js';

export async function getProducts(req, res) {
  const { default: axios } = await import('axios');
  const { cart } = await import('../../dao/mongoDB_carts.js');
  const { data } = await axios.get(`${HOST}/api/productos`);
  const cartId = await cart.getCartIdByUser(req.user.user);
  res.render('./user/products.ejs', {
    name: req.user.name,
    avatar: req.user.avatar,
    products: data,
    cartId: cartId.content,
  });
}

async function getCartProducts(cartId) {
  const { default: axios } = await import('axios');
  const cartProducts = [];
  try {
    const { data } = await axios.get(`${HOST}/api/carrito/${cartId}/productos`);
    const { data: catalog } = await axios.get(`${HOST}/api/productos`);
    if (typeof data != 'string') {
      data.forEach((cp) => {
        catalog.forEach((e) => {
          if (cp.id == e._id) {
            cp.code = e.code;
            cp.name = e.name;
            cp.description = e.description;
            cp.price = e.price;
            cp.imgURL = e.imgURL;
            cartProducts.push(cp);
          }
        });
      });
    }
  } catch (err) {
    logger.error(`Module:handlers/routers/user_views.js Method: getCartProducts -> ${err}`);
  }
  return cartProducts;
}

export async function getCart(req, res) {
  const cartProducts = await getCartProducts(req.params.cartId);
  res.render('./user/cart.ejs', {
    name: req.user.name,
    avatar: req.user.avatar,
    cartId: req.params.cartId,
    products: cartProducts,
  });
}

export async function delCart(req, res) {
  const { default: axios } = await import('axios');
  await axios.delete(`${HOST}/api/carrito/${req.params.cartId}`);
  await getProducts(req, res);
}

export async function addProduct(req, res) {
  const { default: axios } = await import('axios');
  await axios.post(`${HOST}/api/carrito/${req.params.cartId}/productos`, {
    cartId: req.params.cartId,
    productId: req.params.prodId,
    quantity: req.params.qty,
  });
  res.send('Producto agregado al carrito de compras correctamente.');
}

export async function sendOrder(req, res) {
  const { TWILIO_WAP_ADM_NMBR } = await import('../../../config.js');
  const cartProducts = await getCartProducts(req.params.cartId);
  delete cartProducts.imgURL;
  cartProducts.name = req.user.name;
  cartProducts.user = req.user.user;
  sendMail(cartProducts, 'order');
  twilio.wapp(TWILIO_WAP_ADM_NMBR, cartProducts);
  twilio.sms(
    req.user.phoneNmbr,
    `Hola ${req.user.name}.\nTu pedido fue recibido correctamente y está siendo procesado.\nGracias por tu compra!`
  );
  const { default: axios } = await import('axios');
  await axios.delete(`${HOST}/api/carrito/${req.params.cartId}`);
  res.send(`Su pedido fue recibido correctamente y está siendo procesado.\nMuchas gracias por su compra.`);
}

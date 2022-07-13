import { Cart, products, carts } from "./mem_common.js";
import { v4 as uuidV4 } from "uuid";

export default class Carts {
  createCartId() {
    const cartId = uuidV4();
    carts.push(new Cart(cartId));
    return { status: 200, content: cartId };
  }

  delCart(cartId) {
    if (carts.findIndex((cart) => cart.id == cartId) != -1) {
      carts = carts.filter((cart) => cart.id != cartId);
      return {
        status: 200,
        content: { success: `Carrito con ID: ${cartId} borrado` },
      };
    } else {
      return { status: 200, content: { error: `Carrito no encontrado` } };
    }
  }

  addProductToCart(cartId, productId, quantity) {
    let selectedCartIndex = carts.findIndex((cart) => cart.id == cartId);
    if (selectedCartIndex != -1) {
      let selectedProductIndex = products.findIndex(
        (prod) => prod.id == productId
      );
      if (selectedProductIndex != -1) {
        let cartProductIndex = carts[selectedCartIndex].products.findIndex(
          (prod) => prod.id == productId
        );
        if (cartProductIndex == -1) {
          let newProduct = products[selectedProductIndex];
          newProduct.stock = quantity;
          carts[selectedCartIndex].products.push(newProduct);
          return {
            status: 200,
            content: {
              success: `Producto con ID ${productId} agregado al carrito con ID ${cartId}`,
            },
          };
        } else {
          carts[selectedCartIndex].products[cartProductIndex].stock = quantity;
          return {
            status: 200,
            content: {
              success: `Producto con ID ${productId} actualizado en el carrito con ID ${cartId}`,
            },
          };
        }
      } else {
        return {
          status: 200,
          content: { success: `Producto con ID ${productId} no encontrado` },
        };
      }
    } else {
      return {
        status: 200,
        content: { success: `Carrito con ID: ${cartId} no encontrado` },
      };
    }
  }

  delProductFromCart(cartId, productId) {
    let selectedCartIndex = carts.findIndex((cart) => cart.id == cartId);
    if (selectedCartIndex != -1) {
      let cartProductIndex = carts[selectedCartIndex].products.findIndex(
        (prod) => prod.id == productId
      );
      if (cartProductIndex != -1) {
        carts[selectedCartIndex].products = carts[
          selectedCartIndex
        ].products.filter((prod) => prod.id !== parseInt(productId));
        return {
          status: 200,
          content: {
            success: `Producto con ID ${productId} borrado del carrito con ID ${cartId}`,
          },
        };
      } else {
        return {
          status: 200,
          content: {
            success: `Producto con ID ${productId} no encontrado en el carrito con ID ${cartId}`,
          },
        };
      }
    } else {
      return {
        status: 200,
        content: { success: `Carrito con ID: ${cartId} no encontrado` },
      };
    }
  }

  getCartProducts(cartId) {
    let selectedCartIndex = carts.findIndex((cart) => cart.id == cartId);
    if (selectedCartIndex != -1) {
      return {
        status: 200,
        content: { success: carts[selectedCartIndex].products },
      };
    } else {
      return {
        status: 200,
        content: { success: `Carrito con ID: ${cartId} no encontrado` },
      };
    }
  }
}

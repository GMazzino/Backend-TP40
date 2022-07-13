import { mongoose, cartsModel, productsModel } from '../models/mongoDB_schemas.js';
import { mongoRemote } from '../../config.js';
import logger from '../utils/logger.js';

class Carts {
  async #dbConnection() {
    try {
      await mongoose.connect(mongoRemote.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', (err) => {
        logger.error(`Module: dao/mongoDB_carts.js Method: #dbConnection (1) -> ${err}`);
        throw Error(err.message);
      });
      return mongoose.connection;
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: #dbConnection (2) -> ${err}`);
      throw Error(err.message);
    }
  }

  async createCartId(user) {
    try {
      const db = await this.#dbConnection();
      let createdCartId = await new cartsModel({
        user: user,
        products: [],
      }).save();
      await db.close();
      return { status: 200, content: createdCartId._id };
    } catch (err) {
      logger.error(`Module: dao/mongoDB_carts.js Method: createCartId -> ${err}`);
      return {
        status: 500,
        content: `Server error: ${err.message}`,
      };
    }
  }

  async delCart(cartId) {
    if (mongoose.isValidObjectId(cartId)) {
      const db = await this.#dbConnection();
      try {
        let del = await cartsModel.findByIdAndDelete(cartId);
        if (del !== null) {
          return {
            status: 200,
            content: `Carrito con ID: ${cartId} borrado`,
          };
        } else {
          return {
            status: 200,
            content: `Carrito con ID: ${cartId} no encontrado`,
          };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_carts.js Method: delCart -> ${err}`);
        return {
          status: 500,
          content: `Server error: ${err.message}`,
        };
      }
    } else {
      return {
        status: 400,
        content: `Error en la peticion.`,
      };
    }
  }

  async getCartProducts(cartId) {
    if (mongoose.isValidObjectId(cartId)) {
      const db = await this.#dbConnection();
      try {
        let cart;
        if ((cart = await cartsModel.findById(cartId)) != null) {
          return {
            status: 200,
            content: cart.products,
          };
        } else {
          return {
            status: 200,
            content: `El carrito ${cartId} no existe`,
          };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_carts.js Method: getCartProducts -> ${err}`);
        return {
          status: 500,
          content: `Server error: ${err.message}`,
        };
      }
    } else {
      return { status: 400, content: `Error en la peticion.` };
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    if (mongoose.isValidObjectId(cartId) && mongoose.isValidObjectId(productId) && !isNaN(quantity)) {
      try {
        const db = await this.#dbConnection();
        let cart;
        let cartProducts;
        if ((cart = await cartsModel.findById(cartId)) != null) {
          let product = await productsModel.findById(productId);
          if (product != null) {
            cartProducts = cart.products;
            if (cartProducts[0] == null || cartProducts[0] == undefined) {
              // Empty cart
              cartProducts = [{ id: productId, quantity: quantity }];
            } else {
              let productIndex = cartProducts.findIndex((prod) => prod.id == productId);
              if (productIndex == -1) {
                //New cart product
                cartProducts.push({
                  id: productId,
                  quantity: parseInt(quantity),
                });
              } else {
                //Existing cart product
                cartProducts[productIndex].quantity = parseInt(quantity);
              }
            }
          } else {
            return {
              status: 200,
              content: `Producto no encontrado`,
            };
          }
        } else {
          return {
            status: 200,
            content: `El carrito ${cartId} no existe`,
          };
        }
        let result = await cartsModel.findOneAndUpdate({ _id: cartId }, { products: cartProducts });
        if (result != null) {
          return {
            status: 200,
            content: `Producto con ID ${productId} agregado/actualizado en el carrito con ID ${cartId}`,
          };
        } else {
          return {
            status: 500,
            content: `No se pudo guardar el producto.`,
          };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_carts.js Method: addProductToCart -> ${err}`);
        return { status: 500, content: `Server error: ${err.message}` };
      }
    } else {
      return {
        status: 200,
        content: `Error en la peticion.`,
      };
    }
  }

  async delProductFromCart(cartId, productId) {
    if (mongoose.isValidObjectId(cartId) && mongoose.isValidObjectId(productId)) {
      const db = await this.#dbConnection();
      let cart;
      try {
        if ((cart = await cartsModel.findById(cartId)) != null) {
          let cartProducts = cart.products;
          if (cart.products[0] !== undefined) {
            cartProducts = cartProducts.filter((prod) => prod.id !== productId);
          } else {
            await db.close();
            return { status: 200, content: `El carrito esta vacio` };
          }
          let result = await cartsModel.findOneAndUpdate({ _id: cartId }, { products: cartProducts });
          await db.close();
          if (result != null) {
            return {
              status: 200,
              content: `Producto con ID ${productId} borrado del carrito con ID ${cartId}`,
            };
          } else {
            return {
              status: 500,
              content: `No se pudo borrar el producto.`,
            };
          }
        } else {
          return {
            status: 200,
            content: `El carrito con ID ${cartId} no existe`,
          };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_carts.js Method: delProductFromCart -> ${err}`);
        return {
          status: 500,
          content: `Server error: ${err.message}`,
        };
      }
    } else {
      return {
        status: 400,
        content: { error: `Error en la peticion.` },
      };
    }
  }

  async getCartIdByUser(user) {
    const db = await this.#dbConnection();
    let cartId = await cartsModel.findOne({ user: user }, '_id');
    if (!cartId) {
      cartId = (await this.createCartId(user)).content;
    }
    await db.close();
    return { status: 200, content: cartId._id };
  }
}

export const cart = new Carts();

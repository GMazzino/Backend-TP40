import { mongoose, productsModel } from '../models/mongoDB_schemas.js';
import { mongoRemote } from '../../config.js';
import logger from '../utils/logger.js';

class Products {
  async #dbConnection() {
    try {
      await mongoose.connect(mongoRemote.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      mongoose.connection.on('error', (err) => {
        logger.error(`Module: dao/mongoDB_products.js Method: #dbConnection (1) -> ${err}`);
        throw Error(err.message);
      });
      return mongoose.connection;
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: #dbConnection (2) -> ${err}`);
      throw Error(err.message);
    }
  }

  async getProducts() {
    const db = await this.#dbConnection();
    try {
      let products = await productsModel.find({});
      await db.close();
      return { status: 200, content: products };
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: getProducts - ${err}`);
      return {
        status: 500,
        content: `Server error: ${err.message}`,
      };
    }
  }

  async getProductById(idProduct) {
    if (mongoose.isValidObjectId(idProduct)) {
      const db = await this.#dbConnection();
      try {
        const selectedProduct = await productsModel.find({ _id: idProduct });
        if (selectedProduct.length) {
          return { status: 200, content: selectedProduct[0] };
        } else {
          return {
            status: 200,
            content: `Producto no encontrado`,
          };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_products.js Method: getProductsById -> ${err}`);
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

  async delProductById(id) {
    if (mongoose.isValidObjectId(id)) {
      const db = await this.#dbConnection();
      try {
        let del = await productsModel.findByIdAndDelete(id);
        if (del !== null) {
          return {
            status: 200,
            content: `Producto con ID: ${id} borrado`,
          };
        } else {
          return { status: 200, content: `Producto no encontrado` };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_products.js Method: delProductById -> ${err}`);
        return {
          status: 500,
          content: `Server error: ${err.message}`,
        };
      }
    } else {
      return { status: 400, content: `Error en la petición` };
    }
  }

  async addNewProduct(product) {
    try {
      if (
        product.code != undefined &&
        product.code != '' &&
        product.name != undefined &&
        product.name != '' &&
        product.description != undefined &&
        product.description != '' &&
        product.price != undefined &&
        !isNaN(parseFloat(product.price)) &&
        product.imgURL != undefined &&
        product.imgURL != '' &&
        product.stock != undefined &&
        !isNaN(parseInt(product.stock))
      ) {
        const db = await this.#dbConnection();
        let newProduct = product;
        delete newProduct.isAdmin;
        let createdProduct = await new productsModel(newProduct).save();
        return { status: 200, content: createdProduct };
      } else {
        return {
          status: 400,
          content: `Error en la petición del producto a agregar`,
        };
      }
    } catch (err) {
      logger.error(`Module: dao/mongoDB_products.js Method: addNewPeoduct -> ${err}`);
      return {
        status: 500,
        content: { error: `Server error: ${err.message}` },
      };
    }
  }

  async updateProduct(id, product) {
    if (
      mongoose.isValidObjectId(id) &&
      product.code != undefined &&
      product.code != '' &&
      product.dateTime != undefined &&
      product.dateTime != '' &&
      product.name != undefined &&
      product.name != '' &&
      product.description != undefined &&
      product.description != '' &&
      product.price != undefined &&
      !isNaN(parseFloat(product.price)) &&
      product.imgURL != undefined &&
      product.imgURL != '' &&
      product.stock != undefined &&
      !isNaN(parseInt(product.stock))
    ) {
      try {
        const db = await this.#dbConnection();
        let newProduct = product;
        delete newProduct.isAdmin;
        let result = await productsModel.updateOne({ _id: id }, newProduct);
        if (result.modifiedCount === 1) {
          return { status: 200, content: `Producto actualizado` };
        } else {
          return { status: 200, content: `Producto no encontrado` };
        }
      } catch (err) {
        logger.error(`Module: dao/mongoDB_products.js Method: updateProduct -> ${err}`);
        return {
          status: 500,
          content: `Server error: ${err.message}`,
        };
      }
    } else {
      return { status: 400, content: `Error en la petición.` };
    }
  }
}

export const products = new Products();

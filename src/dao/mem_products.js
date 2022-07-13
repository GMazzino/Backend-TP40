import { Product, products } from "./mem_common.js";

export default class Products {
  static #maxId = 0;

  getProducts() {
    if (products.length !== 0) {
      return { status: 200, content: products };
    } else {
      return { status: 200, content: { error: `No hay productos a mostrar` } };
    }
  }

  getProductById(id) {
    if (!isNaN(parseInt(id))) {
      const selectedProduct = products.find(
        (product) => product.id === parseInt(id)
      );
      return selectedProduct != undefined
        ? { status: 200, content: selectedProduct }
        : { status: 200, content: { error: `Producto no encontrado` } };
    } else {
      return { status: 400, content: { error: `Error en la petición` } };
    }
  }

  delProductById(id) {
    if (!isNaN(parseInt(id))) {
      if (products.findIndex((prod) => prod.id === parseInt(id)) != -1) {
        products = products.filter((prod) => prod.id !== parseInt(id));
        return {
          status: 200,
          content: { success: `Producto con ID: ${id} borrado` },
        };
      } else {
        return { status: 200, content: { error: `Producto no encontrado` } };
      }
    } else {
      return { status: 400, content: { error: `Error en la petición` } };
    }
  }

  addNewProduct(product) {
    if (
      product.code != undefined &&
      product.code != "" &&
      product.dateTime != undefined &&
      product.dateTime != "" &&
      product.name != undefined &&
      product.name != "" &&
      product.description != undefined &&
      product.description != "" &&
      product.price != undefined &&
      !isNaN(parseFloat(product.price)) &&
      product.imgURL != undefined &&
      product.imgURL != "" &&
      product.stock != undefined &&
      !isNaN(parseInt(product.stock))
    ) {
      Products.#maxId = products.reduce(
        (max, next) => Math.max(max, parseInt(next.id)),
        Products.#maxId
      );
      const newProduct = new Product(product, ++Products.#maxId);
      products.push(newProduct);
      return { status: 200, content: newProduct };
    } else {
      return { status: 400, content: { error: `Error en la petición` } };
    }
  }

  updateProduct(id, product) {
    if (
      product.code != undefined &&
      product.code != "" &&
      product.dateTime != undefined &&
      product.dateTime != "" &&
      product.name != undefined &&
      product.name != "" &&
      product.description != undefined &&
      product.description != "" &&
      product.price != undefined &&
      !isNaN(product.price) &&
      product.imgURL != undefined &&
      product.imgURL != "" &&
      product.stock != undefined &&
      !isNaN(product.stock)
    ) {
      let index = products.findIndex((prod) => prod.id === parseInt(id));
      if (index !== -1) {
        products[index].code = product.code;
        products[index].dateTime = product.dateTime;
        products[index].name = product.name;
        products[index].description = product.description;
        products[index].price = parseFloat(product.price);
        products[index].imgURL = product.imgURL;
        products[index].stock = parseInt(product.stock);
        return { status: 200, content: { success: `Producto actualizado` } };
      } else {
        return { status: 200, content: { error: `Producto no encontrado` } };
      }
    } else {
      return { status: 400, content: { error: `Error en la petición.` } };
    }
  }
}

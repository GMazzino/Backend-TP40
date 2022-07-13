class Product {
  constructor(product, id) {
    this.id = id;
    this.code = product.code;
    this.dateTime = product.dateTime;
    this.name = product.name;
    this.description = product.description;
    this.price = parseFloat(product.price);
    this.imgURL = product.imgURL;
    this.stock = parseInt(product.stock);
  }
}

class Cart {
  constructor(cartId, product) {
    this.id = cartId;
    if (product != undefined) {
      this.prducts = this.products.push(new Product(product, product.id));
    } else {
      this.products = [];
    }
  }
}

let carts = [];

// Array con productos de ejemplo
let products = [
  {
    id: 1,
    code: "Codigo1",
    dateTime: "01/01/2022 01:00:00",
    name: "Producto 1",
    description: "description Producto 1",
    price: 100,
    imgURL: "https://via.placeholder.com/100",
    stock: 10,
  },
  {
    id: 2,
    code: "Codigo2",
    dateTime: "02/01/2022 02:00:00",
    name: "Producto 2",
    description: "description Producto 2",
    price: 200,
    imgURL: "https://via.placeholder.com/100",
    stock: 20,
  },
  {
    id: 3,
    code: "Codigo3",
    dateTime: "03/01/2022 03:00:00",
    name: "Producto 3",
    description: "description Producto 3",
    price: 300,
    imgURL: "https://via.placeholder.com/100",
    stock: 30,
  },
];

export { Product, Cart, products, carts };

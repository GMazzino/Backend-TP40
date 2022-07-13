import mongoose from 'mongoose';

//-----------------------------------------------------------------------------
// COLLECTIONS
//-----------------------------------------------------------------------------
const usersCollection = 'users';
const productsCollection = 'products';
const cartsCollection = 'carts';

//-----------------------------------------------------------------------------
// SCHEMAS
//-----------------------------------------------------------------------------
const usersSchema = new mongoose.Schema(
  {
    user: { type: String, maxLength: 50, required: true }, //email
    pwdHash: { type: String, maxLength: 60, required: true },
    name: { type: String, maxlength: 50, required: true },
    age: { type: Number, required: true },
    address: { type: String, maxlength: 50, required: true },
    phoneNmbr: { type: String, maxlength: 14, required: true },
    avatar: { type: String, maxlength: 55 },
  },
  { versionKey: false }
);

const productsSchema = new mongoose.Schema(
  {
    code: { type: String, maxLength: 25, required: true },
    name: { type: String, maxLength: 50, required: true },
    description: { type: String, maxLength: 100, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    datetime: { type: Date, default: Date.now() },
    imgURL: { type: String, maxLength: 200, required: true },
  },
  { versionKey: false }
);

const cartsSchema = new mongoose.Schema(
  {
    user: { type: String, maxLength: 50, required: true },
    products: { type: Object },
  },
  { versionKey: false }
);

//-----------------------------------------------------------------------------
// MODELS
//-----------------------------------------------------------------------------

const userModel = mongoose.model(usersCollection, usersSchema);
const productsModel = mongoose.model(productsCollection, productsSchema);
const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export { mongoose, userModel, productsModel, cartsModel };

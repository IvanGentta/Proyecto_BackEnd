import { Schema } from "mongoose";

const cartSchema = new Schema({
  ref: { type: String, required: true },
  products: { type: Array },
});

export { cartSchema };

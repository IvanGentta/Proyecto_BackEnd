import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    products: { type: Array, default: [] },
  },
  { versionKey: false }
);

const cartModel = mongoose.model("carts", cartSchema);

export { cartModel };

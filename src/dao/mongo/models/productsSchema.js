import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    thumbnail: { type: Array, default: [] },
  },
  { versionKey: false }
);

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productSchema);

export { productModel };

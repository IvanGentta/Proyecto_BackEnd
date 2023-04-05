import { Schema } from "mongoose";

const messageSchema = new Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
});

export { messageSchema };

import mongoose from "mongoose";
import { productSchema } from "./models/productsSchema.js";
import { cartSchema } from "./models/cartSchema.js";
import { messageSchema } from "./models/messagesSchema.js";
import { ERRORS } from "../../mocks/messages.js";

class databaseManager {
  #collection;
  #schema;
  constructor(colection, schema) {
    this.#collection = colection;
    this.#schema = schema;
  }

  validateObject(item) {
    if (typeof item !== "object" || Array.isArray(item))
      throw new Error(ERRORS.REQUIRED_OBJECT.ERROR_CODE);
  }

  parseResponse(item) {
    return JSON.parse(JSON.stringify(item));
  }

  async getItems() {
    const data = await mongoose
      .model(this.#collection, this.#schema)
      .find()
      .lean();
    return data;
  }

  async findItems(query) {
    const response = await mongoose
      .model(this.#collection, this.#schema)
      .find(query)
      .lean();
    if (response.length === 0) throw new Error();
    const data = this.parseResponse(response);
    return data;
  }

  async createItem(item) {
    this.validateObject(item);
    try {
      const response = await mongoose
        .model(this.#collection, this.#schema)
        .create(item);
      const data = this.parseResponse(response);
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async updateItem(item) {
    this.validateObject(item);
    const data = await mongoose
      .model(this.#collection, this.#schema)
      .updateOne(item);
    return data;
  }

  async deleteItem(query) {
    const response = await mongoose
      .model(this.#collection, this.#schema)
      .deleteOne(query);
    return response;
  }

  async deleteAll() {
    const response = await mongoose
      .model(this.#collection, this.#schema)
      .deleteMany();
    return response;
  }
}

class ProductsDB extends databaseManager {
  constructor() {
    super("products", productSchema);
  }

  async findProductByID(productCode) {
    try {
      const query = { code: productCode };
      const response = await super.findItems(query);
      return response[0];
    } catch (err) {
      throw new Error(ERRORS.PRODUCT_NOT_FOUND.ERROR_CODE);
    }
  }

  async deleteProduct(productCode) {
    const query = { code: productCode };
    const response = await super.deleteItem(query);
    return response;
  }
}

class CartsDB extends databaseManager {
  constructor() {
    super("carts", cartSchema);
  }

  async findCartByID(cartRef) {
    try {
      const query = { ref: cartRef };
      const response = await super.findItems(query);
      return response[0];
    } catch (err) {
      throw new Error(ERRORS.CART_NOT_FOUND.ERROR_CODE);
    }
  }

  async deleteCart(cartRef) {
    const query = { ref: cartRef };
    const response = await super.deleteItem(query);
    return response;
  }
}

class MessagesDB extends databaseManager {
  constructor() {
    super("messages", messageSchema);
  }

  async createMessage(item) {
    if (item.message.trim() === "" || item.user.trim() === "")
      throw new Error(ERRORS.WRONG_INPUT.ERROR_CODE);
    super.createItem(item);
  }

  async deleteMessage() {
    const response = super.deleteAll();
    return response;
  }
}

const PM_MONGO = new ProductsDB();
const CM_MONGO = new CartsDB();
const MM_MONGO = new MessagesDB();

export { CM_MONGO, MM_MONGO, PM_MONGO };

import { validateInputs, searchMatch } from "../../logic/validations.js";
import { SUCCESS } from "../../mocks/messages.js";
import { Products } from "../../mocks/Products.js";
import { getMax } from "../../logic/helpers.js";
import { PM_MONGO } from "./databaseManager.js";

class ProductManager {
  #lastID;
  constructor() {
    this.#lastID = 0;
    this.productsList = [];
  }

  async getProducts() {
    const products = await PM_MONGO.getItems();
    this.productsList = products;
    return this.productsList;
  }

  async getProductById(query) {
    const product = await PM_MONGO.findProductByID(query);
    return {
      status_code: SUCCESS.GET.STATUS,
      item: product,
    };
  }

  async addProduct(fields) {
    const validate = await validateInputs(fields, { strict: true });
    if (validate.error) throw new Error(validate.status_code);

    await this.getProducts();

    const match = searchMatch(fields.code, this.productsList);
    if (match.error) throw new Error(match.status_code);

    this.#lastID = getMax(this.productsList);

    const newProduct = new Products(++this.#lastID, fields);
    this.productsList.push(newProduct);

    await PM_MONGO.createItem(newProduct);

    return {
      status_code: SUCCESS.CREATED.STATUS,
      productAdded: newProduct,
    };
  }

  async updateProduct(productId, fields) {
    const response = await this.getProductById(productId);
    const product = response.item;

    const validate = await validateInputs(fields, { strict: false });
    if (validate.error) throw new Error(validate.status_code);

    product.description = fields.description ?? product.description;
    product.thumbnail = fields.thumbnail ?? product.thumbnail;
    product.title = fields.title ?? product.title;
    product.price = fields.price ?? product.price;
    product.stock = fields.stock ?? product.stock;

    await PM_MONGO.updateItem(product);
    return {
      status_code: SUCCESS.UPDATED.STATUS,
      itemUpdated: product,
    };
  }

  async deleteProduct(productId) {
    const itemDeleted = await PM_MONGO.deleteProduct(productId);

    return {
      status_code: SUCCESS.DELETED.STATUS,
      itemDeleted,
    };
  }
}

const PM = new ProductManager();

export { PM };

import fs from "fs";
import { randomUUID } from "crypto";

export default class ProductManager {
  #path;
  constructor(path) {
    this.#path = path;
  }

  async #readingJSON() {
    try {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async #fileSaving(item) {
    try {
      const dataJSON = JSON.stringify(item);
      await fs.promises.writeFile(this.#path, dataJSON);
    } catch (error) {
      console.log(error);
    }
  }
  async addProducts(item) {
    try {
      const products = await this.#readingJSON();
      item.id = randomUUID();
      products.push(item);
      this.#fileSaving(products);
      console.log("Product added");
    } catch (error) {
      console.log(error);
    }
  }
  async getProducts() {
    try {
      const product = await this.#readingJSON();
      return !product ? await this.#fileSaving(product) : product;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getProductsById(id) {
    try {
      const product = await this.#readingJSON();
      let productById;
      product.map((item) => {
        item.id === id && (productById = item);
      });
      return productById;
    } catch (error) {
      console.log(error);
    }
  }
  async updateProduct(id, item) {
    try {
      const product = await this.#readingJSON();
      const productId = product.findIndex((product) => product.id === id);
      if (productId >= 0) {
        item.id = id;
        product[productId] = item;
        await this.#fileSaving(product);
        return product[productId];
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deleteProduct(id) {
    try {
      const allProduct = await this.#readingJSON();
      const deleteProduct = allProduct.findIndex((item) => item.id === id);
      if (deleteProduct >= 0) {
        allProduct.splice(deleteProduct, 1);
        await this.#fileSaving(allProduct);
      }
      return deleteProduct;
    } catch (error) {
      console.log(error);
    }
  }
}

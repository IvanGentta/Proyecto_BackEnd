import fs from "fs";
import { randomUUID } from "crypto";

export default class CartContainer {
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
  async addNewCart() {
    try {
      const cart = await this.#readingJSON();
      const newCart = {
        id: randomUUID(),
        products: [],
      };
      cart.push(newCart);
      this.#fileSaving(cart);
      console.log("New Cart added");
      return newCart;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getCartById(cid) {
    try {
      const allCarts = await this.#readingJSON();
      let productInCart;
      allCarts.map(
        (item) => item.id === cid && (productInCart = item.products)
      );
      return productInCart;
    } catch (error) {
      console.log(error);
    }
  }
  async addNewProductInCart(cid, pid) {
    try {
      const allCarts = await this.#readingJSON();
      const cartIndex = allCarts.findIndex((cart) => cart.id === cid);

      if (cartIndex !== -1) {
        const prodIndex = allCarts[cartIndex].products.findIndex(
          (product) => product.id === pid
        );

        if (prodIndex !== -1) {
          allCarts[cartIndex].products.map(
            (element) => element.id === pid && element.qty++
          );
          await this.#fileSaving(allCarts);

          console.log("Updated qty product");
        } else {
          allCarts[cartIndex].products.push({
            id: pid,
            qty: 1,
          });

          await this.#fileSaving(allCarts);
          console.log("New Product added");
        }
        return allCarts[cartIndex].products;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

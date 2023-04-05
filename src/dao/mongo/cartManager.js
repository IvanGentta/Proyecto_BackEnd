import { CartProducts, Carts } from "../../mocks/Cart.js";
import { SUCCESS } from "../../mocks/messages.js";
import { getMax } from "../../logic/helpers.js";
import { CM_MONGO, PM_MONGO } from "./databaseManager.js";

class CartManager {
  #lastID;
  constructor() {
    this.cartsList = [];
    this.#lastID = 0;
  }

  async #getCarts() {
    const carts = await CM_MONGO.getItems();
    this.cartsList = [...carts];
    return this.cartsList;
  }

  async createCart() {
    await this.#getCarts();

    this.#lastID = getMax(this.cartsList);

    const newCart = new Carts(++this.#lastID);
    this.cartsList.push(newCart);

    await CM_MONGO.createItem(newCart);

    return {
      status_code: SUCCESS.CART_CREATED.STATUS,
      cart: newCart,
    };
  }

  async getCartById(cartRef) {
    const cart = await CM_MONGO.findCartByID(cartRef);
    console.log(cart);

    const totalProducts = cart.products.reduce(
      (acc, el) => acc + el.quantity,
      0
    );

    console.log(totalProducts);
    return {
      status_code: SUCCESS.GET_CART.STATUS,
      totalProducts,
      cart,
    };
  }

  async addProductToCart(cartRef, productCode) {
    await this.#getCarts();

    const cart = await CM_MONGO.findCartByID(cartRef);
    const product = await PM_MONGO.findProductByID(productCode);

    const productIndex = cart.products.findIndex(
      (el) => el.productCode === product.code
    );

    if (productIndex !== -1) {
      ++cart.products[productIndex].quantity;

      await CM_MONGO.updateItem(cart);

      return {
        status_code: SUCCESS.INCREASE_QUANTITY.STATUS,
        productAdded: cart,
      };
    }

    const newCartProduct = new CartProducts({ code: product.code });

    cart.products.push(newCartProduct);

    await CM_MONGO.updateItem(cart);

    return {
      status_code: SUCCESS.CART_PRODUCT.STATUS,
      productAdded: cart,
    };
  }

  async deleteCart(cartRef) {
    const cartDeleted = await CM_MONGO.deleteCart(cartRef);

    return {
      status_code: SUCCESS.DELETED.STATUS,
      deleted: cartDeleted.acknowledged,
      carts_deleted: cartDeleted.deletedCount,
    };
  }
}

const CM = new CartManager();

export { CM };

import { encryptID } from "../logic/cripto.js";

export class CartProducts {
  constructor({ code, quantity }) {
    this.productCode = code;
    this.quantity = quantity ?? 1;
  }
}

export class Carts {
  constructor(lastID) {
    this.ref = lastID;
    this.id = encryptID(lastID);
    this.products = [];
  }
}

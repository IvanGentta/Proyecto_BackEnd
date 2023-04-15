import { io } from "../app/app.js";
import { MM } from "../dao/mongo/messagesManager.js";
import { PM } from "../dao/mongo/productManager.js";

export async function socketHandle(req, res, next) {
  const products = await PM.getProducts();
  io.emit("updateList", {
    list: products,
    showList: products.length > 0,
  });
}

export async function handleMessageSocket(req, res, next) {
  const messages = await MM.getMessages();
  io.emit("messagesList", {
    list: messages,
    showList: messages.length > 0,
  });
}

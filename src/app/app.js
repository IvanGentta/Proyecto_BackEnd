import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";

import { productsRouter } from "../routers/productsRouter.js";
import { cartRouter } from "../routers/cartRouter.js";
import { viewsRouter } from "../routers/viewsRouter.js";

import { handleError } from "../middlewares/errors.js";
import { handleMessageSocket, socketHandle } from "../middleware/socket.js";
import { PORT } from "../config/server.config.js";
import { URL } from "../config/database.js";
import { messageRouter } from "../routers/messageRouter.js";

await mongoose.connect(URL);

const app = express();
app.use("/static", express.static("./static"));

app.engine("handlebars", engine());
app.set("views", "./views");

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/", viewsRouter);
app.use(handleError);

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
  console.log("Path to static view: ", "http:localhost:8080/");
  console.log(
    "Path to dinamic view: ",
    "http:localhost:8080/realtimeproducts”"
  );
  console.log("Path to API: ", "http:localhost:8080/api/products");
});

export const io = new Server(server);

io.on("connection", async (clientSocket) => {
  console.log(`Nuevo cliente conectado: ${clientSocket.id}`);
  await socketHandle();
  await handleMessageSocket();
});

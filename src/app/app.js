import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";

import { productsRouter } from "../routers/productsRouter.js";
// import { cartRouter } from "../routers/cartRouter.js";
// import { viewsRouter } from "../routers/viewsRouter.js";

import { handleError } from "../middlewares/errors.js";
import { PORT } from "../config/server.config.js";
import { MONGODB_CNX_STR } from "../config/database.js";
// import { messageRouter } from "../routers/messageRouter.js";
// import { handleMessageSocket, socketHandle } from "../middlewares/socket.js";

await mongoose.connect(MONGODB_CNX_STR);

const app = express();
app.use("/static", express.static("./static"));

app.engine("handlebars", engine());
app.set("views", "./views");

app.use("/api/v1/products", productsRouter);
// app.use("/api/v1/cart", cartRouter);
// app.use("/api/v1/messages", messageRouter);
// app.use("/", viewsRouter);
app.use(handleError);

const server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

export const io = new Server(server);

io.on("connection", async (clientSocket) => {
  console.log(`Nuevo cliente conectado: ${clientSocket.id}`);
  await socketHandle();
  await handleMessageSocket();
});

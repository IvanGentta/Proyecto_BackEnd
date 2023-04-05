import express, { Router } from "express";
import { PM } from "../dao/mongo/productManager.js";
import { limitProducts } from "../logic/helpers.js";
import { socketHandle } from "../middleware/socket.js";

export const productsRouter = Router();

productsRouter.use(express.json());

productsRouter
  .route("/:pid")
  .get(async (req, res, next) => {
    try {
      const response = await PM.getProductById(req.params.pid);
      res.status(response.status_code).json(response.item);
    } catch (error) {
      return next(error.message);
    }
  })
  .put(async (req, res, next) => {
    try {
      const response = await PM.updateProduct(req.params.pid, req.body);
      await socketHandle();

      res.status(response.status_code).json(response.itemUpdated);
    } catch (error) {
      return next(error.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const response = await PM.deleteProduct(req.params.pid);
      await socketHandle();

      res
        .status(response.status_code)
        .json({ product_deleted: response.itemDeleted });
    } catch (error) {
      return next(error.message);
    }
  });

productsRouter
  .route("/")
  .get(async (req, res, next) => {
    if (req.query.limit === undefined && req.query.page === undefined)
      return next();
    try {
      const allProducts = await PM.getProducts();
      const list = limitProducts(allProducts, req.query.limit, req.query.page);
      res.json({ ...list });
    } catch (error) {
      return next(error.message);
    }
  })
  .get(async (req, res) => {
    const response = await PM.getProducts();
    res.json({
      lenght: response.length,
      products: response,
    });
  })
  .post(async (req, res, next) => {
    try {
      const response = await PM.addProduct(req.body);
      await socketHandle();
      res.status(response.status_code).json(response.productAdded);
    } catch (error) {
      return next(error.message);
    }
  });

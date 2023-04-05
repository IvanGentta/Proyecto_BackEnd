import express, { Router } from "express";
import { CM } from "../dao/mongo/cartManager.js";
import { ERRORS } from "../mocks/messages.js";

export const cartRouter = Router();

cartRouter.use(express.json());

cartRouter.route("/:cid/product/:pid").post(async (req, res, next) => {
  try {
    const response = await CM.addProductToCart(req.params.cid, req.params.pid);
    res.status(response.status_code).json(response.productAdded);
  } catch (error) {
    return next(error.message);
  }
});

cartRouter
  .route("/:cid")
  .get(async (req, res, next) => {
    try {
      const response = await CM.getCartById(req.params.cid);
      res.status(response.status_code).json({
        cart: response.cart,
        totalProducts: response.totalProducts,
      });
    } catch (error) {
      return next(error.message);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const response = await CM.deleteCart(req.params.cid);
      res.status(response.status_code).json({
        deleted: response.deleted,
        cart_deleted: response.carts_deleted,
      });
    } catch (error) {
      return next(error.message);
    }
  });

cartRouter
  .route("/")
  .post(async (req, res, next) => {
    try {
      const response = await CM.createCart();
      res.status(response.status_code).json(response.cart);
    } catch (error) {
      return next(error.message);
    }
  })
  .get(async (req, res, next) => {
    try {
      throw new Error(ERRORS.FEATURE_NOT_IMPLEMENTED.ERROR_CODE);
    } catch (error) {
      next(error.message);
    }
  });

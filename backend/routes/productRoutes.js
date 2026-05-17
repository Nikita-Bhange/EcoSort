import express from "express";
import { getProduct,getProducts} from "../controllers/products.js";
const router = express.Router();

router.get("/:id",getProduct);
router.get("/getProducts/:category",getProducts);


export default router;
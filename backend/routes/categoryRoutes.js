import express from "express";
import { getCategories, addCategory, deleteCategory } from "../controllers/categoryController.js";
const router = express.Router();

// Get all categories
router.get("/", getCategories);

// Add new category (Admin)
router.post("/", addCategory);

// Delete category (Admin)
router.delete("/:id", deleteCategory);

export default router;

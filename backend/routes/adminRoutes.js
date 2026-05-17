import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllProducts,
  getAllOrders,
  toggleUserBlock,
  deleteProduct,
  getReports,
  updateReportStatus,
  getPaymentTransactions,
  getSellerPayouts,
} from "../controllers/adminController.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.put("/users/:userId/block", toggleUserBlock);

// Products
router.get("/products", getAllProducts);
router.delete("/products/:productId", deleteProduct);

// Orders
router.get("/orders", getAllOrders);

// Reports
router.get("/reports", getReports);
router.put("/reports/:reportId", updateReportStatus);

// Payments
router.get("/payments", getPaymentTransactions);
router.get("/payouts", getSellerPayouts);

export default router;
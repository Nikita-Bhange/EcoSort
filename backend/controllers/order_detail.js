import moment from "moment";
import db from "../connect.js";
import jwt from "jsonwebtoken";

// Add order details
export const addOrderDetails = async (req, res) => {
    const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ error: "Not logged in!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token!" });
        }

        try {
            const pid = req.params.p_id;
            const sellerId = req.body.seller_id;
            const userId = userInfo.id;
            const paymentMethod = req.body.payment_method || "cod";
            const amount = req.body.amount;

            console.log("Product ID:", pid, "Seller ID:", sellerId, "Buyer ID:", userId);

            if (!sellerId || !pid) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const query = `INSERT INTO order_detail (seller_id, buyer_id, p_id, status, payment_method, amount, date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                sellerId,
                userId,
                pid,
                "Pending",
                paymentMethod,
                amount,
                moment().format("YYYY-MM-DD"),
            ];

            db.query(query, values, (err, insertResult) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ error: "Database operation failed" });
                }

                res.status(200).json({
                    message: "Product ordered successfully!",
                    orderId: insertResult.insertId,
                });
            });
        } catch (error) {
            console.error("Server Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
};

// Get user orders (both purchased and sold)
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const q = `SELECT 
            o.*,
            p.p_name,
            p.image,
            p.category,
            seller.username as seller_name,
            buyer.username as buyer_name
        FROM order_detail o
        JOIN product p ON o.p_id = p.id
        JOIN users seller ON o.seller_id = seller.id
        JOIN users buyer ON o.buyer_id = buyer.id
        WHERE o.buyer_id = ? OR o.seller_id = ?
        ORDER BY o.created_at DESC`;

        db.query(q, [userId, userId], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ orders: result });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const q = "UPDATE order_detail SET status = ? WHERE id = ?";
        db.query(q, [status, orderId], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.status(200).json({ message: "Order status updated successfully" });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
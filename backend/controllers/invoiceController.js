import db from "../connect.js";
import jwt from "jsonwebtoken";

// Generate invoice number
const generateInvoiceNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `INV-${timestamp}-${random}`;
};

// Create invoice
export const createInvoice = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({ error: "Not logged in!" });
        }

        const userInfo = jwt.verify(token, process.env.JWT_SECRET);

        const {
            order_id,
            buyer_name,
            buyer_email,
            buyer_address,
            product_name,
            amount,
            payment_method
        } = req.body;

        if (!order_id || !buyer_name || !amount) {
            return res.status(400).json({ error: "Required fields missing" });
        }

        const invoiceNumber = generateInvoiceNumber();

        const q = `INSERT INTO invoice 
            (order_id, invoice_number, buyer_name, buyer_email, buyer_address, product_name, amount, payment_method, invoice_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`;

        db.query(q, [
            order_id,
            invoiceNumber,
            buyer_name,
            buyer_email,
            buyer_address,
            product_name,
            amount,
            payment_method
        ], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({
                message: "Invoice created successfully",
                invoiceId: result.insertId,
                invoiceNumber: invoiceNumber
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        res.status(500).json({ error: "Server error" });
    }
};

// Get invoice by order ID
export const getInvoice = async (req, res) => {
    try {
        const { orderId } = req.params;

        const q = "SELECT * FROM invoice WHERE order_id = ?";
        db.query(q, [orderId], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: "Invoice not found" });
            }
            res.status(200).json({ invoice: result[0] });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all invoices for a user
export const getUserInvoices = async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({ error: "Not logged in!" });
        }

        const userInfo = jwt.verify(token, process.env.JWT_SECRET);

        const q = `SELECT i.* FROM invoice i 
            JOIN order_detail o ON i.order_id = o.id 
            WHERE o.buyer_id = ? OR o.seller_id = ?
            ORDER BY i.created_at DESC`;

        db.query(q, [userInfo.id, userInfo.id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json({ invoices: result });
        });
    } catch (error) {
        console.error("Server Error:", error);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        res.status(500).json({ error: "Server error" });
    }
};
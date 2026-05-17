import db from "../connect.js";
import jwt from "jsonwebtoken";

// Get token from request
const getTokenFromRequest = (req) => {
    if (req.cookies && req.cookies.token) return req.cookies.token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.replace("Bearer ", "").trim();
    }
    return null;
};

// Add product to cart
export const addToCart = async (req, res) => {
    const token = getTokenFromRequest(req);
    if (!token) {
        return res.status(401).json({ error: "Not logged in!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token!" });
        }

        const p_id = req.params.pid;
        const userId = userInfo.id;

        console.log("Product ID:", p_id, "User ID:", userId);

        // Check if product already in cart
        const checkQ = "SELECT id FROM cart WHERE p_id = ? AND u_id = ?";
        db.query(checkQ, [p_id, userId], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: "Product already in cart" });
            }

            const q = "INSERT INTO cart (p_id, u_id) VALUES (?, ?)";
            db.query(q, [p_id, userId], (err, result) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                res.status(200).json({ message: "Product has been added to cart successfully!" });
            });
        });
    });
};

// Get user's cart items
export const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const query = `
            SELECT 
                c.id AS cart_id, 
                c.p_id, 
                c.quantity, 
                p.p_name AS product, 
                p.price AS amount, 
                p.image
            FROM 
                cart c
            JOIN 
                product p ON c.p_id = p.id
            WHERE 
                c.u_id = ?
        `;
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Database Error (getCartItems):", err);
                return res.status(500).json({ message: "Failed to fetch cart items." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update cart item quantity
export const updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: "Invalid quantity" });
        }

        const q = "UPDATE cart SET quantity = ? WHERE id = ?";
        db.query(q, [quantity, cartId], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Cart item not found" });
            }
            res.status(200).json({ message: "Cart updated successfully" });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete cart item
export const deleteCartItem = async (req, res) => {
    try {
        const { cartId } = req.params;

        const q = "DELETE FROM cart WHERE id = ?";
        db.query(q, [cartId], (err, result) => {
            if (err) {
                console.error("Database Error (deleteCartItem):", err);
                return res.status(500).json({ message: "Failed to delete item from cart." });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Cart item not found." });
            }
            res.status(200).json({ message: "Cart item deleted successfully." });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
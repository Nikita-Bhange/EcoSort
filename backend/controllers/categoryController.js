import db from "../connect.js";

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const q = "SELECT id, cat_name, cat_image FROM category ORDER BY id";
        db.query(q, (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Add new category (Admin only)
export const addCategory = async (req, res) => {
    try {
        const { cat_name } = req.body;
        
        if (!cat_name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const q = "INSERT INTO category (cat_name) VALUES (?)";
        db.query(q, [cat_name], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ error: "Category already exists" });
                }
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ 
                message: "Category added successfully", 
                id: result.insertId 
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const q = "DELETE FROM category WHERE id = ?";
        db.query(q, [id], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.status(200).json({ message: "Category deleted successfully" });
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
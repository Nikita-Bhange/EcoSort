import moment from "moment";
import db from "../connect.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const query = promisify(db.query).bind(db);

// Helper: extract token from request (cookie or Authorization header)
const getTokenFromRequest = (req) => {
  if (req.cookies && req.cookies.token) return req.cookies.token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }
  return null;
};

// ================= ADD PRODUCT =================

export const addPosts = async (req, res) => {
  try {
    console.log("=== ADD PRODUCT ===");
    console.log("Request Body:", req.body);
    console.log("req.files:", req.files);
    console.log("Content-Type:", req.headers['content-type']);
    
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        error: "Not logged in!",
      });
    }

    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    console.log("User Info:", userInfo);

    const {
      p_name,
      p_desc,
      used_duration,
      category,
      price,
      negotiable,
    } = req.body;

    // Validation
    if (!p_name || !p_name.toString().trim()) {
      return res.status(400).json({ error: "Product name is required" });
    }
    if (!p_desc || !p_desc.toString().trim()) {
      return res.status(400).json({ error: "Description is required" });
    }
    if (!used_duration || !used_duration.toString().trim()) {
      return res.status(400).json({ error: "Used duration is required" });
    }
    if (!category || !category.toString().trim()) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (price === undefined || price === null || price === "") {
      return res.status(400).json({ error: "Price is required" });
    }
    if (negotiable === undefined || negotiable === null || negotiable === "") {
      return res.status(400).json({ error: "Negotiable field is required" });
    }

    // Get Category ID
    const categoryResult = await query(
      `SELECT id FROM category WHERE cat_name = ?`,
      [category]
    );

    if (categoryResult.length === 0) {
      return res.status(400).json({
        error: "Invalid category",
      });
    }

    const c_id = categoryResult[0].id;

    // Images - Debug logging
    console.log("Processing images...");
    console.log("req.files type:", typeof req.files);
    console.log("req.files is array:", Array.isArray(req.files));
    console.log("req.files length:", req.files ? req.files.length : 0);
    
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => {
        console.log("File:", file.filename, file.originalname, file.size);
        return file.filename;
      });
    } else {
      console.log("No files uploaded or req.files is empty");
    }

    const imagePaths = JSON.stringify(images);
    console.log("Images to save:", imagePaths);

    // Insert Product
    const result = await query(
      `INSERT INTO product
      (c_id, p_name, p_desc, category, used_duration, price, negotiable, image, seller_id, posting_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        c_id,
        p_name,
        p_desc,
        category,
        used_duration,
        price,
        negotiable,
        imagePaths,
        userInfo.id,
        moment().format("YYYY-MM-DD"),
      ]
    );

    console.log("Product inserted with ID:", result.insertId);

    res.status(201).json({
      message: "Product posted successfully!",
      postId: result.insertId,
    });

  } catch (error) {
    console.error("Add Posts Error:", error.message);
    console.error("Stack:", error.stack);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File size too large. Max 5MB per image." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files. Max 5 images allowed." });
    }

    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

// ================= UPDATE PRODUCT =================

export const updatePosts = async (req, res) => {
  try {
    console.log("=== UPDATE PRODUCT ===");
    console.log("Request Body:", req.body);
    console.log("req.files:", req.files);
    
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: "Not logged in!" });
    }

    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    const postId = req.params.id;

    const {
      p_name,
      p_desc,
      used_duration,
      category,
      price,
      negotiable,
    } = req.body;

    if (!p_name || !p_desc || !used_duration || !category || !price || !negotiable) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const categoryResult = await query(
      `SELECT id FROM category WHERE cat_name = ?`,
      [category]
    );

    if (categoryResult.length === 0) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const c_id = categoryResult[0].id;

    // Images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    const imagePaths = JSON.stringify(images);

    await query(
      `UPDATE product
      SET c_id = ?, p_name = ?, p_desc = ?, category = ?, used_duration = ?, price = ?, negotiable = ?, image = ?, posting_date = ?
      WHERE id = ? AND seller_id = ?`,
      [c_id, p_name, p_desc, category, used_duration, price, negotiable, imagePaths, moment().format("YYYY-MM-DD"), postId, userInfo.id]
    );

    res.status(200).json({ message: "Product updated successfully!" });

  } catch (error) {
    console.error("Update Posts Error:", error.message);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ================= GET USER POSTS =================

export const getPosts = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: "Not logged in!" });
    }

    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    const posts = await query(
      `SELECT p.id, p.p_name, p.p_desc, p.category, p.used_duration, p.image, p.price, p.negotiable, p.posting_date,
              p.seller_id, u.username as seller_name, pr.city as seller_city, pr.state as seller_state
       FROM product p
       LEFT JOIN users u ON p.seller_id = u.id
       LEFT JOIN profiles pr ON p.seller_id = pr.userid
       WHERE p.seller_id = ?`,
      [userInfo.id]
    );

    res.status(200).json({ posts });

  } catch (error) {
    console.error("Get Posts Error:", error.message);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ================= DELETE PRODUCT =================

export const deletePosts = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: "Not logged in!" });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    const postId = req.params.id;

    await query(`DELETE FROM order_detail WHERE p_id = ?`, [postId]);
    const result = await query(`DELETE FROM product WHERE id = ?`, [postId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully!" });

  } catch (error) {
    console.error("Delete Posts Error:", error.message);
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
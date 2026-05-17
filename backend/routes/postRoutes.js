import express from "express";
import { addPosts ,getPosts, updatePosts, deletePosts} from "../controllers/user_post.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post("/",upload.array("image", 5),addPosts);
router.get("/",getPosts);
router.put("/update/:id/",upload.array("image", 5),updatePosts);
router.delete("/:id",deletePosts);

export default router;

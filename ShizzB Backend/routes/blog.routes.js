const express = require("express");
const router = express.Router();

const blogController = require("../controller/blog.controller");

// Create Blog
router.post("/create", blogController.createBlog);

// Test Route
router.get("/test", (req, res) => {
res.json({ message: "Blog Route Working" });
});

// Get All Blogs
router.get("/", blogController.getBlogs);

// Get Blog By Slug
router.get("/slug/:slug", blogController.getBlogBySlug);

// Previous / Next Navigation
router.get(
  "/navigation/:slug",
  blogController.getBlogNavigation
);

router.put(
  "/view/:id",
  blogController.increaseBlogView
);

// Get Single Blog By ID
router.get("/:id", blogController.getBlog);

// Update Blog
router.put("/:id", blogController.updateBlog);

// Delete Blog
router.delete("/:id", blogController.deleteBlog);

module.exports = router;

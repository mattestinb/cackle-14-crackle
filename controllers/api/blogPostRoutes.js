// Imports
const router = require("express").Router();
const { BlogPost } = require("../../models");
const withAuth = require("../../utils/auth");

// Helper function for error handling
const handleErrors = (err, res, statusCode) => {
  console.log(err);
  res.status(statusCode).json(err);
};

// Helper function for sending response
const sendResponse = (data, res, statusCode, notFoundMessage) => {
  if (!data) {
    res.status(404).json({ message: notFoundMessage });
    return;
  }
  res.status(statusCode).json(data);
};

// Route to create a new blog post
router.post("/", withAuth, async (req, res) => {
  try {
    const blogPost = await BlogPost.create({ ...req.body, user_id: req.session.user_id });
    sendResponse(blogPost, res, 200);
  } catch (err) {
    handleErrors(err, res, 400);
  }
});

// Route to edit an existing blog post
router.put("/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.update(req.body, {
      where: { id: req.params.id },
    });
    sendResponse(blogPostData, res, 200, "No blog post found with this id!");
  } catch (err) {
    handleErrors(err, res, 500);
  }
});

// Route to delete an existing blog post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.destroy({
      where: { id: req.params.id },
    });
    sendResponse(blogPostData, res, 200, "No blog post found with this id!");
  } catch (err) {
    handleErrors(err, res, 500);
  }
});

// Exports
module.exports = router;



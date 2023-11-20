// Imports
const router = require("express").Router();
const { Comment, User, BlogPost } = require("../../models");

// Helper function for error handling
const handleError = (err, res, statusCode) => {
  console.error(err);
  res.status(statusCode).json(err);
};

// Helper function for sending response
const sendResponse = (data, res, statusCode, errorMessage = null) => {
  if (!data) {
    res.status(errorMessage ? 400 : 404).json({ message: errorMessage || "No record found!" });
    return;
  }
  res.status(statusCode).json(data);
};

// CREATE Comment
router.post("/", async (req, res) => {
  try {
    const comment = await Comment.create({
      comment_body: req.body.comment_body,
      blogPost_id: req.body.blogPost_id,
      user_id: req.session.user_id || req.body.user_id,
    });
    sendResponse(comment, res, 200);
  } catch (err) {
    handleError(err, res, 500);
  }
});

// READ all Comments
router.get("/", async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [
        { model: User, attributes: ["username"] },
        { model: BlogPost, attributes: ["id"] },
      ],
    });
    sendResponse(commentData, res, 200);
  } catch (err) {
    handleError(err, res, 500);
  }
});

// UPDATE Comment
router.put("/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.update(req.body, {
      where: { id: req.params.id },
    });
    sendResponse(updatedComment[0], res, 200, "No comment found with that id!");
  } catch (err) {
    handleError(err, res, 500);
  }
});

// DELETE Comment
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.destroy({ where: { id: req.params.id } });
    sendResponse(comment, res, 200, "No comment found with that id!");
  } catch (err) {
    handleError(err, res, 500);
  }
});

// Exports
module.exports = router;




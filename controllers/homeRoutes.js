// Imports
const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Helper function for error handling
const handleError = (err, res, redirectPath = null) => {
  console.log(err);
  res.status(500).json(err);
  if (redirectPath) {
    res.redirect(redirectPath);
  }
};

// Helper function to serialize data
const serializeData = (data) => data.get({ plain: true });

// Helper function to render page
const renderPage = (res, page, data, sessionData) => {
  res.render(page, { ...data, ...sessionData });
};

// Get all blogPosts and JOIN with user data and comment data
router.get("/", async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [{ model: User, attributes: ["name", "id"] }, { model: Comment, attributes: ["comment_body"] }],
    });

    const blogPosts = blogPostData.map(serializeData);
    renderPage(res, "homepage", { blogPosts }, { logged_in: req.session.logged_in, userId: req.session.user_id });
  } catch (err) {
    handleError(err, res);
  }
});

// Find single blog post and render blogPost page
router.get("/blogPost/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["name"] }, { model: Comment, include: [User] }],
    });

    const blogPost = serializeData(blogPostData);
    renderPage(res, "blogPost", blogPost, { logged_in: req.session.logged_in });
  } catch (err) {
    handleError(err, res, "/login");
  }
});

// Access to the dashboard page
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: BlogPost, include: [User] }, { model: Comment }],
    });

    const user = serializeData(userData);
    renderPage(res, "dashboard", user, { logged_in: true });
  } catch (err) {
    handleError(err, res);
  }
});

// Renders 'create.handlebars'; redirects to /login if not logged in
router.get("/create", async (req, res) => {
  try {
    if (req.session.logged_in) {
      renderPage(res, "create", {}, { logged_in: req.session.logged_in, userId: req.session.user_id });
      return;
    }
    res.redirect("/login");
  } catch (err) {
    handleError(err, res);
  }
});

// Edit an existing blog post
router.get("/create/:id", async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["name"] }, { model: Comment, include: [User] }],
    });

    const blogPost = serializeData(blogPostData);
    if (req.session.logged_in) {
      renderPage(res, "edit", blogPost, { logged_in: req.session.logged_in, userId: req.session.user_id });
      return;
    }
    res.redirect("/login");
  } catch (err) {
    handleError(err, res);
  }
});

// Login route
router.all("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

// Export
module.exports = router;

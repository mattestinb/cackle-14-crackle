// Imports
const router = require("express").Router();
const { User } = require("../../models");

// Helper function for error handling
const handleError = (err, res) => {
  console.error(err);
  res.status(400).json(err);
};

// Helper function to save session
const saveSession = (req, userData, res, message = '') => {
  req.session.save(() => {
    req.session.user_id = userData.id;
    req.session.logged_in = true;

    res.status(200).json(message ? { user: userData, message } : userData);
  });
};

// Posts new user email, username, and password to database
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    saveSession(req, userData, res);
  } catch (err) {
    handleError(err, res);
  }
});

// For when user logs in as an existing user - credentials are validated
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      console.log("no user found");
      return res.status(400).json({ message: "Incorrect email or password, please try again" });
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      console.log("no password match");
      return res.status(400).json({ message: "Incorrect email or password, please try again" });
    }

    saveSession(req, userData, res, "You are logged in!");
  } catch (err) {
    handleError(err, res);
  }
});

// When user logs out the session ends
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// Exports
module.exports = router;





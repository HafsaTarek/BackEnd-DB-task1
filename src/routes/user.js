const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

// POST /users: Create a new user
router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateToken();

    await user.save();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// GET /users: Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PATCH /users/:id: Update a user by ID
router.patch("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    updates.forEach((ele) => {
      user[ele] = req.body[ele];
    });

    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// POST /login: User login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// GET /profile: Get user profile
router.get("/profile", auth, async (req, res) => {
  res.status(200).send(req.user);
});

// DELETE /logout: Log out the current session
router.delete("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((ele) => ele !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// DELETE /logoutAll: Log out all sessions
router.delete("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;

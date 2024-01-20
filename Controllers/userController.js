const express = require("express");
const User = require("../Services/userService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    console.log("NEW USER: ", newUser);
    const result = await User.addUser(newUser);
    res.json(result);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Route to delete a user
router.delete("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const result = await User.deleteUser(email);
    res.json(result);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Route to get a user by email
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const result = await User.getUserByEmail(email);
    res.json(result);
  } catch (error) {
    console.error("Error getting user by email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/username/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const result = await User.getUserByUsername(username);
    res.json(result);
  } catch (error) {
    console.error("Error getting user by username:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const updatedUser = req.body;
    const result = await User.updateUser(updatedUser);
    res.json(result);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await User.loginUser(email, password);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: result.user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

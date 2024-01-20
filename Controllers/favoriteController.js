const express = require("express");
const router = express.Router();
const Favorite = require("../Services/favoriteService");

// Add Favorite
router.post("/", async (req, res) => {
  try {
    const { user_id, recipe_id } = req.body;
    const result = await Favorite.addFavorite(user_id, recipe_id);
    res.json(result);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete Favorite
router.delete("/:user_id/:recipe_id", async (req, res) => {
  try {
    user_id = req.params.user_id;
    recipe_id = req.params.recipe_id;
    const result = await Favorite.deleteFavorite(user_id, recipe_id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await Favorite.getFavoritesForUser(user_id);
    res.json(result);
  } catch (error) {
    console.error("Error getting favorites for user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:user_id/:recipe_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const recipe_id = req.params.recipe_id;
    const result = await Favorite.getFavorite(user_id, recipe_id);
    res.json(result);
  } catch (error) {
    console.error("Error getting favorite for user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

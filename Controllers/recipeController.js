const express = require("express");
const Recipe = require("../Services/recipeService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newRecipe = req.body;
    const result = await Recipe.addRecipe(newRecipe);
    res.json(result);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Recipe.deleteRecipe(id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const updatedRecipe = req.body;
    const result = await Recipe.updateRecipe(updatedRecipe);
    res.json(result);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Recipe.getRecipeById(id);
    res.json(result);
  } catch (error) {
    console.error("Error getting recipe:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await Recipe.getAllRecipes();
    res.json(result);
  } catch (error) {
    console.error("Error getting recipe:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/by-user/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;
    const result = (await Recipe.getUserRecipes(id)) || [];
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error getting recipes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/recommendations/:user_id", async (req, res) => {
  try {
    const id = req.params.user_id;
    const result = await Recipe.getRecommendedRecipes(id);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error getting recommended recipes:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

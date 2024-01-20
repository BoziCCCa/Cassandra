const express = require("express");
const ShoppingList = require("../Services/shoppingListService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, title } = req.body;
    const result = await ShoppingList.addShoppingList(user_id, title);
    res.json(result);
  } catch (error) {
    console.error("Error adding shopping list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/:user_id/:list_id", async (req, res) => {
  try {
    const { user_id, list_id } = req.params;
    const result = await ShoppingList.deleteShoppingList(user_id, list_id);
    console.log("Rezultat:", result);
    res.json(result);
  } catch (error) {
    console.error("Error deleting shopping list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await ShoppingList.getShoppingListsForUser(user_id);
    res.json(result);
  } catch (error) {
    console.error("Error getting shopping lists for user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/:user_id/:list_id/addProduct/:productId", async (req, res) => {
  try {
    const { user_id, list_id, productId } = req.params;
    const result = await ShoppingList.addProductToList(
      user_id,
      list_id,
      productId
    );
    res.json(result);
  } catch (error) {
    console.error("Error adding product to shopping list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.put("/:user_id/:list_id/removeProduct/:productId", async (req, res) => {
  try {
    const { user_id, list_id, productId } = req.params;
    const result = await ShoppingList.removeProductFromList(
      user_id,
      list_id,
      productId
    );
    res.json(result);
  } catch (error) {
    console.error("Error removing product from shopping list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:user_id/:list_id/products", async (req, res) => {
  try {
    const { user_id, list_id } = req.params;
    const result = await ShoppingList.getProductsInList(user_id, list_id);
    res.json(result);
  } catch (error) {
    console.error("Error getting products in shopping list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

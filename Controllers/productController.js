const express = require("express");
const Product = require("../Services/productService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const result = await Product.addProduct(newProduct);
    res.json(result);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Product.deleteProduct(id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = req.body;
    const result = await Product.updateProduct(updatedProduct);
    res.json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Product.getProductById(id);
    res.json(result);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await Product.getAllProducts();
    res.json(result);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

const cassandra = require("cassandra-driver");
const client = new cassandra.Client({
  contactPoints: ["127.0.0.1:4444"],
  localDataCenter: "datacenter1",
  keyspace: "recipe_app",
  authProvider: new cassandra.auth.PlainTextAuthProvider(
    "cassandra",
    "cassandra"
  ),
});

client
  .connect()
  .then(() => console.log("Connected to Cassandra in PRODUCT SERVICE"))
  .catch((err) => console.error("Error connecting to Cassandra", err));
const Product = {
  async addProduct(newProduct) {
    const query =
      'INSERT INTO "product" (product_id,name, calories, proteins, fats, carbs) VALUES (uuid(), ?, ?, ?, ?,?,?)';
    const params = [
      newProduct.name,
      newProduct.calories,
      newProduct.proteins,
      newProduct.fats,
      newProduct.carbs,
    ];
    try {
      await client.execute(query, params, { prepare: true });
      console.log("Product added successfully:", newProduct);
      return { success: true, message: "Product added successfully" };
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, message: "Error adding product" };
    }
  },
  async deleteProduct(id) {
    const query = 'DELETE FROM "product" WHERE product_id=? IF EXISTS';
    const params = [id];

    try {
      await client.execute(query, params, { prepare: true });
      console.log("Product " + params.id + " successfully deleted!");
      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: "Error deleting product" };
    }
  },
  async updateProduct(newProduct) {
    const query =
      'UPDATE "product" SET name?, calories=?, proteins=?, fats=?, carbs=? WHERE product_id=?';
    const params = [
      newProduct.name,
      newProduct.calories,
      newProduct.proteins,
      newProduct.fats,
      newProduct.carbs,
      newProduct.product_id,
    ];
    try {
      await client.execute(query, params, { prepare: true });
      console.log("Product updated successfully:", newProduct);
      return { success: true, message: "Product updated successfully" };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false, message: "Error updating product" };
    }
  },
  async getProductById(id) {
    const query = 'SELECT * FROM "product" WHERE product_id=?';
    const params = [id];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const product = result.rows[0];
        console.log("Product found:", product);
        return { success: true, product };
      } else {
        console.error("Product not found");
        return { success: false, message: "Product not found" };
      }
    } catch (error) {
      console.error("Error getting product:", error);
      return { success: false, message: "Error getting product" };
    }
  },
  async getAllProducts() {
    const query = 'SELECT * FROM "product"';

    try {
      const result = await client.execute(query, [], { prepare: true });

      if (result.rows.length > 0) {
        const products = result.rows;
        console.log("Products found:", products);
        return { success: true, products };
      } else {
        console.error("No products found");
        return { success: false, message: "No products found" };
      }
    } catch (error) {
      console.error("Error getting products:", error);
      return { success: false, message: "Error getting products" };
    }
  },
};

module.exports = Product;

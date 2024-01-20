const cassandra = require("cassandra-driver");
const { Uuid } = require("cassandra-driver").types;
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
  .then(() => console.log("Connected to Cassandra in SHOPPING LIST SERVICE"))
  .catch((err) => console.error("Error connecting to Cassandra", err));

const ShoppingList = {
  async addShoppingList(user_id, title) {
    const query =
      "INSERT INTO shoppinglist (user_id, list_id, products,title) VALUES (?, uuid(),[], ?)";
    const params = [user_id, title];

    try {
      console.log(params);
      await client.execute(query, params, { prepare: true });
      console.log("Shopping list added successfully:", {
        user_id,
        title,
      });
      return { success: true, message: "Shopping list added successfully" };
    } catch (error) {
      console.error("Error adding shopping list:", error);
      return { success: false, message: "Error adding shopping list" };
    }
  },

  async deleteShoppingList(user_id, list_id) {
    const query = "DELETE FROM ShoppingList WHERE user_id=? AND list_id=?";
    const params = [user_id, list_id];

    try {
      await client.execute(query, params, { prepare: true });
      console.log("Shopping list deleted successfully:", { user_id, list_id });
      return { success: true, message: "Shopping list deleted successfully" };
    } catch (error) {
      console.error("Error deleting shopping list:", error);
      return { success: false, message: "Error deleting shopping list" };
    }
  },

  async getShoppingListsForUser(user_id) {
    const query =
      "SELECT list_id,title, products FROM ShoppingList WHERE user_id=?";
    const params = [user_id];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const shoppingLists = result.rows.map((row) => ({
          list_id: row.list_id,
          title: row.title,
          products: row.products || [],
        }));
        return { success: true, shoppingLists };
      } else {
        console.log("Shopping lists not found for user:", user_id);
        return { success: true, shoppingLists: [] };
      }
    } catch (error) {
      console.error("Error getting shopping lists for user:", error);
      return {
        success: false,
        message: "Error getting shopping lists for user",
      };
    }
  },
  async addProductToList(user_id, list_id, product_id) {
    const checkQuery =
      "SELECT products FROM ShoppingList WHERE user_id=? AND list_id=?";
    const checkParams = [user_id, list_id];

    try {
      const checkResult = await client.execute(checkQuery, checkParams, {
        prepare: true,
      });

      if (checkResult.rows.length > 0) {
        const uuidProducts = checkResult.rows[0].products || [];
        const existingProducts =
          uuidProducts.map((uuid) => uuid.toString()) || [];
        if (existingProducts.includes(product_id)) {
          console.log("Product is already in the shopping list:", {
            user_id,
            list_id,
            productId: product_id,
          });
          return {
            success: false,
            message: "Product is already in the shopping list",
          };
        }

        const updateQuery =
          "UPDATE ShoppingList SET products = products + ? WHERE user_id=? AND list_id=?";

        const productUuid = Uuid.fromString(product_id);

        const updateParams = [[productUuid], user_id, list_id];

        await client.execute(updateQuery, updateParams, { prepare: true });
        console.log("Product added to shopping list successfully:", {
          user_id,
          list_id,
          productId: product_id,
        });
        return {
          success: true,
          message: "Product added to shopping list successfully",
        };
      } else {
        console.error("Shopping list not found:", { user_id, list_id });
        return {
          success: false,
          message: "Shopping list not found",
        };
      }
    } catch (error) {
      console.error("Error adding product to shopping list:", error);
      return {
        success: false,
        message: "Error adding product to shopping list",
      };
    }
  },

  async removeProductFromList(user_id, list_id, productId) {
    const query =
      "UPDATE ShoppingList SET products = products - ? WHERE user_id=? AND list_id=?";
    const params = [[productId], user_id, list_id];

    try {
      await client.execute(query, params, { prepare: true });
      console.log("Product removed from shopping list successfully:", {
        user_id,
        list_id,
        productId,
      });
      return {
        success: true,
        message: "Product removed from shopping list successfully",
      };
    } catch (error) {
      console.error("Error removing product from shopping list:", error);
      return {
        success: false,
        message: "Error removing product from shopping list",
      };
    }
  },

  async getProductsInList(user_id, list_id) {
    const query =
      "SELECT products,title FROM ShoppingList WHERE user_id=? AND list_id=?";
    const params = [user_id, list_id];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const products = result.rows[0].products || [];
        const title = result.rows[0].title;
        console.log("Products found in shopping list:", {
          user_id,
          list_id,
          products,
          title,
        });
        return { success: true, products, title };
      } else {
        console.error("Shopping list not found:", { user_id, list_id });
        return { success: false, message: "Shopping list not found" };
      }
    } catch (error) {
      console.error("Error getting products in shopping list:", error);
      return {
        success: false,
        message: "Error getting products in shopping list",
      };
    }
  },
};
module.exports = ShoppingList;

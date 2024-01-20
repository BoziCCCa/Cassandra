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
  .then(() => console.log("Connected to Cassandra in FAVORITE SERVICE"))
  .catch((err) => console.error("Error connecting to Cassandra", err));

const Favorite = {
  async addFavorite(user_id, recipe_id) {
    const query = "INSERT INTO Favorite (user_id, recipe_id) VALUES (?, ?)";
    const params = [user_id, recipe_id];

    try {
      await client.execute(query, params, { prepare: true });
      console.log("Favorite added successfully:", {
        user_id: user_id,
        recipe_id: recipe_id,
      });
      return { success: true, message: "Favorite added successfully" };
    } catch (error) {
      console.error("Error adding favorite:", error);
      return { success: false, message: "Error adding favorite" };
    }
  },

  async deleteFavorite(user_id, recipe_id) {
    const query =
      "DELETE FROM Favorite WHERE user_id=? AND recipe_id=? IF EXISTS";
    const params = [user_id, recipe_id];

    try {
      await client.execute(query, params, { prepare: true });
      console.log("Favorite deleted successfully:", {
        user_id: user_id,
        recipe_id: recipe_id,
      });
      return { success: true, message: "Favorite deleted successfully" };
    } catch (error) {
      console.error("Error deleting favorite:", error);
      return { success: false, message: "Error deleting favorite" };
    }
  },

  async getFavoritesForUser(user_id) {
    const query = "SELECT * FROM Favorite WHERE user_id=?";
    const params = [user_id];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const favorites = result.rows.map((row) => ({
          user_id: row.user_id,
          recipe_id: row.recipe_id,
        }));
        console.log("Favorites found for user:", {
          user_id: user_id,
          favorites,
        });
        return { success: true, favorites };
      } else {
        console.log("Favorites not found for user:", user_id);
        return { success: true, favorites: [] };
      }
    } catch (error) {
      console.error("Error getting favorites for user:", error);
      return { success: false, message: "Error getting favorites for user" };
    }
  },
  async getFavorite(user_id, recipte_id) {
    const query = "SELECT * FROM Favorite WHERE user_id=? and recipe_id=?";
    const params = [user_id, recipte_id];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const favorite = result.rows[0];
        console.log("Favorite found for user:", {
          user_id: user_id,
          favorite,
        });
        return { success: true, favorite };
      } else {
        console.error("Favorite not found for user:", user_id);
        return { success: false, message: "Favorite not found for user" };
      }
    } catch (error) {
      console.error("Error getting favorite for user:", error);
      return { success: false, message: "Error getting favorite for user" };
    }
  },
};

module.exports = Favorite;

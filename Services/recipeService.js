const cassandra = require("cassandra-driver");
const { Uuid } = require("cassandra-driver").types;
const { v4: uuid } = require("uuid");
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
  .then(() => console.log("Connected to Cassandra in RECIPE SERVICE"))
  .catch((err) => console.error("Error connecting to Cassandra", err));

const Recipe = {
  async addRecipe(newRecipe) {
    const recipeId = uuid();
    const createdAt = new Date();

    const mainQuery =
      "INSERT INTO Recipe (recipe_id, title, photo, ingredients, instructions, creator_user_id, meal_type, taste_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const mainParams = [
      recipeId,
      newRecipe.title,
      newRecipe.photo,
      newRecipe.ingredients,
      newRecipe.instructions,
      newRecipe.creator_user_id,
      newRecipe.meal_type,
      newRecipe.taste_type,
      createdAt,
    ];

    const userQuery =
      "INSERT INTO RecipeByUser (creator_user_id, recipe_id, title, photo, ingredients, instructions, meal_type, taste_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const userParams = [
      newRecipe.creator_user_id,
      recipeId,
      newRecipe.title,
      newRecipe.photo,
      newRecipe.ingredients,
      newRecipe.instructions,
      newRecipe.meal_type,
      newRecipe.taste_type,
      createdAt,
    ];

    // Insert into the RecipeByType table
    const typeQuery =
      "INSERT INTO RecipeByType (recipe_id, title, photo, ingredients, instructions, creator_user_id, meal_type, taste_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const typeParams = [
      recipeId,
      newRecipe.title,
      newRecipe.photo,
      newRecipe.ingredients,
      newRecipe.instructions,
      newRecipe.creator_user_id,
      newRecipe.meal_type,
      newRecipe.taste_type,
      createdAt,
    ];

    // Insert into the RecipeByTasteType table
    const tasteTypeQuery =
      "INSERT INTO RecipeByTasteType (recipe_id, title, photo, ingredients, instructions, creator_user_id, meal_type, taste_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const tasteTypeParams = [
      recipeId,
      newRecipe.title,
      newRecipe.photo,
      newRecipe.ingredients,
      newRecipe.instructions,
      newRecipe.creator_user_id,
      newRecipe.meal_type,
      newRecipe.taste_type,
      createdAt,
    ];

    // Insert into the RecipeByMealType table
    const mealTypeQuery =
      "INSERT INTO RecipeByMealType (recipe_id, title, photo, ingredients, instructions, creator_user_id, meal_type, taste_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const mealTypeParams = [
      recipeId,
      newRecipe.title,
      newRecipe.photo,
      newRecipe.ingredients,
      newRecipe.instructions,
      newRecipe.creator_user_id,
      newRecipe.meal_type,
      newRecipe.taste_type,
      createdAt,
    ];

    try {
      await client.batch(
        [
          { query: mainQuery, params: mainParams },
          { query: userQuery, params: userParams },
          { query: typeQuery, params: typeParams },
          { query: tasteTypeQuery, params: tasteTypeParams },
          { query: mealTypeQuery, params: mealTypeParams },
        ],
        { prepare: true }
      );
      console.log("Recipe added successfully:", newRecipe);
      return { success: true, message: "Recipe added successfully" };
    } catch (error) {
      console.error("Error adding recipe:", error);
      return { success: false, message: "Error adding recipe" };
    }
  },

  async deleteRecipe(id) {
    try {
      const selectQuery = "SELECT * FROM Recipe WHERE recipe_id=?";
      const selectParams = [id];
      const result = await client.execute(selectQuery, selectParams, {
        prepare: true,
      });

      if (result.rows.length === 0) {
        console.error("Recipe not found for deletion:", id);
        return { success: false, message: "Recipe not found for deletion" };
      }

      const recipe = result.rows[0];

      const batchQueries = [
        {
          query: "DELETE FROM recipe WHERE recipe_id=?",
          params: [id],
        },
        {
          query:
            "DELETE FROM recipebyuser WHERE creator_user_id=? AND created_at=? AND recipe_id=? ",
          params: [recipe.creator_user_id, recipe.created_at, id],
        },
        {
          query:
            "DELETE FROM recipebytype WHERE taste_type=? AND meal_type=? AND created_at=? AND recipe_id=?",
          params: [recipe.taste_type, recipe.meal_type, recipe.created_at, id],
        },
        {
          query:
            "DELETE FROM recipebytastetype WHERE taste_type=? AND created_at=? AND recipe_id=?",
          params: [recipe.taste_type, recipe.created_at, id],
        },
        {
          query:
            "DELETE FROM recipebymealtype WHERE meal_type=? AND created_at=? AND recipe_id=?",
          params: [recipe.meal_type, recipe.created_at, id],
        },
        {
          query: "DELETE FROM Favorite WHERE user_id=? AND recipe_id=?",
          params: [recipe.creator_user_id, id],
        },
      ];

      await client.batch(batchQueries, { prepare: true });

      return { success: true, message: "Recipe deleted successfully" };
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return { success: false, message: "Error deleting recipe" };
    }
  },
  async updateRecipe(updatedRecipe) {
    try {
      const selectQuery = "SELECT * FROM Recipe WHERE recipe_id=?";
      const selectParams = [updatedRecipe.recipe_id];
      const result = await client.execute(selectQuery, selectParams, {
        prepare: true,
      });

      if (result.rows.length === 0) {
        console.error("Recipe not found for update:", updatedRecipe.recipe_id);
        return { success: false, message: "Recipe not found for update" };
      }

      const existingRecipe = result.rows[0];

      const updateQuery =
        "UPDATE Recipe SET title=?, photo=?, ingredients=?, instructions=?, meal_type=?, taste_type=? WHERE recipe_id=? AND created_at=?";
      const updateParams = [
        updatedRecipe.title,
        updatedRecipe.photo,
        updatedRecipe.ingredients,
        updatedRecipe.instructions,
        updatedRecipe.meal_type,
        updatedRecipe.taste_type,
        updatedRecipe.recipe_id,
        existingRecipe.created_at,
      ];

      await client.execute(updateQuery, updateParams, { prepare: true });

      const deleteByUserQuery =
        "DELETE FROM RecipeByUser WHERE creator_user_id=? AND recipe_id=? AND created_at=?";
      const deleteByUserParams = [
        existingRecipe.creator_user_id,
        existingRecipe.recipe_id,
        existingRecipe.created_at,
      ];
      await client.execute(deleteByUserQuery, deleteByUserParams, {
        prepare: true,
      });

      const deleteByTypeQuery =
        "DELETE FROM RecipeByType WHERE taste_type=? AND meal_type=? AND recipe_id=? AND created_at=?";
      const deleteByTypeParams = [
        existingRecipe.taste_type,
        existingRecipe.meal_type,
        existingRecipe.recipe_id,
        existingRecipe.created_at,
      ];
      await client.execute(deleteByTypeQuery, deleteByTypeParams, {
        prepare: true,
      });

      // Delete from RecipeByTasteType
      const deleteByTasteTypeQuery =
        "DELETE FROM RecipeByTasteType WHERE taste_type=? AND created_at=? AND recipe_id=?";
      const deleteByTasteTypeParams = [
        existingRecipe.taste_type,
        existingRecipe.created_at,
        existingRecipe.recipe_id,
      ];
      await client.execute(deleteByTasteTypeQuery, deleteByTasteTypeParams, {
        prepare: true,
      });

      // Delete from RecipeByMealType
      const deleteByMealTypeQuery =
        "DELETE FROM RecipeByMealType WHERE meal_type=? AND created_at=? AND recipe_id=?";
      const deleteByMealTypeParams = [
        existingRecipe.meal_type,
        existingRecipe.created_at,
        existingRecipe.recipe_id,
      ];
      await client.execute(deleteByMealTypeQuery, deleteByMealTypeParams, {
        prepare: true,
      });

      const insertByUserQuery =
        "INSERT INTO RecipeByUser (creator_user_id, recipe_id, title, photo, ingredients, instructions, meal_type, taste_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertByUserParams = [
        updatedRecipe.creator_user_id,
        updatedRecipe.recipe_id,
        updatedRecipe.title,
        updatedRecipe.photo,
        updatedRecipe.ingredients,
        updatedRecipe.instructions,
        updatedRecipe.meal_type,
        updatedRecipe.taste_type,
        existingRecipe.created_at,
      ];
      await client.execute(insertByUserQuery, insertByUserParams, {
        prepare: true,
      });

      const insertByTypeQuery =
        "INSERT INTO RecipeByType (taste_type, meal_type, recipe_id, title, photo, ingredients, instructions, creator_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertByTypeParams = [
        updatedRecipe.taste_type,
        updatedRecipe.meal_type,
        updatedRecipe.recipe_id,
        updatedRecipe.title,
        updatedRecipe.photo,
        updatedRecipe.ingredients,
        updatedRecipe.instructions,
        updatedRecipe.creator_user_id,
        existingRecipe.created_at,
      ];
      await client.execute(insertByTypeQuery, insertByTypeParams, {
        prepare: true,
      });

      const insertByTasteTypeQuery =
        "INSERT INTO RecipeByTasteType (taste_type, recipe_id, title, photo, ingredients, instructions, creator_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const insertByTasteTypeParams = [
        updatedRecipe.taste_type,
        updatedRecipe.recipe_id,
        updatedRecipe.title,
        updatedRecipe.photo,
        updatedRecipe.ingredients,
        updatedRecipe.instructions,
        updatedRecipe.creator_user_id,
        existingRecipe.created_at,
      ];
      await client.execute(insertByTasteTypeQuery, insertByTasteTypeParams, {
        prepare: true,
      });

      const insertByMealTypeQuery =
        "INSERT INTO RecipeByMealType (meal_type, recipe_id, title, photo, ingredients, instructions, creator_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const insertByMealTypeParams = [
        updatedRecipe.meal_type,
        updatedRecipe.recipe_id,
        updatedRecipe.title,
        updatedRecipe.photo,
        updatedRecipe.ingredients,
        updatedRecipe.instructions,
        updatedRecipe.creator_user_id,
        existingRecipe.created_at,
      ];
      await client.execute(insertByMealTypeQuery, insertByMealTypeParams, {
        prepare: true,
      });

      return { success: true, message: "Recipe updated successfully" };
    } catch (error) {
      console.error("Error updating recipe:", error);
      return { success: false, message: "Error updating recipe" };
    }
  },

  async getRecipeById(id) {
    const query = 'SELECT * FROM "recipe" WHERE recipe_id=?';
    const params = [id];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const recipe = result.rows[0];
        return { success: true, recipe: recipe };
      } else {
        console.error("Recipe not found");
        return { success: false, message: "Recipe not found" };
      }
    } catch (error) {
      console.error("Error getting recipe:", error);
      return { success: false, message: "Error getting recipe" };
    }
  },
  async getAllRecipes() {
    const query = 'SELECT * FROM "recipe"';
    try {
      const result = await client.execute(query, { prepare: true });

      if (result.rows.length > 0) {
        const recipes = result.rows.map((row) => ({
          recipe_id: row.recipe_id,
          title: row.title,
          photo: row.photo,
          ingredients: row.ingredients,
          instructions: row.instructions,
          creator_user_id: row.creator_user_id,
          meal_type: row.meal_type,
          taste_type: row.taste_type,
        }));

        return { success: true, recipes };
      } else {
        console.log("Recipes not found");
        return { success: true, recipes: [] };
      }
    } catch (error) {
      console.error("Error getting recipes:", error);
      return { success: false, message: "Error getting recipes" };
    }
  },
  async getUserRecipes(userId) {
    const query = 'SELECT * FROM "recipebyuser" WHERE creator_user_id = ?';
    const params = [userId];

    try {
      const result = await client.execute(query, params, { prepare: true });

      if (result.rows.length > 0) {
        const recipes =
          result.rows.map((row) => ({
            recipe_id: row.recipe_id,
            title: row.title,
            photo: row.photo,
            ingredients: row.ingredients,
            instructions: row.instructions,
            creator_user_id: row.creator_user_id,
            meal_type: row.meal_type,
            taste_type: row.taste_type,
            created_at: row.created_at,
          })) || [];

        return { success: true, recipes };
      } else {
        console.error(`Recipes not found for user ${userId}`);
        return {
          success: true,
          recipes: [],
        };
      }
    } catch (error) {
      console.error(`Error getting recipes for user ${userId}:`, error);
      return {
        success: false,
        message: `Error getting recipes for user ${userId}`,
      };
    }
  },
  async getRecommendedRecipes(user_id) {
    try {
      const favoritedRecipesQuery = `SELECT recipe_id FROM Favorite WHERE user_id = ?`;
      const favoritedRecipesResult = await client.execute(
        favoritedRecipesQuery,
        [user_id]
      );

      if (favoritedRecipesResult.rows.length === 0) {
        return {
          success: true,
          data: [],
          message: `No favorited recipes for user ${user_id}`,
        };
      }

      const favoritedRecipeIds = favoritedRecipesResult.rows.map((row) =>
        row.recipe_id.toString()
      );
      console.log("Favorite recipes IDs: ", favoritedRecipeIds);

      const mealTypeCounts = {};
      const tasteTypeCounts = {};
      for (const recipeId of favoritedRecipeIds) {
        const recipeInfoQuery = `SELECT recipe_id, meal_type, taste_type FROM Recipe WHERE recipe_id = ?`;

        const recipeInfoResult = await client.execute(recipeInfoQuery, [
          recipeId,
        ]);

        if (recipeInfoResult.rows.length > 0) {
          const recipe = recipeInfoResult.rows[0];
          const mealType = recipe.meal_type;
          const tasteType = recipe.taste_type;

          mealTypeCounts[mealType] = (mealTypeCounts[mealType] || 0) + 1;
          tasteTypeCounts[tasteType] = (tasteTypeCounts[tasteType] || 0) + 1;
        }
      }

      const mostCommonMealType = this.getMaxKey(mealTypeCounts, "mealType");
      const mostCommonTasteType = this.getMaxKey(tasteTypeCounts, "tasteType");

      console.log("Most common meal type:", mostCommonMealType);
      console.log("Most common taste type:", mostCommonTasteType);

      const mealTypeRecipesQuery = `SELECT * FROM RecipeByMealType WHERE meal_type = ?`;
      const mealTypeRecipesResult = await client.execute(mealTypeRecipesQuery, [
        mostCommonMealType,
      ]);

      const mealTypeRecipes = mealTypeRecipesResult.rows.map(
        (row) => row.recipe_id
      );

      const tasteTypeRecipesQuery = `SELECT * FROM RecipeByTasteType WHERE taste_type = ?`;
      const tasteTypeRecipesResult = await client.execute(
        tasteTypeRecipesQuery,
        [mostCommonTasteType]
      );

      const tasteTypeRecipes = tasteTypeRecipesResult.rows.map(
        (row) => row.recipe_id
      );

      console.log("Taste Type Recipes:", tasteTypeRecipes);
      console.log("Meal Type Recipes:", mealTypeRecipes);

      const mealTypeRecipesSet = new Set(
        mealTypeRecipes.map((uuid) => uuid.toString())
      );
      const tasteTypeRecipesSet = new Set(
        tasteTypeRecipes.map((uuid) => uuid.toString())
      );

      const recommendedRecipesSet = new Set([
        ...mealTypeRecipesSet,
        ...tasteTypeRecipesSet,
      ]);
      const recommendedRecipesArray = Array.from(recommendedRecipesSet);

      const filteredRecommendedRecipes = recommendedRecipesArray.filter(
        (recipeId) => !favoritedRecipeIds.includes(recipeId)
      );

      console.log("Filtered Recommendations: ", filteredRecommendedRecipes);

      return {
        success: true,
        data: filteredRecommendedRecipes,
        message: `Recommended recipes fetched successfully for user ${user_id}`,
      };
    } catch (error) {
      console.error("Error fetching recommended recipes:", error);
      return {
        success: false,
        data: null,
        message: `Error fetching recommended recipes for user ${user_id}`,
      };
    }
  },
  getMaxKey(obj, type) {
    return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b), type);
  },
};

module.exports = Recipe;

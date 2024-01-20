import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import userContext from "../../userContext";
import FavoriteRecipe from "./FavoriteRecipe";

const MyRecommendations = () => {
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [user, setUSer] = useContext(userContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/recipes/recommendations/${user.email}`
        );
        const { success, message, data } = response.data;
        if (success) {
          const recommendedRecipes = [];

          // Fetch each recipe by ID
          for (const recipeId of data) {
            const recipeResponse = await axios.get(
              `http://localhost:3000/recipes/${recipeId}`
            );

            const { success: recipeSuccess, recipe: recipeData } =
              recipeResponse.data;

            if (recipeSuccess) {
              recommendedRecipes.push(recipeData);
            } else {
              console.error(`Error fetching recipe with ID ${recipeId}`);
            }
          }

          setRecommendedRecipes(recommendedRecipes);
        } else {
          console.error("Error fetching recommended recipes:", message);
        }
      } catch (error) {
        console.error("Error fetching recommended recipes:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRecommendedRecipes();
  }, [user]);

  return (
    <div>
      {user && (
        <div>
          <h2 className="text-3xl font-bold mb-4 flex justify-center">
            Recommended Recipes
          </h2>
          {loading ? (
            <p>Loading recommendations...</p>
          ) : recommendedRecipes.length > 0 ? (
            <ul className="flex flex-col justify-center items-center">
              {recommendedRecipes.map((recipe) => (
                <FavoriteRecipe
                  key={recipe.recipe_id}
                  recipe_id={recipe.recipe_id}
                />
              ))}
            </ul>
          ) : (
            <p className="flex justify-center">No recommendations available.</p>
          )}
        </div>
      )}
      {!user && (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <p className="text-center">
            Please log in to view your recommendations.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyRecommendations;

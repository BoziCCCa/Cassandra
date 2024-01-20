import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductListForRecipe from "./ProductListForRecipe";
import userContext from "../../userContext";
import EmptyStar from "../Components/EmptyStar";
import FullStar from "../Components/FullStar";

const Recipe = () => {
  const { recipeId: recipe_id } = useParams();
  const [user, setUser] = useContext(userContext);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [selectedShoppingList, setSelectedShoppingList] = useState(null);
  const [userShoppingLists, setUserShoppingLists] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/recipes/${recipe_id}`
        );

        const { success, recipe } = response.data;

        if (success) {
          setRecipeDetails(recipe);
        } else {
          console.error(
            "Error fetching recipe details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error.message);
      }
    };

    const fetchUserShoppingLists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/shopping-lists/${user.email}`
        );
        const { success, shoppingLists } = response.data;
        if (success) {
          setUserShoppingLists(shoppingLists);
          console.log(shoppingLists[0]);
          setSelectedShoppingList(shoppingLists[0].list_id);
        } else {
          console.error(
            "Error fetching shopping lists:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching shopping lists:", error.message);
      }
    };

    const fetchIsFavorite = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/favorites/${user.email}/${recipe_id}`
        );

        const { success } = response.data;

        if (success) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error.message);
      }
    };
    fetchIsFavorite();
    fetchUserShoppingLists();
    fetchRecipeDetails();
  }, [recipe_id, user.email]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        const response = await axios.delete(
          `http://localhost:3000/favorites/${user.email}/${recipe_id}`
        );
        const { success, message } = response.data;
        if (success) {
          alert("Removed from favorites!");
        } else {
          console.error(
            "Error removing from favorites:",
            response.data.message
          );
        }
      } else {
        const response = await axios.post("http://localhost:3000/favorites/", {
          user_id: user.email,
          recipe_id: recipe_id,
        });
        const { success, message } = response.data;
        if (success) {
          alert("Added to favorites!");
        } else {
          console.error("Error adding to favorites:", response.data.message);
        }
      }
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      {recipeDetails ? (
        <div className="w-1/2 mx-auto p-6 bg-white rounded-md shadow-md ">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold mb-4">{recipeDetails.title}</h2>
            <button
              onClick={handleToggleFavorite}
              className="ml-2 cursor-pointer"
            >
              {isFavorite ? <FullStar /> : <EmptyStar />}
            </button>
          </div>

          <img
            src={recipeDetails.photo}
            alt={recipeDetails.title}
            className="w-full h-auto mb-4 rounded-md"
          />

          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
            <p>{recipeDetails.instructions}</p>
          </div>
          <div className="mb-4">
            <p>
              <span className="font-semibold">Meal Type:</span>{" "}
              {recipeDetails.meal_type}
            </p>
          </div>

          <div className="mb-4">
            <p>
              <span className="font-semibold">Taste Type:</span>{" "}
              {recipeDetails.taste_type}
            </p>
          </div>
          <div className="mb-4 flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-2">
              Select Shopping List:
            </h3>
            <select
              className="p-2 border rounded-md mb-4"
              value={selectedShoppingList}
              onChange={(e) => setSelectedShoppingList(e.target.value)}
            >
              {userShoppingLists.map((list) => (
                <option key={list.list_id} value={list.list_id}>
                  {list.title}
                </option>
              ))}
            </select>
            <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
            <ProductListForRecipe
              productIds={recipeDetails.ingredients}
              selectedShoppingList={selectedShoppingList}
            />
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Recipe;

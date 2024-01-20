import React, { useState, useEffect, useContext } from "react";
import userContext from "../../userContext";
import AddRecipeForm from "./AddRecipeForm";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../firebaseSetup";
import { Link } from "react-router-dom";
const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [recipeAdded, setRecipeAdded] = useState(false);

  const onRemove = async (recipe_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/recipes/${recipe_id}`
      );
      if (response.data.success) {
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.recipe_id !== recipe_id)
        );
        console.log(`Recipe deleted successfully`);
      } else {
        console.error(
          `Error deleting recipe ${recipe_id}: ${response.data.message}`
        );
      }
    } catch (error) {
      console.error(`Error deleting recipe ${recipe_id}:`, error.message);
    }
  };

  const onAddRecipe = async (newRecipe) => {
    try {
      newRecipe.creator_user_id = user.email;
      if (newRecipe.photo) {
        const randomId = Math.floor(Math.random() * 10000) + 1;
        const imageRef = ref(
          storage,
          `recipe_photos/${newRecipe.photo.name}${randomId}`
        );
        await uploadBytes(imageRef, newRecipe.photo);
        const photoURL = await getDownloadURL(imageRef);
        newRecipe.photo = photoURL;
      }

      const recipeResponse = await axios.post(
        "http://localhost:3000/recipes",
        newRecipe
      );
      const recipeData = await recipeResponse.data;
      if (recipeData.success) {
        setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
        setRecipeAdded(!recipeAdded);
      } else {
        console.error(
          "Error adding recipe to the database:",
          recipeData.message
        );
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/recipes/by-user/${user.email}`
        );
        const data = await response.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    if (user) fetchRecipes();
  }, [user, recipeAdded]);

  return (
    <div>
      {user && (
        <div className="max-w-2xl mx-auto mt-8">
          <AddRecipeForm onAddRecipe={onAddRecipe} />
          <h2 className="text-3xl font-bold mb-4 text-center">My Recipes</h2>
          {recipes.length === 0 ? (
            <p className="text-center">You currently have no recipes.</p>
          ) : (
            <ul className="">
              {recipes.map((recipe) => (
                <li
                  key={recipe.recipe_id + "key"}
                  className="border border-gray-300 mb-4 rounded flex justify-between"
                  style={{ width: "100%", height: "150px" }}
                >
                  <div className="flex justify-start">
                    <div style={{ width: "150px", height: "150px" }}>
                      <img
                        src={recipe.photo}
                        style={{ width: "150px", height: "150px" }}
                      ></img>
                    </div>
                    <div className="m-4 flex flex-col justify-between">
                      <h3 className="text-xl font-semibold mb-2">
                        {recipe.title}
                      </h3>
                      <Link
                        to={`/recipes/${recipe.recipe_id}`}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-violet-700 rounded-lg hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
                      >
                        Read more
                        <svg
                          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-end mr-10">
                    <button
                      onClick={() => onRemove(recipe.recipe_id)}
                      className="text-red-500 hover:text-red-700 mr-"
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!user && (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <p className="text-center">Please log in to view your recipes.</p>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;

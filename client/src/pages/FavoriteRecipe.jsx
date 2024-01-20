import React, { useState, useEffect, useContext } from "react";
import userContext from "../../userContext";
import axios from "axios";
import { Link } from "react-router-dom";

const FavoriteRecipe = ({ recipe_id }) => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
            `Error fetching details for recipe ${recipe_id}:`,
            response.data.message
          );
        }
        setLoading(false);
      } catch (error) {
        console.error(
          `Error fetching details for recipe ${recipe_id}:`,
          error.message
        );
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipe_id]);

  return (
    <li
      className="border border-gray-300 mb-4 rounded flex justify-between"
      style={{ width: "50%", height: "150px" }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex justify-start">
          <div style={{ width: "150px", height: "150px" }}>
            <img
              src={recipeDetails.photo}
              style={{ width: "150px", height: "150px" }}
              alt={recipeDetails.title}
            ></img>
          </div>
          <div className="m-4 flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-2">
              {recipeDetails.title}
            </h3>
            <Link
              to={`/recipes/${recipeDetails.recipe_id}`}
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
      )}
    </li>
  );
};

export default FavoriteRecipe;

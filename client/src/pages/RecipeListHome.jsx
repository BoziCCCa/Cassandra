import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/recipes");
      const { success, recipes } = response.data;
      if (success) {
        setRecipes(recipes);
      } else {
        console.error("Error fetching recipes:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 flex justify-center">
        Recipe List
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.recipe_id}
            className="min-w-[200px] max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4"
          >
            <img
              className="rounded-t-lg w-full"
              src={recipe.photo}
              alt=""
              style={{ height: "200px" }}
            />

            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {recipe.title}
              </h5>
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
        ))}
      </div>
    </div>
  );
};

export default RecipeList;

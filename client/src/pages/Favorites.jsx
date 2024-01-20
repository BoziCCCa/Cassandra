import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import userContext from "../../userContext";
import FavoriteRecipe from "./FavoriteRecipe";

const Favorites = () => {
  const [user, setUser] = useContext(userContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:3000/favorites/${user.email}`
          );
          const { success, favorites } = response.data;

          if (success) {
            setFavorites(favorites);
          } else {
            console.error("Error fetching favorites:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error.message);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div>
      {user && (
        <div>
          <h2 className="text-3xl font-bold mb-4 flex justify-center">
            My Favorites
          </h2>
          {favorites.length === 0 ? (
            <p className="text-center">You don't have any favorites yet.</p>
          ) : (
            <ul className="flex flex-col justify-center items-center">
              {favorites.map((favorite) => (
                <FavoriteRecipe
                  key={favorite.recipe_id}
                  recipe_id={favorite.recipe_id}
                />
              ))}
            </ul>
          )}
        </div>
      )}
      {!user && (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <p className="text-center">Please log in to view your favorites.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;

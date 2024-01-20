import React, { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "../../userContext";

const Header = () => {
  const [user, setUser] = useContext(userContext);

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <header className="bg-violet-500 p-4">
      <div className="container mx-auto">
        <nav className="">
          <div
            className={`flex flex-row ${
              user ? "justify-between" : "justify-end"
            }`}
          >
            {user && (
              <ul className="flex">
                <li className="mr-4">
                  <Link to="/" className="text-white hover:text-gray-300">
                    Recipes
                  </Link>
                </li>
                <li className="mr-4">
                  <Link
                    to="/shoppingLists"
                    className="text-white hover:text-gray-300"
                  >
                    My Shopping Lists
                  </Link>
                </li>
                <li className="mr-4">
                  <Link
                    to="/myRecipes"
                    className="text-white hover:text-gray-300"
                  >
                    My Recipes
                  </Link>
                </li>
                <li className="mr-4">
                  <Link
                    to="/myFavorites"
                    className="text-white hover:text-gray-300"
                  >
                    My Favorites
                  </Link>
                </li>
                <li className="mr-4">
                  <Link
                    to="/myRecommendations"
                    className="text-white hover:text-gray-300"
                  >
                    My Recommendations
                  </Link>
                </li>
              </ul>
            )}
            {!user ? (
              <div className="flex flex-row gap-10">
                <Link className="text-white hover:text-gray-300" to="/login">
                  Login
                </Link>
                <Link className="text-white hover:text-gray-300" to="/register">
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex flex-row gap-10">
                <Link className="text-white hover:text-gray-300" to="/profile">
                  Profile
                </Link>
                <button
                  className="text-white hover:text-gray-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

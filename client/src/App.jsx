import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import userContext from "../userContext";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import ShoppingLists from "./pages/ShoppingLists";
import ShoppingList from "./pages/ShoppingList";
import MyRecipes from "./pages/MyRecipes";
import Favorites from "./pages/Favorites";
import MyRecommendations from "./pages/MyRecommendations";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser) {
        setUser(parsedUser);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchUserFromLocalStorage();
  }, [setUser]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <userContext.Provider value={[user, setUser]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipes/:recipeId" element={<Recipe />} />
            <Route path="/shoppingLists" element={<ShoppingLists />} />
            <Route path="/shoppingList/:list_id" element={<ShoppingList />} />
            <Route path="/myRecipes" element={<MyRecipes />} />
            <Route path="/myFavorites" element={<Favorites />} />
            <Route path="/myRecommendations" element={<MyRecommendations />} />
          </Route>
        </Routes>
      </userContext.Provider>
    );
  }
}

export default App;

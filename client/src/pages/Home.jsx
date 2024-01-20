import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeList from "./RecipeListHome";
import userContext from "../../userContext";

const Home = () => {
  const [user, setUser] = useContext(userContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <>
      {user && <RecipeList></RecipeList>}
      {!user && (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <p className="text-center">Please log in to view recipes.</p>
        </div>
      )}
    </>
  );
};

export default Home;

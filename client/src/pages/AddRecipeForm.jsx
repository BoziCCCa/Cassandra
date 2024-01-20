import React, { useState, useEffect, useContext } from "react";
import userContext from "../../userContext";
import axios from "axios";

const AddRecipeForm = ({ onAddRecipe }) => {
  const [user, setUser] = useContext(userContext);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    photo: null,
    ingredients: [],
    instructions: "",
    meal_type: "Breakfast",
    taste_type: "Sweet",
    creator_user_id: user.email,
  });

  const [allProducts, setAllProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      const data = response.data;
      setAllProducts(data.products);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      setNewRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: e.target.files[0],
      }));
    } else {
      setNewRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: value,
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecipe(newRecipe);
    setNewRecipe({
      title: "",
      photo: null,
      ingredients: "",
      instructions: "",
      meal_type: "Breakfast",
      taste_type: "Sweet",
    });
  };

  const handleProductChange = (e) => {
    const selectedProducts = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: selectedProducts,
    }));
  };

  return (
    <form className="max-w-2xl mx-auto mt-8" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-bold mb-4 text-center">Add a New Recipe</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600">Title</label>
          <input
            type="text"
            name="title"
            value={newRecipe.title}
            onChange={handleChange}
            className="p-2 border rounded-md mt-1 block w-full"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600">Photo</label>
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            className="p-2 border rounded-md mt-1 block w-full"
            accept="image/*"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-gray-600">
          Ingredients(CTRL + click to select multiple):
        </label>
        <select
          name="ingredients"
          value={newRecipe.ingredients}
          onChange={handleProductChange}
          className="p-2 border rounded-md mt-1 block w-full form-multiselect"
          multiple
          required
        >
          {allProducts.map((product) => (
            <option key={product.product_id} value={product.product_id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-gray-600">Instructions</label>
        <textarea
          name="instructions"
          value={newRecipe.instructions}
          onChange={handleChange}
          className="p-2 border rounded-md mt-1 block w-full form-textarea"
          rows="4"
          required
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-gray-600">Meal Type</label>
          <select
            name="meal_type"
            value={newRecipe.meal_type}
            onChange={handleChange}
            className="p-2 border rounded-md mt-1 block w-full form-select"
            required
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600">Taste Type</label>
          <select
            name="taste_type"
            value={newRecipe.taste_type}
            onChange={handleChange}
            className="p-2 border rounded-md mt-1 block w-full form-select"
            required
          >
            <option value="Sweet">Sweet</option>
            <option value="Savory">Savory</option>
            <option value="Spicy">Spicy</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="bg-violet-500 text-white p-2 rounded hover:bg-violet-600"
        >
          Add Recipe
        </button>
      </div>
    </form>
  );
};

export default AddRecipeForm;

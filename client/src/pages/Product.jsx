import axios from "axios";
import { useState, useContext } from "react";
import userContext from "../../userContext";

const Product = ({ product, selectedShoppingList }) => {
  const [user, setUser] = useContext(userContext);
  const addtoShoppingList = async (product_id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/shopping-lists/${user.email}/${selectedShoppingList}/addProduct/${product_id}`
      );

      const { success, message } = response.data;
      if (success) {
        alert(message);
      } else if (message == "Product is already in the shopping list") {
        alert(message);
      } else {
        console.error("Error adding product to shopping list:", message);
        // Handle error or provide feedback to the user
      }
    } catch (error) {
      console.error("Error adding product to shopping list:", error.message);
      // Handle error or provide feedback to the user
    }
  };

  return (
    <li className="mt-3">
      <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {product.name}
          </h5>
          <p>Calories: {product.calories}</p>
          <p>Proteins: {product.proteins}</p>
          <p>Fats: {product.fats}</p>
          <p>Carbs: {product.carbs}</p>
        </div>
        <button
          className="bg-green-500 text-white p-2 rounded-full shadow-md m-5"
          onClick={() => addtoShoppingList(product.product_id)}
        >
          +
        </button>
      </div>
    </li>
  );
};
export default Product;

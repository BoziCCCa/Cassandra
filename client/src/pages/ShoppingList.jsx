import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import userContext from "../../userContext";

const ShoppingList = () => {
  const { list_id } = useParams();
  const [user] = useContext(userContext);
  const [shoppingList, setShoppingList] = useState({});
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");

  const handleRemoveProduct = async (product_id) => {
    try {
      // Call the API method to remove the product from the list
      const response = await axios.put(
        `http://localhost:3000/shopping-lists/${user.email}/${list_id}/removeProduct/${product_id}`
      );

      if (response.data.success) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.product_id !== product_id)
        );
      } else {
        console.error(
          "Error removing product from shopping list:",
          response.data.message
        );
      }
    } catch (error) {
      console.error(
        "Error removing product from shopping list:",
        error.message
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/shopping-lists/${user.email}/${list_id}/products`
        );

        const { success, products, title } = response.data;
        if (success) {
          setShoppingList(response.data);

          const productDetails = await Promise.all(
            products.map(async (productId) => {
              const productResponse = await axios.get(
                `http://localhost:3000/products/${productId}`
              );
              return productResponse.data.product;
            })
          );
          setProducts(productDetails);
          setTitle(title);
        } else {
          console.error("Error fetching shopping list:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching shopping list:", error.message);
      }
    };

    fetchData();
  }, [user.email, list_id]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mt-4">{title}</h2>
      <ul className="flex flex-col items-center">
        {products.map((product, index) => (
          <li className="mt-3 w-1/3" key={`${product.product_id}_${index}`}>
            <div className="flex flex-col items-center justify-between bg-white border border-gray-200 rounded-lg md:flex-row md:max-w-xl dark:border-gray-700 dark:bg-gray-800 ">
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
                onClick={() => handleRemoveProduct(product.product_id)}
                className="mr-5"
              >
                {/* X icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="12"
                  viewBox="0 0 384 512"
                >
                  <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;

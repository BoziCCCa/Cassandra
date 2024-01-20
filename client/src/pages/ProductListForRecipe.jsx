import React, { useState, useEffect } from "react";
import axios from "axios";
import Product from "./Product";

const ProductListForRecipe = ({ productIds, selectedShoppingList }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = [];

        for (const productId of productIds) {
          const response = await axios.get(
            `http://localhost:3000/products/${productId}`
          );

          if (response.data.success) {
            productsData.push(response.data.product);
          } else {
            console.error(`Error fetching product with ID ${productId}`);
          }
        }

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [productIds]);

  return (
    <div>
      <ul className="grid grid-cols-2 gap-5">
        {products.map((product) => (
          <Product
            key={product.product_id}
            product={product}
            selectedShoppingList={selectedShoppingList}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProductListForRecipe;

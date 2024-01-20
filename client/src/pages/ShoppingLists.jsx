import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import userContext from "../../userContext";

const ShoppingLists = () => {
  const [user] = useContext(userContext);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");

  const deleteShoppingList = async (list_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/shopping-lists/${user.email}/${list_id}`
      );
      const { success, message } = response.data;
      if (success) {
        setShoppingLists((prevLists) =>
          prevLists.filter((list) => list.list_id !== list_id)
        );
      } else {
        console.error("Error deleting shopping list:", message);
      }
    } catch (error) {
      console.error("Error deleting shopping list:", error.message);
    }
  };

  const fetchShoppingLists = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/shopping-lists/${user.email}`
      );
      const { success, shoppingLists } = response.data;
      if (success) {
        setShoppingLists(shoppingLists);
      } else {
        console.error("Error fetching shopping lists:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error.message);
    }
  };

  const addNewShoppingList = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/shopping-lists`,
        {
          user_id: user.email,
          title: newListTitle,
        }
      );
      const { success, message } = response.data;
      if (success) {
        setNewListTitle("");
        fetchShoppingLists();
      } else {
        console.error("Error adding shopping list:", message);
      }
    } catch (error) {
      console.error("Error adding shopping list:", error.message);
    }
  };

  useEffect(() => {
    if (user) fetchShoppingLists();
  }, [user]);

  return (
    <div>
      {user && (
        <div>
          <div className="m-5">
            <h3>Add New Shopping List</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addNewShoppingList();
              }}
              className="mt-4"
            >
              <div className="flex items-center mb-4">
                <label htmlFor="newListTitle" className="mr-2 text-gray-700">
                  Title:
                </label>
                <input
                  type="text"
                  id="newListTitle"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="p-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600"
              >
                Add List
              </button>
            </form>
          </div>
          <h2 className="text-3xl font-bold mb-4 flex justify-center">
            Shopping Lists
          </h2>
          {shoppingLists.length > 0 ? (
            <div className="flex flex-col gap-4">
              {shoppingLists.map((list) => (
                <div
                  key={list.list_id}
                  className="ml-3 mr-3 p-1 border border-gray-300 rounded-md hover:bg-gray-100 flex flex-row items-center"
                >
                  <h3 className="flex-grow">{list.title}</h3>
                  <Link className="mx-2" to={`/shoppingList/${list.list_id}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="18"
                      viewBox="0 0 576 512"
                    >
                      <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                    </svg>
                  </Link>
                  <button
                    className="mx-2"
                    onClick={() => {
                      deleteShoppingList(list.list_id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">
              You don't have any shopping lists yet.
            </p>
          )}
        </div>
      )}
      {!user && (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
          <p className="text-center">
            Please log in to view your shopping lists.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingLists;

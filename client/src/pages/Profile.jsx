import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../../userContext";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import storage from "../../firebaseSetup";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useContext(userContext);

  const [newUsername, setNewUsername] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    setNewUsername(user ? user.username : "");
  }, [user]);

  const updateUser = async (email, updatedUser) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/`,
        updatedUser
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  // Example usage in a component or wherever needed
  const handleProfileUpdate = async () => {
    try {
      const email = user.email;
      var photo = user.photo;
      if (newProfilePicture) {
        const randomId = Math.floor(Math.random() * 10000) + 1;
        const imageRef = ref(
          storage,
          `profile_photos/${newProfilePicture.name}${randomId}`
        );
        await uploadBytes(imageRef, newProfilePicture);
        const photoURL = await getDownloadURL(imageRef);
        photo = photoURL;
      }

      const updatedUser = {
        username: newUsername,
        email: user.email,
        photo: photo,
      };

      const result = await updateUser(email, updatedUser);

      setUser({ ...user, ...updatedUser });
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));

      setNewUsername("");
      setNewProfilePicture(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const parseFileNameFromUrl = (url) => {
    const parts = url.split("/");
    return decodeURI(parts[parts.length - 1]);
  };
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      {user && (
        <div>
          <img
            src={user.photo}
            alt="Profile"
            className="rounded-full mx-auto mb-4"
            style={{ width: "100px", height: "100px" }}
          />
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email:
              </label>
              <input
                type="text"
                id="email"
                value={user.email}
                className="w-full p-2 border rounded-md"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newUsername"
                className="block text-gray-700 font-bold mb-2"
              >
                Username:
              </label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newProfilePicture"
                className="block text-gray-700 font-bold mb-2"
              >
                Change Profile Picture:
              </label>
              <input
                type="file"
                id="newProfilePicture"
                accept="image/*"
                onChange={(e) => setNewProfilePicture(e.target.files[0])}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={handleProfileUpdate}
              className="bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}
      {!user && (
        <p className="text-center">Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;

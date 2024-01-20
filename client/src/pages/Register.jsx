import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import storage from "../../firebaseSetup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (photoFile) {
      const randomId = Math.floor(Math.random() * 10000) + 1;
      const imageRef = ref(
        storage,
        `profile_photos/${photoFile.name}${randomId}`
      );
      await uploadBytes(imageRef, photoFile);
      const photoURL = await getDownloadURL(imageRef);

      const registrationData = {
        username: username,
        email: email,
        password: password,
        photo: photoURL,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/users",
          registrationData
        );
        navigate("/login");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Choose a password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="photo"
            >
              Profile Photo
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              className="w-full p-2 border rounded-md"
              onChange={(e) => handlePhotoChange(e)}
            />
          </div>
          <button
            type="submit"
            className="bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

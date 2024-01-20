import React, { useContext, useState } from "react";
import userContext from "../../userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useContext(userContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        email: email,
        password: password,
      });
      alert("Login successfull");
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      console("Error while logging in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleLogin}>
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
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full p-2 border rounded-md"
              placeholder="Enter your password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

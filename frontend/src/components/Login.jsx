import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Both fields are required.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies with the request
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Login successful!");
        setError("");
        setTimeout(() => {
          navigate("/rouletteBoard"); // Redirect to a dashboard or home page
        }, 2000);
      } else {
        setError(data.message || "Invalid credentials.");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-zinc-700">
      <div>
        <form
          className="flex flex-col gap-3 border-2 border-red-500 p-10 rounded-xl"
          onSubmit={handleSubmit}
        >
          <h3 className="text-red-500 tracking-widest text-center mb-3">
            Login here
          </h3>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}
          <input
            className="border-zinc-600 border rounded-full px-12 text-center py-2 outline-none"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="border-zinc-600 border rounded-full px-12 text-center py-2 outline-none"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="border-zinc-600 border rounded-full px-12 text-center py-2 bg-red-500 text-white tracking-widest hover:bg-red-300 outline-none"
          >
            Login
          </button>
          <h3 className="text-red-400 text-left text-sm">
            Don't have an account?{" "}
            <NavLink to="/register">
              <span className="hover:underline">Register here</span>
            </NavLink>
          </h3>
        </form>
      </div>
    </div>
  );
};

export default Login;

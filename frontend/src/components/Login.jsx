import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  document.title = "Login";
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

    // Show loading toast message while the API request is being processed
    const loginToast = toast.loading("Logging in...");
    const url = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${url}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      // Include cookies with the request
        body: JSON.stringify(formData),
      });
      const data = await response.json();
    

      // Once the request is done, show the appropriate toast
      if (response.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!", { id: loginToast });
        setError("");
        setSuccess("Login successful!");
        setTimeout(() => {
          navigate("/rouletteBoard"); // Redirect to home page
        }, 2000);
      } else {
        toast.error(data.message || "Invalid credentials.", { id: loginToast });
        setError(data.message || "Invalid credentials.");
        setSuccess("");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.", { id: loginToast });
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
      <Toaster /> {/* Add this line to render toast notifications */}
    </div>
  );
};

export default Login;

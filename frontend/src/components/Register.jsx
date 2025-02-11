import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  document.title = "Register";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const registerToast = toast.loading("Registering...");
    const url = import.meta.env.VITE_BASE_URL;
    try {
      const response = await fetch(`${url}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token for authentication
        toast.success("Registration successful!", { id: registerToast });
        setError("");
        setSuccess("Registration successful!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/rouletteBoard");
        }, 2000);
      } else {
        toast.error(data.message || "Something went wrong.", {
          id: registerToast,
        });
        setError(data.message || "Something went wrong.");
        setSuccess("");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.", {
        id: registerToast,
      });
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-700">
      <div className="p-8 border-red-500 border shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-500 tracking-widest mb-6">
          Register
        </h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              autoComplete="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-full text-center p-2 border focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-full text-center hover:bg-red-300 transition"
          >
            Register
          </button>
          <h3 className="text-red-400 text-left text-sm mt-3">
            Already have an account?{" "}
            <NavLink to="/">
              <span className="hover:underline">Login here</span>
            </NavLink>
          </h3>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default Register;

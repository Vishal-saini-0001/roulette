import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleApi = async () => {
    const url = import.meta.env.VITE_BASE_URL;
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(`${url}/api/getUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data.user);
      } else {
        console.error("Failed to fetch user data");
        navigate("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleApi();
  }, []); // Run only once when component mounts

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-around">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="https://i.pinimg.com/736x/87/14/55/8714556a52021ba3a55c8e7a3547d28c.jpg"
            alt="User Avatar"
          />
        </div>
        <div>
          Welcome,{" "}
          <span className="text-red-500 tracking-wider">{data?.username}</span>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div>
          Account Balance,{" "}
          <span className="font-bold">${data?.accountBalance}</span>
        </div>
        <div
          onClick={handleLogout}
          className="px-6 py-1 text-white cursor-pointer bg-red-400 rounded-md text-center shadow-xl shadow-red-500/50"
        >
          LogOut
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

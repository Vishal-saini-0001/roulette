import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  const [data, setData] = useState("");
  const navigate = useNavigate();

  const handleApi = async () => {
    const url = "https://roulette.studioubique-dev.com/roulette";
    try {
      const response = await fetch(`${url}/api/getUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies with the request
      });
      if (response.ok) {
        const dataa = await response.json();
        setData(dataa.user);
      }
    } catch (error) {
      Error("failed");
    }
  };

  useEffect(() => {
    handleApi();
  },[data]);

  const handleLogout = async () => {
    const url = "https://roulette.studioubique-dev.com/roulette";
    try {
      // Call the backend to clear the HTTP-only cookie
      const response = await fetch(`${url}/api/logout`, {
        method: "GET",
        credentials: "include", // Ensures cookies are included in the request
      });

      if (response.ok) {
        localStorage.removeItem("token");

        setTimeout(() => {
          navigate("/"); // Redirect after success
        }, 1000);
      } else {
        console.error("Failed to log out from backend");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-around">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            className=""
            src="https://i.pinimg.com/736x/87/14/55/8714556a52021ba3a55c8e7a3547d28c.jpg"
            alt=""
          />
        </div>
        <div>
          Welcome,{" "}
          <span className="text-red-500 tracking-wider">{data.username}</span>
        </div>
      </div>
      <div className="flex items-center gap-5">
        {" "}
        <div>
          Account Balance,{" "}
          <span className="font-bold">${data.accountBalance}</span>{" "}
        </div>{" "}
        <div
          onClick={handleLogout}
          className="px-6 py-1 text-white cursor-pointer bg-red-400 rounded-md text-center shadow-xl shadow-red-500/50 "
        >
          LogOut
        </div>{" "}
      </div>
    </div>
  );
};

export default UserDetail;

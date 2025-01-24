import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  const [data, setData] = useState("");
  const navigate = useNavigate();

  const handleApi = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/getUser", {
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
    try {
      // Call the backend to clear the HTTP-only cookie
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "GET",
        credentials: "include", // Ensures cookies are included in the request
      });

      if (response.ok) {
        localStorage.removeItem("token");

        navigate("/register");
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
          Welcome, <span className="text-red-500">{data.username}</span>
        </div>
      </div>
      <div className="flex flex-col">
        {" "}
        <div>Account Balance, ${data.accountBalance}</div>{" "}
        <div
          onClick={handleLogout}
          className="p-1 cursor-pointer bg-red-400 rounded-lg text-center"
        >
          LogOut
        </div>{" "}
      </div>
    </div>
  );
};

export default UserDetail;

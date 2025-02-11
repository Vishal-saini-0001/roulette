import React, { useEffect, useState } from "react";

const LastBets = () => {
  const [lastBetsButtons, setLastBetsButtons] = useState([]);

  useEffect(() => {
    const fetchLastBets = async () => {
      const url = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token"); // Get the token from localStorage

      if (!token) {
        console.error("Authorization token is missing.");
        return;
      }

      try {
        const response = await fetch(`${url}/api/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        if (data && data.user && data.user.lastBets) {
          // Extract the "button" values of the last ten bets
          const lastBets = data.user.lastBets
            .slice(-10)
            .map((bet) => bet.button);
          setLastBetsButtons(lastBets);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchLastBets();
  }, []); // Removed dependency to avoid unnecessary API calls

  return (
    <div>
      <h2>Last 10 Bets</h2>
      <ul>
        {lastBetsButtons.length > 0 ? (
          lastBetsButtons.map((buttons, index) => (
            <li key={index}>
              Last Bet {index + 1}:- {buttons.join(", ")}
            </li>
          ))
        ) : (
          <p>No bets found.</p>
        )}
      </ul>
    </div>
  );
};

export default LastBets;

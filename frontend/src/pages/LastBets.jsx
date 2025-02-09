import React, { useEffect, useState } from "react";

const LastBets = () => {
  const [lastBetsButtons, setLastBetsButtons] = useState([]);

  useEffect(() => {
    const fetchLastBets = async () => {
      const url = import.meta.env.VITE_API_URL;
      try {
        const response = await fetch(`${url}/api/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

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
  }, [lastBetsButtons]);

  return (
    <div>
      <h2>Last 10 Bets</h2>
      <ul>
        {lastBetsButtons.map((buttons, index) => (
          <li key={index}>
            Last Bet {index + 1}:- {buttons.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LastBets;

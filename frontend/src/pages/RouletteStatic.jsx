
import React, { useState } from "react";
import UserDetail from "./UserDetail";
import LastBets from "./LastBets";

const betTypeMapping = {
  Single: "singleBet",
  Split: "splitBet",
  Street: "streetBet",
  Corner: "cornerBet",
  Line: "lineBet",
  Red: "redBet",
  Black: "blackBet",
  Even: "evenBet",
  Odd: "oddBet",
  Low: "lowBet",
  High: "highBet",
  Green: "greenBet",
};

const predefinedAmounts = [10, 20, 30, 40, 50];
const redButton = [1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 30, 32, 34, 36, 39, 41, 43, 45, 48, 50, 52, 54, 57, 59];
const blackButton = [2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 28, 29, 31, 33, 35, 37, 38, 40, 42, 44, 46, 47, 49, 51, 53, 55, 56, 58, 60];
const green = [0];

const RouletteStatic = () => {
  const [bets, setBets] = useState([]);
  const [selectedBetType, setSelectedBetType] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleNumberClick = (number) => {
    setSelectedNumbers((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const handleBetTypeClick = (type) => {
    setSelectedBetType(betTypeMapping[type]);
    setSelectedNumbers([]);
  };

  const handleAmountClick = (amount) => setSelectedAmount(amount);

  const handleAddBet = () => {
    if (!selectedBetType || !selectedAmount) {
      setError("Please select a bet type and amount.");
      return;
    }
    
    setBets([...bets, { betType: selectedBetType, button: selectedNumbers, amount: selectedAmount }]);
    setSelectedNumbers([]);
    setSelectedBetType("");
    setSelectedAmount(0);
    setError("");
  };

  const handleSpin = () => {
    if (bets.length === 0) {
      setError("Please add at least one bet before spinning.");
      return;
    }

    const winningNumber = Math.floor(Math.random() * 61);
    let totalPayout = 0;
    
    const updatedBets = bets.map((bet) => {
      const win = bet.button.includes(winningNumber);
      const payout = win ? bet.amount * (bet.betType === "singleBet" ? 57 : 2) : 0;
      totalPayout += payout;
      return { ...bet, win, payout };
    });

    setResult({ winningNumber, bets: updatedBets, totalPayout });
    setBets([]);
  };

  return (
    <div className="p-6 mx-auto">
      <UserDetail />
      <h1 className="text-2xl font-bold mb-4">Roulette Game</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Choose Your Bet Type</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.keys(betTypeMapping).map((type) => (
            <button key={type} onClick={() => handleBetTypeClick(type)} className="p-2 border rounded">
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-10 gap-2 mt-2">
        {[...Array(61).keys()].map((num) => (
          <button key={num} onClick={() => handleNumberClick(num)} className="p-2 border rounded">
            {num}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {predefinedAmounts.map((amount) => (
          <button key={amount} onClick={() => handleAmountClick(amount)} className="p-2 border rounded">
            ${amount}
          </button>
        ))}
      </div>
      <button onClick={handleAddBet} className="bg-blue-500 text-white p-2 rounded mt-4">Add Bet</button>
      <button onClick={handleSpin} className="bg-green-500 text-white p-2 rounded mt-4">Spin</button>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Result</h2>
          <p>Winning Number: {result.winningNumber}</p>
          <p>Total Payout: ${result.totalPayout}</p>
        </div>
      )}
      <LastBets />
    </div>
  );
};

export default RouletteStatic;

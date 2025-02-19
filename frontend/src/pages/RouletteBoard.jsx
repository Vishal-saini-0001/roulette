import React, { useState } from "react";
import UserDetail from "./UserDetail";

// import LastBets from "./LastBets";

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
  "Low 1 - 30": "lowBet",
  "High 31 - 60": "highBet",
  Green: "greenBet",
  "First Column": "firstCol",
  "Second Column": "secCol",
  "Third Column": "thirdCol",
  "1st 12": "first12",
  "2nd 12": "second12",
  "3rd 12": "third12",
  "4th 12": "fourth12",
  "5th 12": "fifth12",
};

const predefinedAmounts = [10, 20, 30, 40, 50];

const redButton = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 30, 32, 34, 36, 39, 41, 43, 45,
  48, 50, 52, 54, 57, 59,
];
const blackButton = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 28, 29, 31, 33, 35, 37,
  38, 40, 42, 44, 46, 47, 49, 51, 53, 55, 56, 58, 60,
];
const green = [0, 61];

const RouletteBoard = () => {
  document.title = "Roulette Board";
  const [bets, setBets] = useState([]);
  const [selectedBetType, setSelectedBetType] = useState("");
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [currBalance, SetcurrBalance]= useState("")

  const handleNumberClick = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleBetTypeClick = (type) => {
    setSelectedBetType(betTypeMapping[type]);
    setSelectedNumbers([]);
  };

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
  };

  const handleAddBet = () => {
    const requiredCounts = {
      singleBet: 1,
      splitBet: 2,
      streetBet: 3,
      cornerBet: 4,
      lineBet: 6,
      firstCol: 0,
      secCol: 0,
      thirdCol: 0,
      first12: 0,
      second12: 0,
      third12: 0,
      fourth12: 0,
      fifth12: 0,
      redBet: 0,
      blackBet: 0,
      evenBet: 0,
      oddBet: 0,
      lowBet: 0,
      highBet: 0,
      greenBet: 0,
    };

    if (!selectedBetType) {
      setError("Please select a bet type.");
      return;
    }

    if (
      requiredCounts[selectedBetType] &&
      selectedNumbers.length !== requiredCounts[selectedBetType]
    ) {
      setError(
        `Please select exactly ${requiredCounts[selectedBetType]} number(s) for ${selectedBetType}.`
      );
      return;
    }

    if (!selectedAmount) {
      setError("Please select a betting amount.");
      return;
    }

    const newBet = {
      betType: selectedBetType,
      button: selectedNumbers.map(num => (num === 61 ? "00" : num)),
      amount: selectedAmount,
    };

    setBets([...bets, newBet]);
    setSelectedNumbers([]);
    setSelectedBetType("");
    setSelectedAmount(0);
    setError("");
  };

  const handlePlaceBets = async () => {
    if (bets.length === 0) {
      setError("Please add at least one bet before placing bets.");
      return;
    }
    const url = import.meta.env.VITE_BASE_URL;

    const token = localStorage.getItem("token"); // Get the token from localStorage

    try {
      const response = await fetch(`${url}/api/bets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ bets }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred while placing bets.");
        return;
      }

      const data = await response.json();
      
      setResult(data);
      setBets([]);
      setError("");
      SetcurrBalance(data.balance)
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };
  

  return (
    <div className="p-6 mx-auto">
      <UserDetail currBalance={currBalance}/>
      <h1 className="text-2xl font-bold mb-4">Roulette Game</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Choose Your Bet Type</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.keys(betTypeMapping).map((type) => (
            <button
              key={type}
              onClick={() => handleBetTypeClick(type)}
              className={`p-2 border rounded ${
                selectedBetType === betTypeMapping[type]
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Select Numbers</h2>
        <div className="grid grid-cols-10 gap-2 mt-2">
  {[...Array(62).keys()].map((num) => (
    <button
      key={num}
      onClick={() => handleNumberClick(num)}
      className={`p-2 border rounded ${
        selectedNumbers.includes(num) ? "ring-4 ring-yellow-400" : ""
      } ${
        redButton.includes(num)
          ? "bg-red-400 text-white"
          : blackButton.includes(num)
          ? "bg-zinc-700 text-white"
          : green.includes(num) // Now correctly includes 00
          ? "bg-green-500 text-white"
          : "bg-gray-200"
      }`}
    >
      {num === 61 ? "00" : num}
    </button>
  ))}
</div>

      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Select Betting Amount</h2>
        <div className="flex gap-2 mt-2">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountClick(amount)}
              className={`p-2 border rounded ${
                selectedAmount === amount
                  ? "bg-yellow-500 text-white animate-bounce"
                  : "bg-gray-200 "
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddBet}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add Bet
      </button>

      <div className="mt-4 flex justify-evenly items-center flex-wrap">
        <div className="flex flex-col justify-center items-center gap-2">
        
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Current Bets</h2>
        {bets.length > 0 ? (
          <ul className="list-disc pl-6 mt-2">
            {bets.map((bet, index) => (
              <li key={index}>
                {bet.betType} - Numbers: {bet.button.join(", ")} - Amount: $
                {bet.amount}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2">No bets added yet.</p>
        )}
        <div className="w-16 h-16 p-1 border-dotted border-2 hover:animate-spin border-green-600 flex items-center justify-center rounded-full">

      <button
        onClick={handlePlaceBets}
        className="bg-green-500 text-white w-full  h-full rounded-full hover:bg-green-600"
        >
        Spin
      </button>
        </div>
      </div>
  {result && (
        <div className="flex flex-col justify-center items-center gap-2">  <h2 className="text-2xl font-bold  text-gray-800 border-b pb-2">Result</h2>

        <div className="mt-1 space-y-2 text-gray-700">
          <p className="text-lg">
            <span className="font-semibold">Winning Number:</span>{result.winningNumber}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Total Payout:</span> ${result.totalPayout}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Remaining Balance:</span> ${result.balance}
          </p>
        </div></div>
  )}
      </div>


      <div>{error && <div className="text-red-600 mb-4">{error}</div>}</div>

      {result && (
  <div className="mt-6 p-4 border rounded-lg shadow-md">
  

    <h3 className="text-xl font-semibold text-gray-800 mt-6 border-b pb-2 animate-pulse">
     Last Bet Details
    </h3>

    <ul className="mt-4 space-y-3">
      {result.lastBets.map((bet, index) => (
        <li
          key={index}
          className="p-3 bg-white shadow-sm rounded-lg border border-gray-300"
        >
          <div className="font-bold text-gray-800 tracking-wide">
            {bet.betType}
          </div>
          <p className="text-gray-700">
            <span className="font-semibold">Bet on:</span>{" "}
            {bet.button.join(", ") ? bet.button.join(", ") : bet.betType}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Amount:</span> ${bet.amount}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Win:</span>{" "}
            {bet.win ? (
              <span className="text-green-600 font-bold">Yes</span>
            ) : (
              <span className="text-red-500 font-bold">No</span>
            )}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Payout:</span> ${bet.payout}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Lose Amount:</span> ${bet.win ? "0" : bet.amount}
          </p>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
};

export default RouletteBoard;

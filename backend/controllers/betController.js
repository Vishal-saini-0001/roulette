const generateRandomNumber = require("../services/RandomNoGen");
const userModel = require("../models/userModel");


const redButton = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 30, 32, 34, 36, 39, 41, 43, 45,
  48, 50, 52, 54, 57, 59,
];
const blackButton = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 28, 29, 31, 33, 35, 37,
  38, 40, 42, 44, 46, 47, 49, 51, 53, 55, 56, 58, 60,
];
const green = [0, 0o0];


const bets = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    // array of bets contains the amount, betType and array of buttons from the frontend
    const { bets } = req.body; // Array of bets

    // Validate that bets is an array and not empty
    if (!Array.isArray(bets) || bets.length === 0) {
      return res.status(400).json({ error: "A valid bets array is required." });
    }

    // Validate the number of buttons based on the bet type
    const isValidBet = (bet) => {
      const { button, betType } = bet;
      const buttonCount = Array.isArray(button) ? button.length : 0;

      switch (betType) {
        case "singleBet":
          return buttonCount === 1;
        case "splitBet":
          return buttonCount === 2;
        case "streetBet":
          return buttonCount === 3;
        case "cornerBet":
          return buttonCount === 4;
        case "lineBet":
          return buttonCount === 6;
        case "redBet":
        case "blackBet":
        case "greenBet":
        case "evenBet":
        case "oddBet":
        case "lowBet":
        case "highBet":
          return true; // No button validation needed for outside bets
        default:
          return false;
      }
    };

    // Check if all bets are valid
    for (const bet of bets) {
      if (!isValidBet(bet)) {
        return res.status(400).json({
          error: `Invalid button count or bet type: ${bet.betType}`,
        });
      }
    }

    // Check if the user has sufficient balance for all bets
    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBetAmount > user.accountBalance) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    // Generate the winning number
    const winningNumber = generateRandomNumber();
    // const winningNumber = 10;
    let totalPayout = 0;

    // Process each bet
    const betResults = bets.map((bet) => {
      const { button, amount, betType } = bet;

      let payout = 0;
      let win = false;

      switch (betType) {
        case "singleBet":
          if (button.includes(winningNumber)) {
            payout = amount * 57;
            win = true;
          }
          break;

        case "splitBet":
          if (button.includes(winningNumber)) {
            payout = amount * 28;
            win = true;
          }
          break;

        case "streetBet":
          if (button.includes(winningNumber)) {
            payout = amount * 18;
            win = true;
          }
          break;

        case "cornerBet":
          if (button.includes(winningNumber)) {
            payout = amount * 14;
            win = true;
          }
          break;

        case "lineBet":
          if (button.includes(winningNumber)) {
            payout = amount * 9;
            win = true;
          }
          break;

        case "redBet":
          if (redButton.includes(winningNumber)) {
            payout = amount * 1;
            win = true;
          }
          break;

        case "blackBet":
          if (blackButton.includes(winningNumber)) {
            payout = amount * 1;
            win = true;
          }
          break;

        case "greenBet":
          if (green.includes(winningNumber)) {
            payout = amount * 57;
            win = true;
          }
          break;

        case "evenBet":
          if (winningNumber % 2 === 0 && winningNumber !== 0) {
            payout = amount * 1;
            win = true;
          }
          break;

        case "oddBet":
          if (winningNumber % 2 !== 0) {
            payout = amount * 1;
            win = true;
          }
          break;

        case "lowBet":
          if (winningNumber >= 1 && winningNumber <= 30) {
            payout = amount * 1;
            win = true;
          }
          break;

        case "highBet":
          if (winningNumber >= 31 && winningNumber <= 60) {
            payout = amount * 1;
            win = true;
          }
          break;

        default:
          return { error: `Invalid bet type: ${betType}` };
      }

      // Update the total payout for the current bet
      if (win) {
        totalPayout += payout;
      }

      return {
        betType,
        button,
        amount,
        win,
        payout: win ? payout : 0,
      };
    });

    // Calculate the total loss amount (only for losing bets)
    const totalLossAmount = bets.reduce((sum, bet, index) => {
      return betResults[index].win ? sum : sum + bet.amount;
    }, 0);

    // Deduct only the total loss amount and add total payout to the user's balance
    user.accountBalance = user.accountBalance - totalLossAmount + totalPayout;

    // Update the user's bet count
    user.totalBets += bets.length;

    // Add the new bets to the user's lastBets history
    user.lastBets.unshift(...betResults);
    if (user.lastBets.length > 10) {
      user.lastBets = user.lastBets.slice(0, 10);
    }

    // Save the updated user data to the database
    await user.save();

    // Prepare the response
    const result = {
      winningNumber,
      bets: betResults,
      totalPayout,
      balance: user.accountBalance,
      remainingBets: user.totalBets,
      lastBets: user.lastBets,
    };

    return res.json(result);
  } catch (error) {
    console.error("Error processing bets:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the bets." });
  }
};

module.exports = { bets };

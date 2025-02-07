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

const firstCol = [
  1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58,
];
const secCol = [
  2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59,
];
const thirdCol = [
  3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60,
];

const first12 = Array.from({ length: 12 }, (_, i) => i + 1);
const second12 = Array.from({ length: 12 }, (_, i) => i + 13);
const third12 = Array.from({ length: 12 }, (_, i) => i + 25);
const fourth12 = Array.from({ length: 12 }, (_, i) => i + 37);
const fifth12 = Array.from({ length: 12 }, (_, i) => i + 49);

const bets = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { bets } = req.body; // Array of bets

    if (!Array.isArray(bets) || bets.length === 0) {
      return res.status(400).json({ error: "A valid bets array is required." });
    }

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
        case "firstCol":
        case "secCol":
        case "thirdCol":
        case "first12":
        case "second12":
        case "third12":
        case "fourth12":
        case "fifth12":
          return true;
        default:
          return false;
      }
    };

    for (const bet of bets) {
      if (!isValidBet(bet)) {
        return res.status(400).json({
          error: `Invalid button count or bet type: ${bet.betType}`,
        });
      }
    }

    const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBetAmount > user.accountBalance) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    const winningNumber = generateRandomNumber();
    let totalPayout = 0;

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
        case "firstCol":
          if (firstCol.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        case "secCol":
          if (secCol.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        case "thirdCol":
          if (thirdCol.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        case "first12":
          if (first12.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        case "second12":
          if (second12.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        case "third12":
          if (third12.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        case "fourth12":
          if (fourth12.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        case "fifth12":
          if (fifth12.includes(winningNumber)) {
            payout = amount * 1.8;
            win = true;
          }
          break;
        default:
          return { error: `Invalid bet type: ${betType}` };
      }

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

    const totalLossAmount = bets.reduce((sum, bet, index) => {
      return betResults[index].win ? sum : sum + bet.amount;
    }, 0);

    user.accountBalance = user.accountBalance - totalLossAmount + totalPayout;

    user.totalBets += bets.length;

    user.lastBets.unshift(...betResults);
    if (user.lastBets.length > 10) {
      user.lastBets = user.lastBets.slice(0, 10);
    }

    await user.save();

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

const generateRandomNumber = () => Math.floor(Math.random() * 61); // Generate a random number between 0 and 60

const redButton = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 21, 23, 25, 27, 30, 32, 34, 36, 39, 41, 43, 45,
  48, 50, 52, 54, 57, 59,
];
const blackButton = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 20, 22, 24, 26, 28, 29, 31, 33, 35, 37,
  38, 40, 42, 44, 46, 47, 49, 51, 53, 55, 56, 58, 60,
];
const green = [0, 0o0];

// Mock user data (for demonstration purposes)
let user = {
  accountBalance: 1000,
  totalBets: 0,
  lastBets: [],
};

const Staticbets = (req, res) => {
  try {
    // Mock request body for bets
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

    // const winningNumber = generateRandomNumber();
    const winningNumber = 10
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

module.exports = { Staticbets };

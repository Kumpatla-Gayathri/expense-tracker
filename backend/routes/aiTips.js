const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/tips", async (req, res) => {
  try {
    const { transactions } = req.body;

    // Prepare spending summary from transactions
    const spendingSummary = transactions
      .map((t) => `${t.category}: $${t.amount} on ${t.date} (${t.type})`)
      .join("\n");

    const prompt = `
      You are a personal finance advisor. Analyze this user's recent transactions and give 3 short, smart, personalized spending tips.
      
      Transactions:
      ${spendingSummary}
      
      Give exactly 3 tips in this format:
      1. [tip one]
      2. [tip two]
      3. [tip three]
      
      Keep each tip under 2 sentences. Be specific and helpful.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ tips: text });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ error: "Failed to generate tips" });
  }
});

module.exports = router;
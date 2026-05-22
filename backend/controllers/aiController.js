const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const getAITips = async (req, res) => {
  try {
    const { totalIncome, totalExpense, balance, categoryBreakdown, reportCard } = req.body;

    const categoryText = Object.entries(categoryBreakdown || {})
      .map(([cat, amt]) => `${cat}: Rs.${amt}`)
      .join(', ');

    const prompt = `
You are a personal finance advisor. Analyze this user's spending data and give 4 short, practical tips.

Financial Summary:
- Total Income: Rs.${totalIncome}
- Total Expenses: Rs.${totalExpense}
- Balance: Rs.${balance}
- Spending Grade: ${reportCard?.grade} (${reportCard?.savingsRate}% savings rate)
- Expenses by Category: ${categoryText}

Give exactly 4 tips. Each tip should be:
- One sentence only
- Specific to their spending data
- Practical and actionable
- Start with an emoji

Format as a numbered list like:
1. 🍕 tip here
2. 🚗 tip here
3. 💰 tip here
4. 📊 tip here
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
model: 'llama-3.3-70b-versatile',
    });

    const text = completion.choices[0].message.content;
    res.json({ tips: text });

  } catch (error) {
    console.error('Groq error:', error.message);
    res.status(500).json({ message: 'AI tips failed: ' + error.message });
  }
};

module.exports = { getAITips };
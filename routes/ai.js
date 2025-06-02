const express = require('express');
const router = express.Router();

// ✅ Generate AI Campaign Message
router.post('/generate-message', async (req, res) => {
  const { audienceDescription } = req.body;
  console.log('📩 /generate-message hit. audienceDescription:', audienceDescription);

  if (!audienceDescription) {
    return res.status(400).json({ error: 'Missing audience description' });
  }

  try {
    // Simulated AI logic
    const message = `Send a reward to users where ${audienceDescription}. Offer expires in 48 hours!`;
    res.json({ message });
  } catch (error) {
    console.error('❌ AI message generation failed:', error);
    res.status(500).json({ error: 'Failed to generate AI message' });
  }
});

// ✅ Generate AI Summary
router.post('/summary', async (req, res) => {
  const { total, delivered, failed, highSpenderRate } = req.body;
  console.log('📊 /summary hit. Payload:', { total, delivered, failed, highSpenderRate });

  try {
    const summary = `Your campaign reached ${total} users. ${delivered} messages were delivered, and ${failed} failed. High spender delivery rate was ${highSpenderRate}%.`;
    res.json({ summary });
  } catch (error) {
    console.error('❌ AI summary generation failed:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;

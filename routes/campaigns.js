const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

// Save Campaign to DB
router.post('/campaigns', async (req, res) => {
  try {
    const { campaignName, rules, aiMessage } = req.body;

    const newCampaign = new Campaign({
      campaignName,
      rules
      // Optionally store aiMessage too
    });

    await newCampaign.save(); // Save to MongoDB

    console.log('✅ Campaign Saved:', newCampaign);
    res.status(200).json({ message: 'Campaign saved successfully!' });

  } catch (err) {
    console.error('❌ Error saving campaign:', err);
    res.status(500).json({ error: 'Failed to save campaign' });
  }
});

// Fetch All Campaigns for History Page
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('❌ Error fetching campaigns:', err);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

module.exports = router;

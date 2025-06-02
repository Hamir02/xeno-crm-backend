const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS settings
const allowedOrigins = [
  'http://localhost:3000',
  'https://xeno-crm-frontend-iota.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// ✅ Import Models
const Customer = require('./models/Customer');
const Campaign = require('./models/Campaign');

// ✅ Import Routes
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');

// ✅ Use Routes
app.use('/api/ai', aiRoutes);
app.use('/api', authRoutes);
app.use('/api', campaignRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('Xeno CRM Backend is working ✅');
});

// ✅ Add Customer directly (optional)
app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Send Campaign logic
app.post('/api/send-campaign/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const query = {
      $and: campaign.rules.map(rule => ({
        [rule.field]: {
          [`$${rule.operator === '=' ? 'eq' : rule.operator}`]: Number(rule.value),
        },
      })),
    };

    const matchedCustomers = await Customer.find(query);

    const deliveryLogs = matchedCustomers.map(customer => ({
      customer: customer.name,
      email: customer.email,
      status: Math.random() > 0.1 ? 'SENT' : 'FAILED',
    }));

    res.json({
      campaign: campaign.campaignName,
      totalMatched: matchedCustomers.length,
      deliveryLogs,
    });

  } catch (error) {
    console.error('❌ ERROR WHILE SENDING CAMPAIGN:', error);
    res.status(500).json({ error: 'Failed to send campaign' });
  }
});

// ✅ Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Failed ❌', err);
  });

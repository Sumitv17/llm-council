require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { getAgent1Response, getAgent2Response, getAgent3Response } = require('./agents');
const { getDebateFinal } = require('./debate');
const Chat = require('./models/Chat');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-council')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.post('/chat', async (req, res) => {
  try {
    const { query } = req.body;
    // Parallel agent calls
    const [resp1, resp2, resp3] = await Promise.all([
      getAgent1Response(query),
      getAgent2Response(query),
      getAgent3Response(query)
    ]);
    const final = await getDebateFinal([resp1, resp2, resp3]);
    // Save to Mongo
    const formattedResponses = [
      { agent: 'GPT-OSS', content: resp1 },
      { agent: 'Llama', content: resp2 },
      { agent: 'Deepseek', content: resp3 }
    ];
    const chat = new Chat({ query, responses: formattedResponses, final });
    await chat.save();
    res.json({ responses: [resp1, resp2, resp3], final });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

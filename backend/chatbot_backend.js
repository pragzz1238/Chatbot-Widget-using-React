const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require("dotenv").config();


const openai = new OpenAI(process.env.OPENAI_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());


app.post('/ask', async (req, res) => {
  const { question } = req.body;
  console.log('Received user query:', question);
  if (question === "Hi! I am Kbot. How can I assist you?") {
    return res.json({ answer: { role: "bot", content: "" } });
  }
  try {

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          "role": "system",
          "content": "Helpful Kbot assistant"
        },
        {
          "role": 'user',
          "content": question,
        },
      ],
      temperature: 0,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const botResponse = response.choices[0].message;
    console.log('Generated bot response:', botResponse);
    res.json({ answer: botResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

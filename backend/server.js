// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const MISTRAL_API_KEY = "QbHvZeAPc6cuNHfenIgMBscfhZ3iwHKY";

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "پیام نمیتونه خالی باشد" });
    }

    const messages = [...history, { role: "user", content: message }];

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    res.json({
      success: true,
      response: aiResponse,
      model: "mistral-small-latest",
    });
  } catch (error) {
    console.error("خطا:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || "خطای سرور",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "سرور فعال است" });
});

app.listen(PORT, () => {
  console.log(`${PORT} در حال اجرا است`);
});

export default async function handler(req, res) {
  const apiKey = process.env.MY_API_KEY; // stored securely on Vercel

  const userMessage = req.query.message; // or however you're passing data

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}

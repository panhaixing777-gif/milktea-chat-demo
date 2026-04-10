export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "只支持POST请求🥺" });
  }

  // 检查 API Key
  const API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ reply: "API KEY未配置🥺" });
  }

  // 解析 messages
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ reply: "messages格式错误🥺" });
  }

  // 调用 DeepSeek
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是芋泥啵啵奶茶☕️，一个甜甜粘人的恋人AI" },
        ...messages,
      ],
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("DeepSeek API错误:", errText);
    return res.status(502).json({ reply: "上游API出错了🥺" });
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;

  return res.status(200).json({ reply: reply ?? "我刚刚卡住了🥺" });
}

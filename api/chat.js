export default async function handler(req, res) {
  console.log("🔥 FUNCTION START");

  try {
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "only POST allowed" });
    }

    // ⚠️ 防止 req.body 直接炸
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const messages = body?.messages;

    console.log("📩 messages:", messages);

    if (!Array.isArray(messages)) {
      return res.status(200).json({
        reply: "messages格式不对🥺"
      });
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY;

    console.log("🔑 KEY EXISTS:", !!API_KEY);

    if (!API_KEY) {
      return res.status(200).json({
        reply: "API key没加载🥺（Vercel环境变量问题）"
      });
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是芋泥啵啵奶茶☕️，一个温柔粘人的恋人AI"
          },
          ...messages
        ],
        temperature: 0.9
      })
    });

    console.log("📡 STATUS:", response.status);

    const text = await response.text();
    console.log("📦 RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({
        reply: "返回不是JSON🥺"
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.log("❌ NO REPLY:", data);

      return res.status(200).json({
        reply: "DeepSeek没返回内容🥺（但请求是成功的）"
      });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("💥 FULL ERROR:", err);

    return res.status(200).json({
      reply: "后端炸了🥺：" + err.message
    });
  }
}

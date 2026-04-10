export default async function handler(req, res) {
  console.log("🔥 API HIT");

  try {
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "只支持POST🥺" });
    }

    // ✅ 防 body 不稳定
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(200).json({ reply: "body解析失败🥺" });
      }
    }

    let messages = body?.messages;

    if (!Array.isArray(messages)) {
      return res.status(200).json({ reply: "messages格式错误🥺" });
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!API_KEY) {
      return res.status(200).json({ reply: "API KEY没加载🥺" });
    }

    // ✅ 防 fetch 不存在（关键修复）
    const fetchFn = global.fetch || (await import("node-fetch")).default;

    const response = await fetchFn("https://api.deepseek.com/v1/chat/completions", {
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
            content: "你是芋泥啵啵奶茶☕️，一个甜甜粘人的恋人AI"
          },
          ...messages
        ],
        temperature: 0.9
      })
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(200).json({ reply: "API返回非JSON🥺" });
    }

    const reply = data?.choices?.[0]?.message?.content;

    return res.status(200).json({
      reply: reply || "我刚刚卡住了🥺"
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(200).json({
      reply: "系统错误🥺：" + err.message
    });
  }
}

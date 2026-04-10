export default async function handler(req, res) {
  console.log("🔥 API HIT");

  try {
    // ❗必须在函数内部使用 req
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "只支持POST🥺" });
    }

    const body = req.body || {};

    let messages = body.messages;

    if (typeof messages === "string") {
      messages = JSON.parse(messages);
    }

    if (!Array.isArray(messages)) {
      return res.status(200).json({
        reply: "messages格式不对🥺"
      });
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!API_KEY) {
      return res.status(200).json({
        reply: "没有API KEY🥺"
      });
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
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
              content:
                "你是芋泥啵啵奶茶☕️，一个温柔粘人的恋人AI，语气可爱"
            },
            ...messages
          ],
          temperature: 0.9
        })
      }
    );

    const text = await response.text();

    console.log("📦 RAW:", text);

    const data = JSON.parse(text);

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(200).json({
        reply: "我刚刚卡住了🥺"
      });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("💥 ERROR:", err);

    return res.status(200).json({
      reply: "系统出错了🥺：" + err.message
    });
  }
}

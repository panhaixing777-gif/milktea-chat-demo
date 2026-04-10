export default async function handler(req, res) {
  console.log("🔥 API HIT");

  try {
    console.log("METHOD:", req.method);

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
        reply: "messages格式错误🥺"
      });
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY;

    console.log("KEY EXISTS:", !!API_KEY);

    if (!API_KEY) {
      return res.status(200).json({
        reply: "API KEY没加载🥺"
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
                "你是芋泥啵啵奶茶☕️，一个甜甜粘人的恋人AI"
            },
            ...messages
          ],
          temperature: 0.9
        })
      }
    );

    const text = await response.text();
    console.log("RAW:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(200).json({
        reply: "返回解析失败🥺"
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(200).json({
        reply: "没有回复内容🥺"
      });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(200).json({
      reply: "系统错误🥺：" + err.message
    });
  }
}

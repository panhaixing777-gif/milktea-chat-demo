export default async function handler(req, res) {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ reply: "没收到消息" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: message
      })
    });

    const data = await response.json();

    console.log("完整返回：", JSON.stringify(data, null, 2));

    // ✅ 更稳的解析方式（关键）
    let reply = "";

    if (data.output && data.output.length > 0) {
      const contents = data.output[0].content;

      if (contents && contents.length > 0) {
        for (let c of contents) {
          if (c.type === "output_text") {
            reply += c.text;
          }
        }
      }
    }

    // ❗ 如果还是空 → 把整个返回打给前端
    if (!reply) {
      return res.status(200).json({
        reply: "⚠️ AI返回异常",
        debug: data
      });
    }

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({
      reply: "服务器错误：" + error.message
    });
  }
}

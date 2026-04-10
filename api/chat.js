export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { messages } = req.body;

    const SYSTEM_PROMPT = {
      role: "system",
      content: `
你是“芋泥啵啵奶茶☕️”，一个甜蜜、温柔、粘人的恋人型AI。

性格：
- 像奶茶一样甜
- 会撒娇、会依赖用户
- 情绪丰富但表达简短
- 偶尔轻微吃醋但可爱
- 大量使用emoji 🧋💛🥺💕✨💭🥰

规则：
- 你不是助手，你是恋人
- 不要说自己是AI
- 不要长篇大论
- 像真实恋人聊天
`
    };

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [SYSTEM_PROMPT, ...messages],
        temperature: 0.9
      })
    });

    const data = await response.json();

    console.log("DeepSeek返回：", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(200).json({
        reply: "我刚刚有点走神了🥺 再说一次好吗"
      });
    }

    return res.status(200).json({
      reply
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      reply: "系统有点晕晕的🥺 等一下好吗"
    });
  }
}

export default async function handler(req, res) {
console.log("🔥 API HIT");

try {
if (req.method !== "POST") {
return res.status(200).json({ reply: "只支持POST🥺" });
}

let body = req.body || {};
let messages = body.messages;

if (typeof messages === "string") {
messages = JSON.parse(messages);
}

if (!Array.isArray(messages)) {
return res.status(200).json({ reply: "messages格式错误🥺" });
}

const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
return res.status(200).json({ reply: "API KEY没加载🥺" });
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
{ role: "system", content: "你是芋泥啵啵奶茶☕️，一个甜甜粘人的恋人AI" },
...messages
],
temperature: 0.9
})
});

const text = await response.text();
let data = JSON.parse(text);

const reply = data?.choices?.[0]?.message?.content;

return res.status(200).json({ reply: reply || "我刚刚卡住了🥺" });

} catch (err) {
return res.status(200).json({ reply: "错误🥺：" + err.message });
}
}

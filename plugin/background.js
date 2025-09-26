async function analyzeUrlViaServer(url) {
  try {
    const response = await fetch("https://your-render-domain.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const data = await response.json();
    return data.advice || "⚠️ 无法分析";
  } catch (err) {
    console.error("Server 错误:", err);
    return "⚠️ 分析失败";
  }
}

// 接收 content.js 消息
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "link_hover") {
    analyzeUrlViaServer(message.url).then((advice) => {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "show_tooltip",
        advice
      });
    });
  }
});

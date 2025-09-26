function showTooltip(text, bottom = "20px") {
  const oldTooltip = document.getElementById("hover-tooltip");
  if (oldTooltip) oldTooltip.remove();

  const tooltip = document.createElement("div");
  tooltip.id = "hover-tooltip";
  tooltip.innerText = text;
  Object.assign(tooltip.style, {
    position: "fixed",
    bottom,
    right: "20px",
    padding: "10px",
    backgroundColor: "rgba(0,0,0,0.85)",
    color: "#fff",
    borderRadius: "8px",
    zIndex: 9999,
    maxWidth: "300px",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    transition: "opacity 0.3s"
  });

  document.body.appendChild(tooltip);
  tooltip.style.opacity = "1";

  setTimeout(() => {
    tooltip.style.opacity = "0";
    setTimeout(() => tooltip.remove(), 300);
  }, 3000);
}

let hoverTimeout = null;
let lastHoverUrl = "";

document.addEventListener("mouseover", (event) => {
  const target = event.target;
  if (target.tagName === "A" && target.href) {
    const url = target.href;
    if (url === lastHoverUrl) return;
    lastHoverUrl = url;

    if (hoverTimeout) clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      chrome.runtime.sendMessage({ type: "link_hover", url });
    }, 300);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "show_tooltip") {
    showTooltip(message.advice, "20px");
  }
});

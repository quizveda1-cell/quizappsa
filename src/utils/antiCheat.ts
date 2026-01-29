export const antiCheat = () => {
  // disable copy paste
  document.addEventListener("copy", e => e.preventDefault());
  document.addEventListener("paste", e => e.preventDefault());

  // tab switch detection
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) alert("Tab switch detected!");
  });

  // devtools detection
  setInterval(() => {
    if (window.outerWidth - window.innerWidth > 200) {
      alert("DevTools detected!");
    }
  }, 1000);
};

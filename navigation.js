// navigation.js — final working version

window.Navigation = (function () {

  function initTabs() {
    const buttons = Array.from(document.querySelectorAll(".tab-button"));

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");

        // Update button UI
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Store the selected tab globally
        window.__selectedTab = tab;
      });
    });
  }

  return { initTabs };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.Navigation.initTabs();
});

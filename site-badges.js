/* Icon badges for pages that do not ship the home-page sprite. */
(function () {
  if (!document.getElementById("i-palette")) {
    var holder = document.createElement("div");
    holder.innerHTML = '<svg class="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' +
      '<symbol id="i-widgets" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2.2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2.2"/><rect x="13" y="10" width="8" height="11" rx="2.2"/></symbol>' +
      '<symbol id="i-grid" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></symbol>' +
      '<symbol id="i-sliders" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="17" r="2"/></symbol>' +
      '<symbol id="i-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.4 12 4l8 6.4V19a1.4 1.4 0 0 1-1.4 1.4h-4V14H9.4v6.4h-4A1.4 1.4 0 0 1 4 19z"/></symbol>' +
      '<symbol id="i-fullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/></symbol>' +
      '<symbol id="i-palette" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-1.2-.9-1.7-.9-2.8 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4c0-4.4-4-7.6-9-7.6z"/><path d="M8 10h.01M12 7.5h.01M16 10h.01"/></symbol>' +
      '<symbol id="i-shape" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2c2.8 0 4.2 0 5.4.6a5 5 0 0 1 2.8 2.8c.6 1.2.6 2.6.6 5.4s0 4.2-.6 5.4a5 5 0 0 1-2.8 2.8c-1.2.6-2.6.6-5.4.6s-4.2 0-5.4-.6a5 5 0 0 1-2.8-2.8c-.6-1.2-.6-2.6-.6-5.4s0-4.2.6-5.4a5 5 0 0 1 2.8-2.8c1.2-.6 2.6-.6 5.4-.6z"/></symbol>' +
      '<symbol id="i-pill" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="17" cy="12" r="1.5"/></symbol>' +
      '<symbol id="i-swipe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h11"/><path d="M12.5 7.5 17 12l-4.5 4.5"/><path d="M4 6v12"/></symbol>' +
      '<symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6z"/><path d="M10 18.5a2 2 0 0 0 4 0"/></symbol>' +
      '<symbol id="i-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10" width="15" height="10" rx="3"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></symbol>' +
      '<symbol id="i-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2z"/><path d="M20 5.5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z"/></symbol>' +
      '<symbol id="i-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V9.2a2 2 0 0 0-2-2h-6.2L10.6 5.2H5.5a2 2 0 0 0-2 2.3z"/></symbol>' +
      '<symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2.2"/><path d="m4.5 7 7.5 6L19.5 7"/></symbol>' +
      '<symbol id="i-image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.2"/><circle cx="9" cy="10" r="1.4"/><path d="m5 16.5 4.2-3.6 3 2.4 2.2-1.8L19 16.5"/></symbol>' +
      '</svg>';
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }
  function pin(el, icon) {
    if (!el || !icon || el.querySelector(".icon-badge")) return;
    el.classList.add("with-badge");
    var span = document.createElement("span");
    span.className = "icon-badge";
    span.innerHTML = '<svg aria-hidden="true"><use href="#' + icon + '"></use></svg>';
    el.insertBefore(span, el.firstChild);
  }
  var marked = document.querySelectorAll("[data-icon]");
  for (var i = 0; i < marked.length; i++) pin(marked[i], marked[i].getAttribute("data-icon"));
  var chapters = {
    ch1: "i-home", ch2: "i-home", ch3: "i-grid", ch4: "i-swipe", ch5: "i-grid",
    ch6: "i-folder", ch7: "i-pill", ch8: "i-widgets", ch9: "i-sliders", ch10: "i-palette",
    ch11: "i-shape", ch12: "i-book", ch13: "i-image", ch14: "i-fullscreen", ch15: "i-pill",
    ch16: "i-bell", ch17: "i-lock", ch18: "i-sliders", ch19: "i-book", ch20: "i-lock",
    ch21: "i-sliders", ch22: "i-lock", ch23: "i-bell", ch24: "i-book"
  };
  var sections = document.querySelectorAll(".chapter");
  for (var c = 0; c < sections.length; c++) {
    pin(sections[c].querySelector("h2"), chapters[sections[c].id]);
  }
  pin(document.querySelector(".toc h2"), "i-book");
})();

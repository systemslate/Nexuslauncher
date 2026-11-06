/* Apply the language pack chosen before paint. English stays in the HTML. */
(function () {
  function pack() {
    var lang = document.documentElement.getAttribute("data-lang") || "en";
    return (window.NexusPack && window.NexusPack[lang]) || null;
  }

  function t(key, fallback) {
    var strings = pack();
    if (strings && strings[key]) return strings[key];
    return fallback;
  }

  function write(el, value) {
    if (el.tagName === "TITLE" || el.tagName === "META") {
      if (el.tagName === "TITLE") el.textContent = value;
      else el.setAttribute("content", value);
      return;
    }
    if (el.getAttribute("data-i18n-html") === "true") {
      el.innerHTML = value;
      return;
    }
    var nodes = el.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === 3 && nodes[i].nodeValue.trim()) {
        nodes[i].nodeValue = value;
        return;
      }
    }
    if (!el.children.length) el.textContent = value;
  }

  function apply(scope) {
    var strings = pack();
    if (!strings) return;
    var root = scope || document;
    var nodes = root.querySelectorAll("[data-i18n]");
    for (var n = 0; n < nodes.length; n++) {
      var key = nodes[n].getAttribute("data-i18n");
      if (strings[key]) write(nodes[n], strings[key]);
    }
    var noted = root.querySelectorAll("[data-i18n-show]");
    for (var s = 0; s < noted.length; s++) {
      if (strings[noted[s].getAttribute("data-i18n-show")]) noted[s].hidden = false;
    }
    var attrs = root.querySelectorAll("[data-i18n-attr]");
    for (var a = 0; a < attrs.length; a++) {
      var parts = attrs[a].getAttribute("data-i18n-attr").split(/\s+/);
      for (var p = 0; p < parts.length; p++) {
        var pair = parts[p].split(":");
        if (pair.length === 2 && strings[pair[1]]) attrs[a].setAttribute(pair[0], strings[pair[1]]);
      }
    }
  }

  window.NexusI18n = { t: t, apply: apply };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(document); });
  } else {
    apply(document);
  }
})();

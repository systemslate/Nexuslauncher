/* Nexus Launcher website — the interactions.
   UI style, Nexus Island, the hero pager, folder-style feature cards,
   the setup deck and the icon-press launch pulse.
   Each block leaves the page alone when its markup is absent. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var uiKey = "nexus-ui-style";
  var uiStyles = { "default": 1, "frosted": 1, "neumorph": 1, "liquid": 1 };

  function readUi() {
    try {
      var saved = localStorage.getItem(uiKey);
      if (uiStyles[saved]) return saved;
    } catch (err) { /* keep Default */ }
    return "default";
  }

  function writeUi(name) {
    try { localStorage.setItem(uiKey, name); } catch (err) { /* preference stays for this view */ }
  }

  function applyUi(name) {
    document.documentElement.setAttribute("data-ui", name);
    var buttons = document.querySelectorAll("[data-ui-style]");
    for (var i = 0; i < buttons.length; i++) {
      var on = buttons[i].getAttribute("data-ui-style") === name;
      buttons[i].setAttribute("aria-checked", on ? "true" : "false");
      buttons[i].tabIndex = on ? 0 : -1;
    }
  }

  function uiStyle() {
    applyUi(readUi());
    var group = document.querySelector("[data-ui-switch]");
    if (!group) return;
    group.addEventListener("click", function (event) {
      var button = event.target.closest("[data-ui-style]");
      if (!button) return;
      var name = button.getAttribute("data-ui-style");
      if (!uiStyles[name]) return;
      writeUi(name);
      applyUi(name);
    });
    group.addEventListener("keydown", function (event) {
      var lateral = event.key === "ArrowRight" || event.key === "ArrowDown";
      var reverse = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!lateral && !reverse) return;
      var buttons = group.querySelectorAll("[data-ui-style]");
      var current = 0;
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute("aria-checked") === "true") current = i;
      }
      var next = (current + (reverse ? -1 : 1) + buttons.length) % buttons.length;
      event.preventDefault();
      buttons[next].click();
      buttons[next].focus();
    });
  }

  function island() {
    var root = document.querySelector("[data-island]");
    if (!root || reduce) return;
    var glyph = root.querySelector("[data-island-glyph]");
    var label = root.querySelector("[data-island-label]");
    var bars = root.querySelector("[data-island-bars]");
    if (!glyph || !label || !bars) return;
    var states = [
      { glyph: "\u266B", label: "Wheels on the Bus", bars: true },
      { glyph: "18\u00B0", label: "Clear", bars: false },
      { glyph: "64%", label: "Charging", bars: false },
      { glyph: "2", label: "New notifications", bars: false }
    ];
    var index = 0;
    window.setInterval(function () {
      index = (index + 1) % states.length;
      var state = states[index];
      root.classList.remove("is-swap");
      void root.offsetWidth;
      root.classList.add("is-swap");
      glyph.textContent = state.glyph;
      label.textContent = state.label;
      bars.hidden = !state.bars;
    }, 3200);
  }

  function heroPager() {
    var img = document.querySelector("[data-hero-shot]");
    if (!img) return;
    var label = document.querySelector("[data-hero-label]");
    var frame = img.closest(".hero-widget");
    var art = document.querySelector(".hero-art");
    var dots = document.querySelectorAll("[data-hero-dot]");
    var index = 0;
    var timer = 0;
    for (var p = 0; p < dots.length; p++) {
      var preload = new Image();
      preload.src = dots[p].getAttribute("data-src");
    }
    function select(dot) {
      function apply() {
        img.src = dot.getAttribute("data-src");
        img.alt = dot.getAttribute("data-alt");
        if (label) label.textContent = dot.getAttribute("data-label");
        for (var i = 0; i < dots.length; i++) {
          dots[i].setAttribute("aria-pressed", dots[i] === dot ? "true" : "false");
        }
      }
      if (reduce || !frame) {
        apply();
        return;
      }
      frame.classList.add("is-fading");
      window.setTimeout(function () {
        apply();
        frame.classList.remove("is-fading");
      }, 140);
    }
    function stop() { window.clearInterval(timer); timer = 0; }
    function start() {
      stop();
      if (reduce || dots.length < 2 || document.hidden) return;
      timer = window.setInterval(function () {
        index = (index + 1) % dots.length;
        select(dots[index]);
      }, 5000);
    }
    for (var i = 0; i < dots.length; i++) {
      dots[i].addEventListener("click", function () {
        for (var n = 0; n < dots.length; n++) if (dots[n] === this) index = n;
        select(this);
        start();
      });
    }
    if (art) {
      art.addEventListener("mouseenter", stop);
      art.addEventListener("mouseleave", start);
      art.addEventListener("focusin", stop);
      art.addEventListener("focusout", start);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });
    start();
  }

  function folders() {
    var cells = document.querySelectorAll("[data-folder]");
    for (var i = 0; i < cells.length; i++) {
      cells[i].addEventListener("click", function (event) {
        if (event.target.closest("a")) return;
        var button = this.querySelector(".cell-open-label");
        var shot = this.querySelector(".cell-shot");
        if (!button) return;
        var open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", open ? "false" : "true");
        button.textContent = open ? "Open" : "Close";
        this.classList.toggle("is-open", !open);
        if (shot) shot.hidden = open;
      });
    }
  }

  function setupDeck() {
    var deck = document.querySelector("[data-setup-deck]");
    if (!deck) return;
    var cards = deck.querySelectorAll("[data-setup-card]");
    var dots = deck.querySelectorAll("[data-setup-dot]");
    var indexNode = deck.querySelector("[data-setup-index]");
    var back = deck.querySelector("[data-setup-back]");
    var next = deck.querySelector("[data-setup-next]");
    var index = 0;

    function show(nextIndex, moveFocus) {
      index = nextIndex;
      for (var i = 0; i < cards.length; i++) {
        var on = i === index;
        cards[i].hidden = !on;
        if (dots[i]) dots[i].setAttribute("aria-pressed", on ? "true" : "false");
      }
      if (indexNode) {
        indexNode.textContent = index < 9 ? "0" + (index + 1) : String(index + 1);
      }
      if (back) back.disabled = index === 0;
      if (next) next.textContent = index === cards.length - 1 ? "Continue" : "Next";
      if (!moveFocus) return;
      var heading = cards[index].querySelector("h3");
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus();
    }

    function leave() {
      var dest = document.getElementById("permissions");
      if (dest) dest.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }

    deck.addEventListener("click", function (event) {
      if (event.target.closest("[data-setup-skip]")) {
        leave();
        return;
      }
      if (event.target.closest("[data-setup-next]")) {
        if (index >= cards.length - 1) leave();
        else show(index + 1, true);
        return;
      }
      if (event.target.closest("[data-setup-back]")) {
        if (index > 0) show(index - 1, true);
        return;
      }
      var dot = event.target.closest("[data-setup-dot]");
      if (!dot) return;
      show(Number(dot.getAttribute("data-setup-dot")), true);
    });

    show(0, false);
  }

  function iconLaunch() {
    var tiles = document.querySelectorAll(".icon-tile");
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener("click", function () {
        var href = this.getAttribute("href") || "";
        if (href.charAt(0) !== "#") return;
        var target = document.querySelector(href);
        if (!target) return;
        target.classList.remove("is-launched");
        void target.offsetWidth;
        target.classList.add("is-launched");
      });
    }
  }

  function drawerModes() {
    var root = document.querySelector("[data-drawer-modes]");
    var img = document.querySelector("[data-drawer-shot]");
    if (!root || !img) return;
    var modes = {
      grid: ["assets/guide/app-drawer-grid.jpg", "The app drawer in Grid mode, with labeled icons and an A to Z rail."],
      list: ["assets/guide/app-drawer-list.jpg", "The app drawer in List mode, with letter headings and two columns."],
      categories: ["assets/guide/app-drawer-categories.jpg", "The app drawer in Categories mode, Spatial layout, with Media selected."]
    };
    root.addEventListener("click", function (event) {
      var button = event.target.closest("[data-drawer]");
      if (!button) return;
      var mode = modes[button.getAttribute("data-drawer")];
      if (!mode) return;
      img.src = mode[0];
      img.alt = mode[1];
      var buttons = root.querySelectorAll("[data-drawer]");
      for (var i = 0; i < buttons.length; i++) {
        var on = buttons[i] === button;
        buttons[i].setAttribute("aria-checked", on ? "true" : "false");
      }
    });
  }

  function enlargeShots() {
    var triggers = document.querySelectorAll("[data-enlarge]");
    if (!triggers.length) return;
    var dialog = document.createElement("dialog");
    dialog.className = "shot-lightbox";
    var close = document.createElement("button");
    close.type = "button";
    close.className = "shot-close";
    close.textContent = "Close";
    var view = document.createElement("img");
    view.alt = "";
    dialog.appendChild(close);
    dialog.appendChild(view);
    document.body.appendChild(dialog);
    function open(img) {
      view.src = img.currentSrc || img.src;
      view.alt = img.alt;
      if (typeof dialog.showModal === "function") dialog.showModal();
    }
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener("click", function (event) {
        event.stopPropagation();
        var figure = this.closest("figure");
        var img = figure ? figure.querySelector("img") : null;
        if (img) open(img);
      });
    }
    close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  }

  function feedbackForm() {
    var form = document.querySelector("[data-feedback-form]");
    if (!form) return;
    var thanks = document.querySelector("[data-feedback-thanks]");
    var checked = false;
    function blankRequired(control) {
      if (!control.required || control.type === "radio" || control.type === "checkbox") return false;
      return String(control.value).trim() === "";
    }
    function markMissing() {
      var fields = form.querySelectorAll(".field");
      var first = null;
      for (var i = 0; i < fields.length; i++) {
        var controls = fields[i].querySelectorAll("input, select, textarea");
        var missing = false;
        for (var c = 0; c < controls.length; c++) {
          var control = controls[c];
          if (blankRequired(control)) control.setCustomValidity("Fill in this field.");
          else if (control.validationMessage === "Fill in this field.") control.setCustomValidity("");
          var bad = control.willValidate && !control.validity.valid;
          if (bad) missing = true;
          control.setAttribute("aria-invalid", bad ? "true" : "false");
        }
        fields[i].classList.toggle("is-missing", checked && missing);
        if (missing && !first) first = fields[i];
      }
      return checked ? first : null;
    }
    form.addEventListener("input", markMissing);
    form.addEventListener("change", markMissing);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      checked = true;
      var missing = markMissing();
      if (missing) {
        var control = missing.querySelector("input, select, textarea");
        if (control) control.focus();
        return;
      }
      var data = new FormData(form);
      var body = new URLSearchParams();
      data.forEach(function (value, key) {
        if (String(value).trim() !== "") body.append(key, value);
      });
      var send = document.querySelector("[data-feedback-send]");
      if (send) send.disabled = true;
      fetch(form.action, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      }).then(function () {
        form.hidden = true;
        if (thanks) thanks.hidden = false;
      }).catch(function () {
        if (send) send.disabled = false;
        var note = document.querySelector("[data-feedback-error]");
        if (note) note.hidden = false;
      });
    });
  }

  uiStyle();
  island();
  heroPager();
  folders();
  setupDeck();
  iconLaunch();
  drawerModes();
  enlargeShots();
  feedbackForm();
})();

/* Theme, Calm palette, UI style and type. Injected into every page nav. */
(function () {
  var root = document.documentElement;
  var themeKey = "nexus-theme";
  var calmKey = "nexus-calm";
  var uiKey = "nexus-ui-style";
  var fontKey = "nexus-font";
  var wallKey = "nexus-wallpaper";
  var langKey = "nexus-lang";
  /* English fallbacks match app values/strings_theme.xml + strings_liquid_glass.xml */
  var themes = [["automatic", "Automatic"], ["light", "Light"], ["dark", "Dark"], ["amoled", "AMOLED"], ["calm", "Calm"]];
  var langChoices = [
    ["system", "System default"], ["en", "English"], ["ne", "नेपाली (Nepali)"], ["ar", "العربية (Arabic)"],
    ["iw", "עברית (Hebrew)"], ["es", "Spanish"], ["pt-BR", "Portuguese (Brazil)"], ["hi", "Hindi"],
    ["id", "Indonesian"], ["de", "German"], ["fr", "French"]
  ];
  var calms = [
    ["ocean_blue", "Ocean Blue"], ["rich_sand", "Rich Sand"], ["golden_sand", "Golden Sand"],
    ["navy_ink", "Navy Ink"], ["deep_navy", "Deep Navy"], ["ember_red", "Ember Red"],
    ["forest_green", "Forest Green"], ["amber_dusk", "Amber Dusk"], ["burnt_orange", "Burnt Orange"],
    ["deep_plum", "Deep Plum"], ["slate_grey", "Slate Grey"], ["aurora", "Aurora"],
    ["dusk_rose", "Dusk Rose"], ["tidepool", "Tidepool"], ["copper_night", "Copper Night"],
    ["sunset_ink", "Sunset Ink"]
  ];
  var uis = [["default", "Default"], ["frosted", "Frosted Glass"], ["neumorph", "Neumorphism"], ["liquid", "Liquid Glass"]];
  var walls = { haze: 1, lagoon: 1, dusk: 1, grove: 1 };
  var wallChoices = [["default", "Default"], ["haze", "Haze"], ["lagoon", "Lagoon"], ["dusk", "Dusk"], ["grove", "Grove"]];
  var fonts = [
    ["nexus_default", "Nexus Default", '"Nexus Default", system-ui, sans-serif'],
    ["system", "System Default", "system-ui, sans-serif"],
    ["sans_serif", "Sans", "sans-serif"],
    ["serif", "Serif", "serif"],
    ["monospace", "Mono", "ui-monospace, monospace"],
    ["sans_serif_medium", "Medium", "sans-serif"],
    ["roboto", "Roboto", "Roboto, sans-serif"],
    ["inter", "Inter", "Inter, sans-serif"],
    ["manrope", "Manrope", "Manrope, sans-serif"],
    ["ibm_plex_sans", "IBM Plex Sans", '"IBM Plex Sans", sans-serif'],
    ["lora", "Lora", "Lora, serif"],
    ["playpen_sans", "Playpen", "Playpen, sans-serif"],
    ["elms_sans", "Elms Sans", '"Elms Sans", sans-serif'],
    ["bitcount_single", "Bitcount", "Bitcount, sans-serif"]
  ];
  var appFontKeys = {
    nexus_default: 1, system: 1, sans_serif: 1, serif: 1, monospace: 1, sans_serif_medium: 1
  };

  function readTheme() {
    var value = root.getAttribute("data-theme");
    return value || "dark";
  }

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (err) { /* storage blocked */ }
  }

  function paint(group, attr, current) {
    var buttons = group.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      var on = buttons[i].getAttribute(attr) === current;
      buttons[i].setAttribute("aria-checked", on ? "true" : "false");
      buttons[i].tabIndex = on ? 0 : -1;
    }
  }

  function readWallpaper() {
    try {
      var saved = localStorage.getItem(wallKey) || "";
      if (saved.indexOf("data:image/") === 0 || walls[saved]) return saved;
    } catch (err) { /* storage blocked */ }
    return "";
  }

  function wallpaperValue(saved) {
    if (!saved) return "default";
    if (saved.indexOf("data:image/") === 0) return "custom";
    return saved;
  }

  function applyWallpaper(value) {
    if (value && value.indexOf("data:image/") === 0) {
      root.setAttribute("data-wallpaper", "custom");
      root.style.setProperty("--wallpaper", "url('" + value + "')");
    } else if (value && walls[value]) {
      root.setAttribute("data-wallpaper", value);
      root.style.removeProperty("--wallpaper");
    } else {
      root.removeAttribute("data-wallpaper");
      root.style.removeProperty("--wallpaper");
    }
  }

  function fitWallpaper(img) {
    var edge = 1400;
    var scale = Math.min(1, edge / Math.max(img.width, img.height));
    var canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  }

  function paintChrome() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    var bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    if (bg) meta.setAttribute("content", bg);
  }

  function t(key, fallback) {
    var pack = window.NexusPack && window.NexusPack[root.getAttribute("data-lang")];
    if (pack && pack[key]) return pack[key];
    return fallback;
  }

  function readLang() {
    try {
      var saved = localStorage.getItem(langKey);
      if (saved) return saved;
    } catch (err) { /* storage blocked */ }
    return "system";
  }

  function sync(panel) {
    paintChrome();
    paint(panel.querySelector("[data-look-lang]"), "data-lang-value", readLang());
    paint(panel.querySelector("[data-look-theme]"), "data-theme-value", readTheme());
    paint(panel.querySelector("[data-look-calm]"), "data-calm", root.getAttribute("data-calm") || "ocean_blue");
    paint(panel.querySelector("[data-look-ui]"), "data-ui-value", root.getAttribute("data-ui") || "default");
    paint(panel.querySelector("[data-look-font]"), "data-font-value", root.getAttribute("data-font") || "nexus_default");
    paint(panel.querySelector("[data-look-wall]"), "data-wallpaper-choice", wallpaperValue(readWallpaper()));
  }

  function row(cls, label, items, attr, extra, labelKey) {
    var wrap = document.createElement("div");
    wrap.className = "look-card";
    var name = document.createElement("p");
    name.className = "look-label";
    name.textContent = label;
    if (labelKey) name.setAttribute("data-i18n", labelKey);
    wrap.appendChild(name);
    var group = document.createElement("div");
    group.className = "look-row " + cls;
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", label);
    if (labelKey) group.setAttribute("data-i18n-attr", "aria-label:" + labelKey);
    for (var i = 0; i < items.length; i++) {
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "radio");
      button.setAttribute(attr, items[i][0]);
      button.textContent = items[i][1];
      if (attr === "data-theme-value" || attr === "data-ui-value") {
        button.setAttribute("data-i18n", "look." + items[i][0]);
      }
      if (attr === "data-wallpaper-choice" && items[i][0] === "default") {
        button.setAttribute("data-i18n", "look.default");
      }
      if (attr === "data-lang-value") button.setAttribute("data-i18n", "lang." + items[i][0]);
      if (attr === "data-calm") button.setAttribute("data-i18n", "calm." + items[i][0]);
      if (attr === "data-font-value" && appFontKeys[items[i][0]]) {
        button.setAttribute("data-i18n", "font." + items[i][0]);
      }
      if (attr === "data-font-value") button.style.fontFamily = items[i][2];
      if (items[i][0] === "sans_serif_medium") button.style.fontWeight = "500";
      if (attr === "data-calm") {
        var dot = document.createElement("i");
        dot.className = "swatch";
        dot.setAttribute("aria-hidden", "true");
        button.insertBefore(dot, button.firstChild);
      }
      group.appendChild(button);
    }
    wrap.appendChild(group);
    if (extra) wrap.appendChild(extra);
    return { wrap: wrap, group: group };
  }

  var slot = document.querySelector(".nav-inner");
  if (!slot) return;
  var host = document.createElement("div");
  host.className = "look";
  var toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "look-btn";
  toggle.setAttribute("aria-label", "Look");
  toggle.setAttribute("data-i18n-attr", "aria-label:look.open");
  toggle.setAttribute("aria-expanded", "false");
  var badge = document.createElement("span");
  badge.className = "icon-badge";
  badge.innerHTML = '<svg aria-hidden="true"><use href="#i-palette"></use></svg>';
  toggle.appendChild(badge);
  toggle.setAttribute("aria-controls", "look-panel");
  var panel = document.createElement("div");
  panel.className = "look-panel";
  panel.id = "look-panel";
  var language = row("look-lang", "Language", langChoices, "data-lang-value", null, "look.language");
  language.group.setAttribute("data-look-lang", "");
  var theme = row("", "Theme", themes, "data-theme-value", null, "look.theme");
  theme.group.setAttribute("data-look-theme", "");
  var note = document.createElement("p");
  note.className = "look-note";
  note.textContent = "AMOLED and Calm are Pro options in the app.";
  note.setAttribute("data-i18n", "look.pro");
  theme.wrap.appendChild(note);
  var calm = row("", "Calm Palette", calms, "data-calm", null, "look.palette");
  calm.wrap.classList.add("look-calm");
  calm.group.setAttribute("data-look-calm", "");
  var ui = row("look-ui", "UI Style", uis, "data-ui-value", null, "look.ui");
  ui.group.setAttribute("data-look-ui", "");
  var type = row("look-type", "Font Family", fonts, "data-font-value", null, "look.type");
  type.group.setAttribute("data-look-font", "");
  var wall = row("look-walls", "Wallpaper", wallChoices, "data-wallpaper-choice", null, "look.wall");
  wall.group.setAttribute("data-look-wall", "");
  var wallPick = document.createElement("button");
  wallPick.type = "button";
  wallPick.setAttribute("role", "radio");
  wallPick.setAttribute("data-wallpaper-choice", "custom");
  wallPick.setAttribute("aria-label", "Choose an image");
  wallPick.setAttribute("data-i18n", "look.custom");
  wallPick.setAttribute("data-i18n-attr", "aria-label:look.choose");
  wallPick.textContent = "Custom";
  wall.group.appendChild(wallPick);
  var wallFile = document.createElement("input");
  wallFile.type = "file";
  wallFile.className = "look-file";
  wallFile.accept = "image/*";
  wallFile.setAttribute("aria-label", "Choose a wallpaper image");
  wallFile.setAttribute("data-i18n-attr", "aria-label:look.file");
  var wallNote = document.createElement("p");
  wallNote.className = "look-note";
  wallNote.setAttribute("data-i18n", "look.wallNote");
  wallNote.textContent = "A chosen image stays in this browser and is not uploaded.";
  wall.wrap.appendChild(wallFile);
  wall.wrap.appendChild(wallNote);
  panel.appendChild(language.wrap);
  panel.appendChild(theme.wrap);
  panel.appendChild(calm.wrap);
  panel.appendChild(ui.wrap);
  panel.appendChild(wall.wrap);
  panel.appendChild(type.wrap);
  host.appendChild(toggle);
  document.body.appendChild(panel);
  var cta = slot.querySelector(".nav-cta");
  if (cta) slot.insertBefore(host, cta);
  else slot.appendChild(host);
  applyWallpaper(readWallpaper());
  sync(panel);
  if (window.NexusI18n && NexusI18n.apply) {
    NexusI18n.apply(panel);
    NexusI18n.apply(host);
  }

  wallFile.addEventListener("change", function () {
    var file = wallFile.files && wallFile.files[0];
    wallFile.value = "";
    if (!file || file.type.indexOf("image/") !== 0) {
      wallNote.textContent = "Choose an image file.";
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var url = fitWallpaper(img);
        try { localStorage.setItem(wallKey, url); }
        catch (err) {
          wallNote.textContent = "That image is too large to keep in this browser.";
          return;
        }
        wallNote.textContent = "A chosen image stays in this browser and is not uploaded.";
        applyWallpaper(url);
        sync(panel);
      };
      img.onerror = function () {
        wallNote.textContent = "This browser could not read that image.";
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

  function place() {
    var rect = toggle.getBoundingClientRect();
    panel.style.top = Math.round(rect.bottom + 8) + "px";
    if (root.getAttribute("dir") === "rtl") {
      panel.style.left = Math.max(8, Math.round(rect.left)) + "px";
      panel.style.right = "auto";
    } else {
      panel.style.right = Math.max(8, Math.round(window.innerWidth - rect.right)) + "px";
      panel.style.left = "auto";
    }
  }

  function setOpen(open) {
    host.classList.toggle("is-open", open);
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) place();
  }

  toggle.addEventListener("click", function () {
    setOpen(!host.classList.contains("is-open"));
  });
  window.addEventListener("resize", function () {
    if (panel.classList.contains("is-open")) place();
  });
  window.addEventListener("scroll", function () {
    if (panel.classList.contains("is-open")) place();
  }, true);

  panel.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    var wallChoice = button.getAttribute("data-wallpaper-choice");
    if (wallChoice === "custom") {
      wallFile.click();
      return;
    }
    var langValue = button.getAttribute("data-lang-value");
    if (langValue) {
      try { localStorage.setItem(langKey, langValue); } catch (err) { /* storage blocked */ }
      location.reload();
      return;
    }
    if (wallChoice) {
      try {
        if (wallChoice === "default") localStorage.removeItem(wallKey);
        else localStorage.setItem(wallKey, wallChoice);
      } catch (err) { /* storage blocked */ }
      wallNote.textContent = t("look.wallNote", "A chosen image stays in this browser and is not uploaded.");
      applyWallpaper(wallChoice === "default" ? "" : wallChoice);
      sync(panel);
      return;
    }
    var themeValue = button.getAttribute("data-theme-value");
    var calmValue = button.getAttribute("data-calm");
    var uiValue = button.getAttribute("data-ui-value");
    var fontValue = button.getAttribute("data-font-value");
    if (themeValue) {
      if (themeValue === "dark") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", themeValue);
      save(themeKey, themeValue);
    }
    if (calmValue) {
      root.setAttribute("data-calm", calmValue);
      root.setAttribute("data-theme", "calm");
      save(calmKey, calmValue);
      save(themeKey, "calm");
    }
    if (uiValue) {
      if (uiValue === "default") root.removeAttribute("data-ui");
      else root.setAttribute("data-ui", uiValue);
      save(uiKey, uiValue);
    }
    if (fontValue) {
      if (fontValue === "nexus_default") root.removeAttribute("data-font");
      else root.setAttribute("data-font", fontValue);
      save(fontKey, fontValue);
    }
    sync(panel);
  });

  document.addEventListener("click", function (event) {
    if (!host.contains(event.target) && !panel.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });
})();

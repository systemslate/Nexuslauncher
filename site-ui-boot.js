/* Apply the saved look before first paint so the page does not flash. */
(function () {
  var root = document.documentElement;

  function matchLang() {
    var list = navigator.languages || [navigator.language || "en"];
    var alias = { he: "iw", in: "id", iw: "iw", pt: "pt-BR" };
    for (var i = 0; i < list.length; i++) {
      var tag = String(list[i] || "").toLowerCase().replace("_", "-");
      var base = tag.split("-")[0];
      if (tag === "pt-br" || base === "pt") return "pt-BR";
      if (alias[base]) return alias[base];
      if ({ en: 1, ne: 1, ar: 1, es: 1, hi: 1, id: 1, de: 1, fr: 1 }[base]) return base;
    }
    return "en";
  }
  var themes = { automatic: 1, light: 1, amoled: 1, calm: 1 };
  var calms = {
    rich_sand: 1, golden_sand: 1, ocean_blue: 1, navy_ink: 1, deep_navy: 1,
    ember_red: 1, forest_green: 1, amber_dusk: 1, burnt_orange: 1, deep_plum: 1,
    slate_grey: 1, aurora: 1, dusk_rose: 1, tidepool: 1, copper_night: 1, sunset_ink: 1
  };
  var uis = { default: 1, frosted: 1, neumorph: 1, liquid: 1 };
  var fonts = {
    system: 1, sans_serif: 1, serif: 1, monospace: 1, sans_serif_medium: 1,
    roboto: 1, inter: 1, manrope: 1, ibm_plex_sans: 1, lora: 1,
    playpen_sans: 1, elms_sans: 1, bitcount_single: 1
  };
  try {
    var theme = localStorage.getItem("nexus-theme");
    if (themes[theme]) root.setAttribute("data-theme", theme);
    var calm = localStorage.getItem("nexus-calm");
    if (calms[calm]) root.setAttribute("data-calm", calm);
    var ui = localStorage.getItem("nexus-ui-style");
    if (uis[ui]) root.setAttribute("data-ui", ui);
    var font = localStorage.getItem("nexus-font");
    if (fonts[font]) root.setAttribute("data-font", font);
    var wall = localStorage.getItem("nexus-wallpaper");
    var presets = { haze: 1, lagoon: 1, dusk: 1, grove: 1 };
    if (presets[wall]) root.setAttribute("data-wallpaper", wall);
    else if (wall && wall.indexOf("data:image/") === 0) {
      root.setAttribute("data-wallpaper", "custom");
      root.style.setProperty("--wallpaper", "url('" + wall + "')");
    }
    var langSaved = localStorage.getItem("nexus-lang") || "system";
    var langKnown = { system: 1, en: 1, ne: 1, ar: 1, iw: 1, es: 1, "pt-BR": 1, hi: 1, id: 1, de: 1, fr: 1 };
    if (!langKnown[langSaved]) langSaved = "system";
    var langActive = langSaved === "system" ? matchLang() : langSaved;
    root.setAttribute("lang", langActive === "iw" ? "he" : langActive);
    root.setAttribute("data-lang", langActive);
    root.setAttribute("dir", langActive === "ar" || langActive === "iw" ? "rtl" : "ltr");
    if (langActive !== "en") document.write('<script src="i18n/' + langActive + '.js"><\/script>');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      var bg = getComputedStyle(root).getPropertyValue("--bg").trim();
      if (bg) meta.setAttribute("content", bg);
    }
  } catch (err) {
    /* storage can be blocked; the page stays on Dark, Default, Nexus Default */
  }
})();

/* User guide: the contents list follows the chapter in view, and search
   looks through chapter titles, headings and body text. */
(function () {
  var toc = document.querySelector(".toc");
  var chapters = document.querySelectorAll(".chapter");
  if (!toc || !chapters.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var links = {};
  var anchors = toc.querySelectorAll("a[href^='#ch']");
  for (var i = 0; i < anchors.length; i++) {
    links[anchors[i].getAttribute("href").slice(1)] = anchors[i];
  }
  var current = "";

  function setCurrent(id) {
    if (!id || id === current || !links[id]) return;
    current = id;
    var keys = Object.keys(links);
    for (var k = 0; k < keys.length; k++) {
      if (keys[k] === id) links[keys[k]].setAttribute("aria-current", "true");
      else links[keys[k]].removeAttribute("aria-current");
    }
    if (toc.classList.contains("is-searching")) return;
    var link = links[id];
    var linkBox = link.getBoundingClientRect();
    var box = toc.getBoundingClientRect();
    if (linkBox.top < box.top + 4 || linkBox.bottom > box.bottom - 4) {
      toc.scrollTop += linkBox.top - box.top - (box.height - linkBox.height) / 2;
    }
  }

  if ("IntersectionObserver" in window) {
    var seen = [];
    var observer = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        var id = entries[e].target.id;
        var at = seen.indexOf(id);
        if (entries[e].isIntersecting && at < 0) seen.push(id);
        if (!entries[e].isIntersecting && at >= 0) seen.splice(at, 1);
      }
      if (seen.length) setCurrent(seen[seen.length - 1]);
    }, { rootMargin: "-18% 0px -62% 0px", threshold: 0 });
    for (var c = 0; c < chapters.length; c++) observer.observe(chapters[c]);
  }
  if (location.hash && links[location.hash.slice(1)]) setCurrent(location.hash.slice(1));
  else setCurrent("ch1");

  var records = [];
  for (var n = 0; n < chapters.length; n++) {
    var chapter = chapters[n];
    var heads = chapter.querySelectorAll("h2, h3");
    var chapterTitle = heads.length ? heads[0].textContent.replace(/\s+/g, " ").trim() : chapter.id;
    for (var h = 0; h < heads.length; h++) {
      var head = heads[h];
      var blob = head.textContent;
      var node = head.nextElementSibling;
      while (node && node !== heads[h + 1]) {
        blob += " " + node.textContent;
        node = node.nextElementSibling;
      }
      records.push({
        el: head,
        chapterId: chapter.id,
        chapter: chapterTitle,
        title: head.textContent.replace(/\s+/g, " ").trim(),
        text: blob.replace(/\s+/g, " ").trim()
      });
    }
  }

  var form = document.createElement("form");
  form.className = "guide-search no-print";
  form.setAttribute("role", "search");
  form.innerHTML = '<label><span class="visually-hidden">Search the guide</span>' +
    '<input type="search" placeholder="Search the guide" autocomplete="off" data-guide-search></label>';
  var meta = document.createElement("p");
  meta.className = "guide-search-meta no-print";
  meta.hidden = true;
  var hits = document.createElement("ol");
  hits.className = "guide-hits no-print";
  hits.hidden = true;
  var heading = toc.querySelector("h2");
  heading.insertAdjacentElement("afterend", form);
  form.insertAdjacentElement("afterend", meta);
  meta.insertAdjacentElement("afterend", hits);
  var input = form.querySelector("input");
  var picked = 0;

  function clearMarks() {
    var marks = document.querySelectorAll("mark.search-hit");
    for (var m = marks.length - 1; m >= 0; m--) {
      var parent = marks[m].parentNode;
      parent.replaceChild(document.createTextNode(marks[m].textContent), marks[m]);
      parent.normalize();
    }
  }

  function markIn(root, tokens) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var textNode;
    while ((textNode = walker.nextNode())) nodes.push(textNode);
    var drawn = 0;
    for (var t = 0; t < nodes.length; t++) {
      if (drawn > 24) break;
      var value = nodes[t].nodeValue;
      var lower = value.toLowerCase();
      var ranges = [];
      for (var u = 0; u < tokens.length; u++) {
        var from = 0;
        while (from < lower.length) {
          var at = lower.indexOf(tokens[u], from);
          if (at < 0) break;
          ranges.push([at, at + tokens[u].length]);
          from = at + tokens[u].length;
        }
      }
      if (!ranges.length) continue;
      ranges.sort(function (a, b) { return a[0] - b[0]; });
      var frag = document.createDocumentFragment();
      var cursor = 0;
      for (var r = 0; r < ranges.length; r++) {
        if (ranges[r][0] < cursor) continue;
        frag.appendChild(document.createTextNode(value.slice(cursor, ranges[r][0])));
        var mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = value.slice(ranges[r][0], ranges[r][1]);
        frag.appendChild(mark);
        cursor = ranges[r][1];
        drawn++;
      }
      frag.appendChild(document.createTextNode(value.slice(cursor)));
      nodes[t].parentNode.replaceChild(frag, nodes[t]);
    }
  }

  function snippet(text, tokens) {
    var lower = text.toLowerCase();
    var at = -1;
    for (var s = 0; s < tokens.length; s++) {
      var found = lower.indexOf(tokens[s]);
      if (found >= 0 && (at < 0 || found < at)) at = found;
    }
    if (at < 0) return text.slice(0, 90);
    var start = Math.max(0, at - 36);
    var piece = text.slice(start, start + 110).trim();
    return (start ? "…" : "") + piece + (start + 110 < text.length ? "…" : "");
  }

  function score(record, tokens, phrase) {
    var title = record.title.toLowerCase();
    var body = record.text.toLowerCase();
    var points = 0;
    if (phrase && title.indexOf(phrase) >= 0) points += 80;
    if (phrase && body.indexOf(phrase) >= 0) points += 25;
    for (var p = 0; p < tokens.length; p++) {
      if (body.indexOf(tokens[p]) < 0) return 0;
      points += title.indexOf(tokens[p]) >= 0 ? 30 : 8;
    }
    return points;
  }

  function openHit(record, tokens) {
    clearMarks();
    markIn(record.el, tokens);
    var node = record.el.nextElementSibling;
    var heads = record.el.parentNode.querySelectorAll("h2, h3");
    var next = null;
    for (var i = 0; i < heads.length; i++) if (heads[i] === record.el) next = heads[i + 1];
    while (node && node !== next) {
      markIn(node, tokens);
      node = node.nextElementSibling;
    }
    setCurrent(record.chapterId);
    record.el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  function paintHits(list, tokens) {
    hits.innerHTML = "";
    picked = 0;
    if (!list.length) {
      meta.hidden = false;
      meta.textContent = "No matches.";
      hits.hidden = true;
      return;
    }
    meta.hidden = false;
    meta.textContent = list.length === 1 ? "1 match" : list.length + " matches";
    hits.hidden = false;
    for (var i = 0; i < list.length; i++) {
      var item = document.createElement("li");
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-selected", i === 0 ? "true" : "false");
      var name = document.createElement("b");
      name.textContent = list[i].title;
      var where = document.createElement("small");
      where.textContent = list[i].title === list[i].chapter ? snippet(list[i].text, tokens) : list[i].chapter + " — " + snippet(list[i].text, tokens);
      button.appendChild(name);
      button.appendChild(where);
      button.addEventListener("click", function (record) {
        return function () { openHit(record, tokens); };
      }(list[i]));
      item.appendChild(button);
      hits.appendChild(item);
    }
  }

  function selectHit(next) {
    var buttons = hits.querySelectorAll("button");
    if (!buttons.length) return;
    picked = (next + buttons.length) % buttons.length;
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute("aria-selected", i === picked ? "true" : "false");
    buttons[picked].scrollIntoView({ block: "nearest" });
  }

  function search(raw) {
    clearMarks();
    var phrase = raw.trim().toLowerCase();
    var tokens = phrase.split(/\s+/).filter(function (word) { return word.length > 1 || phrase.length === 1; });
    if (phrase.length < 2) {
      hits.hidden = true;
      hits.innerHTML = "";
      if (!phrase) {
        toc.classList.remove("is-searching");
        meta.hidden = true;
      } else {
        toc.classList.add("is-searching");
        meta.hidden = false;
        meta.textContent = "Keep typing.";
      }
      return;
    }
    toc.classList.add("is-searching");
    var found = [];
    for (var i = 0; i < records.length; i++) {
      var points = score(records[i], tokens, phrase);
      if (points) found.push({ record: records[i], points: points });
    }
    found.sort(function (a, b) { return b.points - a.points; });
    paintHits(found.slice(0, 12).map(function (row) { return row.record; }), tokens);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var button = hits.querySelector("button[aria-selected='true']") || hits.querySelector("button");
    if (button) button.click();
  });
  input.addEventListener("input", function () { search(input.value); });
  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown") { event.preventDefault(); selectHit(picked + 1); }
    if (event.key === "ArrowUp") { event.preventDefault(); selectHit(picked - 1); }
    if (event.key === "Escape") { input.value = ""; search(""); }
  });
})();

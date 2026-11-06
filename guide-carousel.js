/* Nexus Launcher user guide — screenshot carousels.

   A .shot-carousel holds several .shot figures in a .carousel-track that
   scrolls sideways and snaps to one figure at a time. This adds the previous /
   next buttons and one dot per figure, and keeps the current dot in step with
   the scroll (swipe, buttons, dots or arrow keys).

   A figure whose image is missing is dropped from its carousel instead of
   showing a placeholder, so a slide can be listed before its capture exists.
   Print shows every figure side by side (NEXUS_USER_GUIDE.css). */
(function () {
  var carousels = document.querySelectorAll(".shot-carousel");

  function label(key, fallback) {
    return window.NexusI18n ? window.NexusI18n.t(key, fallback) : fallback;
  }

  function setup(carousel) {
    var track = carousel.querySelector(".carousel-track");
    if (!track) return;

    var controls = document.createElement("div");
    controls.className = "carousel-controls no-print";
    var prev = button("carousel-prev", label("guide.prev", "Previous"), "‹");
    var next = button("carousel-next", label("guide.next", "Next"), "›");
    var dots = document.createElement("div");
    dots.className = "carousel-dots";
    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    carousel.appendChild(controls);

    var current = 0;

    function slides() {
      return track.querySelectorAll(":scope > .shot");
    }

    function show(index) {
      var list = slides();
      if (!list.length) return;
      index = Math.max(0, Math.min(list.length - 1, index));
      // Scroll the track only (never the page) by the distance between the slide's
      // middle and the track's middle; screen distances are the same in RTL.
      var box = track.getBoundingClientRect();
      var r = list[index].getBoundingClientRect();
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollBy({
        left: r.left + r.width / 2 - (box.left + box.width / 2),
        behavior: reduce ? "auto" : "smooth"
      });
      mark(index);
    }

    function mark(index) {
      current = index;
      var all = dots.querySelectorAll("button");
      for (var i = 0; i < all.length; i++) all[i].setAttribute("aria-current", i === index ? "true" : "false");
      var count = slides().length;
      prev.disabled = index <= 0;
      next.disabled = index >= count - 1;
    }

    function rebuild() {
      var list = slides();
      dots.textContent = "";
      carousel.classList.toggle("is-single", list.length < 2);
      carousel.hidden = list.length === 0;
      for (var i = 0; i < list.length; i++) {
        (function (index) {
          var cap = list[index].querySelector("figcaption");
          var dot = button("", cap ? cap.textContent.trim() : String(index + 1), "");
          dot.addEventListener("click", function () { show(index); });
          dots.appendChild(dot);
        })(i);
      }
      mark(Math.min(current, Math.max(0, list.length - 1)));
    }

    // The slide nearest the middle of the track is the current one.
    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var box = track.getBoundingClientRect();
        var middle = box.left + box.width / 2;
        var list = slides();
        var best = 0;
        var bestGap = Infinity;
        for (var i = 0; i < list.length; i++) {
          var r = list[i].getBoundingClientRect();
          var gap = Math.abs(r.left + r.width / 2 - middle);
          if (gap < bestGap) { bestGap = gap; best = i; }
        }
        if (best !== current) mark(best);
      });
    }, { passive: true });

    var rtl = document.documentElement.dir === "rtl";
    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });
    track.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      var forward = (event.key === "ArrowRight") !== rtl;
      show(current + (forward ? 1 : -1));
    });

    // Off to the side, a lazy slide would only try to load once swiped to. Load
    // them all as the carousel nears the screen, so missing ones drop out unseen.
    function loadAll() {
      var imgs = track.querySelectorAll("img[loading='lazy']");
      for (var k = 0; k < imgs.length; k++) imgs[k].loading = "eager";
    }
    if ("IntersectionObserver" in window) {
      var near = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        near.disconnect();
        loadAll();
      }, { rootMargin: "800px 0px" });
      near.observe(carousel);
    } else {
      loadAll();
    }

    var figures = slides();
    for (var i = 0; i < figures.length; i++) {
      (function (figure) {
        var img = figure.querySelector("img");
        if (!img) return;
        function drop() {
          figure.remove();
          rebuild();
        }
        if (img.complete && !img.naturalWidth) figure.remove();
        else img.addEventListener("error", drop);
      })(figures[i]);
    }
    rebuild();
  }

  function button(className, text, glyph) {
    var b = document.createElement("button");
    b.type = "button";
    if (className) b.className = className;
    b.setAttribute("aria-label", text);
    b.textContent = glyph;
    return b;
  }

  for (var i = 0; i < carousels.length; i++) setup(carousels[i]);
})();

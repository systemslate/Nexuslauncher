/* Nexus Launcher user guide — screenshot slots.

   Each .shot figure names an image in assets/guide/. If that file is not there
   yet the browser fires an error on the <img>, and the figure switches to its
   dashed "Screenshot coming" placeholder. Adding the capture under the expected
   filename is therefore the only step needed — no HTML edit, no rebuild.

   Screenshot slots only. Page behaviour lives in site-behavior.js. */
(function () {
  var slots = document.querySelectorAll('.shot');

  function markMissing(slot) {
    slot.classList.add('is-missing');
  }

  function markPresent(slot) {
    slot.classList.remove('is-missing');
  }

  for (var i = 0; i < slots.length; i++) {
    (function (slot) {
      var img = slot.querySelector('img');
      if (!img) return;

      if (img.complete) {
        if (!img.naturalWidth) markMissing(slot);
        return;
      }

      img.addEventListener('error', function () { markMissing(slot); });
      img.addEventListener('load', function () { markPresent(slot); });
    })(slots[i]);
  }
})();

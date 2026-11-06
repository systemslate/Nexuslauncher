/* Feedback page. The form posts to the existing Google Form.
   A successful send keeps the answers so the same report can be sent again. */
(function () {
  var form = document.querySelector("[data-feedback-form]");
  if (!form) return;
  var thanks = document.querySelector("[data-feedback-thanks]");
  var send = form.querySelector("[data-feedback-send]");
  var note = form.querySelector("[data-feedback-error]");
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

  function showForm() {
    form.hidden = false;
    if (thanks) thanks.hidden = true;
    if (note) note.hidden = true;
    if (send) send.disabled = false;
    var first = form.querySelector("input, select, textarea");
    if (first) first.focus();
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
    if (send) send.disabled = true;
    if (note) note.hidden = true;
    fetch(form.action, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body
    }).then(function () {
      form.hidden = true;
      if (thanks) {
        thanks.hidden = false;
        var again = thanks.querySelector("[data-feedback-again]");
        if (again) again.focus();
        thanks.scrollIntoView({ block: "nearest" });
      }
    }).catch(function () {
      if (send) send.disabled = false;
      if (note) note.hidden = false;
    });
  });

  if (thanks) {
    var again = thanks.querySelector("[data-feedback-again]");
    if (again) again.addEventListener("click", showForm);
  }
})();

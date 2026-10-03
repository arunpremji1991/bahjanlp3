/* «فك كربة» page — amount picker + (optional) case box.
 * Depends on app.js (window.BahjahApp) and config.js (BAHJAH_CONFIG.fakKorba).
 * This page never takes payment: the chosen amount is shown on the CTA and passed to
 * analytics; the donor enters it on Bahjah's official payment page.
 */
(function () {
  "use strict";

  var App = window.BahjahApp;
  var FK = (window.BAHJAH_CONFIG || {}).fakKorba || {};
  if (!App) return;

  var amount = FK.defaultAmount || 10;
  var min = FK.minAmount || 1;

  function fmt(n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 3 }); }
  function money(n) {
    return App.lang() === "en" ? "OMR " + fmt(n) : fmt(n) + " ر.ع";
  }

  /* ---------------- amount picker ---------------- */
  var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="fk-amt"]'));
  var other = document.getElementById("fk-other");
  var hint = document.getElementById("fk-other-hint");

  function renderCtas() {
    var valid = amount >= min;
    document.querySelectorAll("[data-fk-cta]").forEach(function (a) {
      var label = a.querySelector(".fk-cta-label");
      var base = App.t("fk.cta.give", "ساهم الآن");
      if (label) label.textContent = valid ? base + " · " + money(amount) : base;
      if (valid) a.setAttribute("data-value", String(amount)); else a.removeAttribute("data-value");
    });
    if (hint) hint.hidden = valid || !other || other.value === "";
  }

  var selTimer;
  function select(v, source) {
    amount = v;
    renderCtas();
    clearTimeout(selTimer);
    selTimer = setTimeout(function () {
      if (amount >= min) App.track("select_amount", { value: amount, source: source, category: "hardship_relief" });
    }, source === "custom" ? 700 : 0);
  }

  radios.forEach(function (r) {
    if (Number(r.value) === amount) r.checked = true;
    r.addEventListener("change", function () {
      if (!r.checked) return;
      if (other) other.value = "";
      select(Number(r.value), "preset");
    });
  });
  if (other) {
    other.addEventListener("input", function () {
      var v = parseFloat(other.value.replace(/[^\d.]/g, ""));
      radios.forEach(function (r) { r.checked = false; });
      if (!isNaN(v)) select(v, "custom");
      else { amount = 0; renderCtas(); }
    });
  }

  /* ---------------- case box (real data only) ---------------- */
  var C = FK.case || {};
  var hasCase = !!(C.enabled && Number(C.target) > 0 && Number(C.raised) >= 0);

  function renderCase() {
    document.querySelectorAll("[data-if-case]").forEach(function (el) { el.hidden = !hasCase; });
    document.querySelectorAll("[data-if-nocase]").forEach(function (el) { el.hidden = hasCase; });
    var lang = App.lang();
    var story = C.story && (C.story[lang] || C.story.ar);
    var storyEl = document.getElementById("fk-story-case");
    if (storyEl) { storyEl.hidden = !(hasCase && story); if (story) storyEl.textContent = story; }
    var storyGeneric = document.getElementById("fk-story-generic");
    if (storyGeneric) storyGeneric.hidden = !!(hasCase && story);
    if (!hasCase) return;

    var target = Number(C.target), raised = Math.min(Number(C.raised), target);
    var remaining = Math.max(target - raised, 0);
    var pct = Math.round((raised / target) * 100);
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set("fk-target", money(target));
    set("fk-raised", money(raised));
    set("fk-remaining", money(remaining));
    set("fk-pct", pct + "%");
    set("fk-updated", C.updatedOn || "");
    var ring = document.getElementById("fk-ring");
    if (ring) ring.style.setProperty("--pct", pct);
    var bar = document.getElementById("fk-bar");
    if (bar) { bar.style.width = pct + "%"; bar.parentElement.setAttribute("aria-valuenow", String(pct)); }
  }

  renderCase();
  renderCtas();
  App.onLang(function () { renderCase(); renderCtas(); });
})();

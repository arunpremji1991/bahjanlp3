/* Bahjah giving landing page — runtime.
 * Campaign variables, UTM persistence, official-route resolution with fallback,
 * analytics (dataLayer / GA4 / Google Ads / Meta) and the sticky mobile CTA.
 */
(function () {
  "use strict";

  var CFG = window.BAHJAH_CONFIG || {};
  var T = CFG.tracking || {};
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];
  var CLICK_KEYS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"];
  var STORE_KEY = "bahjah_attribution";
  var params = new URLSearchParams(location.search);
  var usingFallback = false;

  /* ---------------- storage (never throws) ---------------- */
  function load(key) { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode */ } }

  /* ---------------- attribution ---------------- */
  var attribution = (function () {
    var stored = load(STORE_KEY) || {};
    var now = {};
    UTM_KEYS.concat(CLICK_KEYS).forEach(function (k) { var v = params.get(k); if (v) now[k] = v; });
    var hasNew = Object.keys(now).length > 0;
    if (hasNew) {
      now.landed_at = new Date().toISOString();
      now.referrer = document.referrer || "";
      if (!stored.first) stored.first = now;
      stored.last = now;
      save(STORE_KEY, stored);
    }
    return stored;
  })();
  var last = attribution.last || {};

  /* ---------------- campaign ---------------- */
  var campaignKey = (params.get("campaign") || load("bahjah_campaign") || "").toLowerCase();
  if (!CFG.campaigns || !CFG.campaigns[campaignKey]) {
    // Infer from utm_campaign if it names a known variant (e.g. "zakat_2026_meta").
    var uc = (params.get("utm_campaign") || last.utm_campaign || "").toLowerCase();
    campaignKey = Object.keys(CFG.campaigns || {}).filter(function (k) { return uc.indexOf(k) !== -1; })[0] || CFG.defaultCampaign || "general";
  }
  var C = CFG.campaigns[campaignKey];
  if (params.get("campaign") || params.get("utm_campaign")) save("bahjah_campaign", campaignKey);
  document.documentElement.setAttribute("data-campaign", campaignKey);

  /* ---------------- routes ---------------- */
  function routeUrl(name) {
    var r = (CFG.routes || {})[name];
    if (!r) return "";
    return (usingFallback && r.fallback) ? r.fallback : r.url;
  }
  function decorate(url) {
    if (!url || !CFG.routing || !CFG.routing.appendUtmToOutbound) return url;
    try {
      var u = new URL(url, location.href);
      if (u.origin === location.origin) return u.href;
      UTM_KEYS.forEach(function (k) { if (last[k] && !u.searchParams.has(k)) u.searchParams.set(k, last[k]); });
      return u.href;
    } catch (e) { return url; }
  }
  function applyRoutes() {
    document.querySelectorAll("[data-route]").forEach(function (a) {
      var url = routeUrl(a.getAttribute("data-route"));
      if (url) {
        a.href = decorate(url);
        a.hidden = false;
      }
    });
    // Conditional blocks that only appear when a route is configured.
    document.querySelectorAll("[data-if-route]").forEach(function (el) {
      el.hidden = !routeUrl(el.getAttribute("data-if-route"));
    });
    // App: show store buttons when configured, otherwise the official-site fallback.
    var hasApp = !!(routeUrl("appIos") || routeUrl("appAndroid"));
    var appFallback = document.querySelector("[data-app-fallback]");
    if (appFallback) appFallback.hidden = hasApp;
  }

  function setCta(el, spec) {
    if (!el || !spec) return;
    el.textContent = spec.label;
    if (spec.route) {
      el.setAttribute("data-route", spec.route);
      el.setAttribute("data-category", spec.category || spec.route);
    } else if (spec.href) {
      el.removeAttribute("data-route");
      el.setAttribute("href", spec.href);
    }
  }

  function applyCampaign() {
    document.querySelectorAll("[data-campaign-text]").forEach(function (el) {
      var v = C[el.getAttribute("data-campaign-text")];
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-campaign-final]").forEach(function (el) {
      var v = C.final && C.final[el.getAttribute("data-campaign-final")];
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-campaign-cta]").forEach(function (el) {
      var which = el.getAttribute("data-campaign-cta");
      var spec = which === "final" ? C.final : C[which];
      if (which === "secondary" && !spec) { el.hidden = true; return; }
      setCta(el, spec);
    });
    if (C.docTitle) document.title = C.docTitle;

    // Highlight the campaign's card and move it first in the chooser.
    var grid = document.querySelector(".give-grid");
    var feat = C.featured && document.querySelector('.give-card[data-give="' + C.featured + '"]');
    if (grid && feat) { feat.classList.add("is-featured"); grid.insertBefore(feat, grid.firstElementChild); }

    // Move the campaign's lead section straight after the chooser.
    var flow = document.getElementById("flow");
    var lead = C.lead && document.querySelector('[data-section="' + C.lead + '"]');
    if (flow && lead) flow.insertBefore(lead, flow.firstElementChild);
  }

  /* ---------------- facts / bank / awards ---------------- */
  function renderBank() {
    var b = CFG.bank || {};
    if (!b.verifiedOn || !b.accounts || !b.accounts.length) return;
    var list = document.querySelector("#bank-verified .bank-list");
    b.accounts.forEach(function (acc) {
      var li = document.createElement("li");
      var name = document.createElement("span"); name.textContent = acc.bank;
      var num = document.createElement("code"); num.textContent = acc.number;
      li.appendChild(name); li.appendChild(num); list.appendChild(li);
    });
    document.getElementById("bank-date").textContent = b.verifiedOn;
    document.getElementById("bank-verified").hidden = false;
    document.getElementById("bank-unverified").hidden = true;
  }
  function renderAwards() {
    var items = CFG.awards || [];
    var ul = document.getElementById("awards");
    if (!ul || !items.length) return;
    items.forEach(function (a) {
      var li = document.createElement("li");
      if (a.image) { var img = document.createElement("img"); img.src = a.image; img.alt = ""; img.loading = "lazy"; li.appendChild(img); }
      var t = document.createElement("span"); t.textContent = a.name + (a.year ? " — " + a.year : ""); li.appendChild(t);
      ul.appendChild(li);
    });
    ul.hidden = false;
  }

  /* ---------------- analytics ---------------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function loadScript(src) { var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }

  function initVendors() {
    if (T.gtmId) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(T.gtmId));
    } else if (T.ga4Id || T.googleAdsId) {
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(T.ga4Id || T.googleAdsId));
      window.gtag("js", new Date());
      if (T.ga4Id) window.gtag("config", T.ga4Id, { campaign_variant: campaignKey });
      if (T.googleAdsId) window.gtag("config", T.googleAdsId);
    }
    if (T.metaPixelId) {
      /* Meta Pixel base code */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", T.metaPixelId);
      window.fbq("track", "PageView");
    }
  }

  function track(event, data) {
    data = data || {};
    data.campaign_variant = campaignKey;
    data.utm_source = last.utm_source || "";
    data.utm_medium = last.utm_medium || "";
    data.utm_campaign = last.utm_campaign || "";
    data.route_mode = usingFallback ? "fallback" : "primary";
    window.dataLayer.push(Object.assign({ event: event }, data));

    var directGtag = !T.gtmId && (T.ga4Id || T.googleAdsId);
    if (directGtag && T.ga4Id) window.gtag("event", event, Object.assign({ transport_type: "beacon" }, data));

    var adsLabel = T.googleAdsLabels && T.googleAdsLabels[event];
    if (directGtag && T.googleAdsId && adsLabel) {
      window.gtag("event", "conversion", { send_to: T.googleAdsId + "/" + adsLabel, value: data.value, currency: T.currency });
    }
    if (window.fbq && T.metaPixelId) {
      if (event === "payment_page_visit") window.fbq("track", "InitiateCheckout", { content_category: data.category, currency: T.currency });
      else if (event === "donation_complete") window.fbq("track", "Donate", { content_category: data.category, value: data.value, currency: T.currency });
      else if (event === "select_giving_category") window.fbq("trackCustom", "SelectGivingCategory", { category: data.category });
    }
  }

  var PAYMENT_ROUTES = { hub: 1, zakat: 1, kaffarat: 1, kafala: 1, ramadan: 1, sadaqah: 1, meat: 1, hardship: 1, renovation: 1, water: 1, bills: 1 };

  function onClick(e) {
    var a = e.target.closest && e.target.closest("a[data-cta]");
    if (!a) return;
    var route = a.getAttribute("data-route") || "";
    var category = a.getAttribute("data-category") || route || "";
    var info = { cta: a.getAttribute("data-cta"), category: category, destination: a.href, route: route };
    track("cta_click", info);
    if (info.cta === "chooser") track("select_giving_category", info);
    if (PAYMENT_ROUTES[route]) {
      track("payment_page_visit", info);
      save("bahjah_last_category", category);
    }
  }

  function checkCompletion() {
    var key = T.completionParam || "donation";
    if (params.get(key) !== (T.completionValue || "complete")) return;
    var ref = params.get("ref") || params.get("order") || "";
    var dedupe = "bahjah_done_" + (ref || location.search);
    if (load(dedupe)) return;
    save(dedupe, 1);
    var value = parseFloat(params.get("value") || "");
    track("donation_complete", {
      category: params.get("category") || load("bahjah_last_category") || "",
      value: isNaN(value) ? undefined : value,
      transaction_id: ref
    });
    showThanks();
  }
  function showThanks() {
    var d = document.createElement("div");
    d.className = "thanks";
    d.setAttribute("role", "status");
    d.textContent = "شكرًا لعطائك — تقبّل الله منك.";
    d.style.cssText = "position:fixed;top:76px;inset-inline:16px;z-index:60;background:#1f5a3d;color:#fff;padding:14px 18px;border-radius:12px;text-align:center;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.18)";
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 6000);
  }

  /* ---------------- route health check ---------------- */
  function healthCheck() {
    var R = CFG.routing || {};
    if (!R.healthCheck || !window.fetch || !window.AbortController) return;
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, R.healthCheckTimeoutMs || 4500);
    fetch(R.healthCheckUrl, { mode: "no-cors", cache: "no-store", signal: ctl.signal })
      .then(function () { clearTimeout(timer); })
      .catch(function () {
        clearTimeout(timer);
        usingFallback = true;
        applyRoutes();
        track("route_fallback", { reason: "primary_unreachable" });
      });
  }

  /* ---------------- sticky CTA ---------------- */
  function initSticky() {
    var bar = document.getElementById("sticky-cta");
    var link = bar && bar.querySelector("a");
    var watch = [document.getElementById("hero-cta"), document.getElementById("final")].filter(Boolean);
    if (!bar || !("IntersectionObserver" in window)) return;
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var show = !Object.keys(visible).some(function (k) { return visible[k]; });
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      link.tabIndex = show ? 0 : -1;
    });
    watch.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- boot ---------------- */
  applyCampaign();
  applyRoutes();
  renderBank();
  renderAwards();
  initVendors();
  document.addEventListener("click", onClick, true);
  track("landing_view", {
    first_source: (attribution.first || {}).utm_source || "",
    gclid: last.gclid || "", fbclid: last.fbclid || ""
  });
  checkCompletion();
  initSticky();
  healthCheck();
})();

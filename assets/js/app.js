/* Bahjah giving landing page — runtime.
 * Campaign variables, UTM persistence, official-route resolution with fallback,
 * analytics (dataLayer / GA4 / Google Ads / Meta Pixel + CAPI-ready event ids),
 * scroll reveal and the sticky mobile CTA. No dependencies.
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
    if (Object.keys(now).length) {
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
  var campaigns = CFG.campaigns || {};
  var campaignKey = (params.get("campaign") || load("bahjah_campaign") || "").toLowerCase();
  if (!campaigns[campaignKey]) {
    // Infer from utm_campaign if it names a known variant (e.g. "zakat_1447_meta").
    var uc = (params.get("utm_campaign") || last.utm_campaign || "").toLowerCase();
    campaignKey = Object.keys(campaigns).filter(function (k) { return uc.indexOf(k) !== -1; })[0] || CFG.defaultCampaign || "general";
  }
  var C = campaigns[campaignKey] || {};
  if (params.get("campaign") || params.get("utm_campaign")) save("bahjah_campaign", campaignKey);
  document.documentElement.setAttribute("data-campaign", campaignKey);

  /* ---------------- language ---------------- */
  var DICT = (window.BAHJAH_I18N || {}).en || {};
  var qLang = (params.get("lang") || "").toLowerCase();
  var lang = (qLang === "en" || qLang === "ar") ? qLang : (load("bahjah_lang") || CFG.defaultLang || "ar");
  function t(key, fallback) { return (lang === "en" && DICT[key]) || fallback; }

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
      if (u.origin === location.origin || u.protocol.indexOf("http") !== 0) return u.href;
      UTM_KEYS.forEach(function (k) { if (last[k] && !u.searchParams.has(k)) u.searchParams.set(k, last[k]); });
      return u.href;
    } catch (e) { return url; }
  }
  function applyRoutes() {
    document.querySelectorAll("[data-route]").forEach(function (a) {
      var url = routeUrl(a.getAttribute("data-route"));
      var emptyRoute = a.getAttribute("data-route-empty");
      if (!url && emptyRoute) url = routeUrl(emptyRoute);
      if (url) { a.href = decorate(url); a.hidden = false; }
    });
    var hasApp = !!(routeUrl("appIos") || routeUrl("appAndroid"));
    var appFallback = document.querySelector("[data-app-fallback]");
    if (appFallback) appFallback.hidden = hasApp;

    var wa = (CFG.contact || {}).whatsapp;
    document.querySelectorAll("[data-whatsapp]").forEach(function (li) {
      li.hidden = !wa;
      var a = li.querySelector("a");
      if (wa && a) a.href = "https://wa.me/" + encodeURIComponent(wa);
    });
  }

  /* ---------------- campaign → DOM ---------------- */
  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) { return o && o[k]; }, obj);
  }
  function setCta(el, spec) {
    if (!el) return;
    if (!spec) { el.hidden = true; return; }
    var icon = el.querySelector("svg");
    var enLabel = getPath(C.en || {}, el.getAttribute("data-campaign-cta"));
    el.textContent = (lang === "en" && typeof enLabel === "string") ? enLabel : spec.label;
    if (icon) el.appendChild(icon);
    if (spec.route) {
      el.setAttribute("data-route", spec.route);
      el.setAttribute("data-category", spec.category || spec.route);
    } else {
      el.removeAttribute("data-route");
      el.removeAttribute("data-category");
      el.setAttribute("href", spec.href || "#choose");
    }
  }

  function campaignText(path) {
    var en = lang === "en" ? getPath(C.en || {}, path) : null;
    return (typeof en === "string" && en) || getPath(C, path);
  }

  var IS_MAIN = !!document.querySelector("[data-campaign-text]");
  var docTitleAr = document.title;

  function applyCampaignText() {
    if (!IS_MAIN) {
      var tk = document.documentElement.getAttribute("data-title-key");
      document.title = (lang === "en" && tk && DICT[tk]) ? DICT[tk] : docTitleAr;
      return;
    }
    document.querySelectorAll("[data-campaign-text]").forEach(function (el) {
      var v = campaignText(el.getAttribute("data-campaign-text"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-campaign-final]").forEach(function (el) {
      var v = campaignText("final." + el.getAttribute("data-campaign-final"));
      if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-campaign-cta]").forEach(function (el) {
      setCta(el, getPath(C, el.getAttribute("data-campaign-cta")));
    });
    var title = campaignText("docTitle");
    if (title) document.title = title;
  }

  function applyCampaign() {
    applyCampaignText();
    if (!IS_MAIN) return;

    // Hero image variant.
    var heroKey = C.heroImage || "iftar";
    document.querySelectorAll("[data-hero]").forEach(function (fig) {
      var on = fig.getAttribute("data-hero") === heroKey;
      fig.hidden = !on;
      if (on) fig.querySelectorAll("img").forEach(function (img) { img.loading = "eager"; });
    });

    // Chooser hierarchy: featured card becomes the lead and moves first.
    var picker = document.querySelector(".picker");
    var feat = document.querySelector('.pick[data-give="' + (C.featured || "zakat") + '"]');
    if (picker && feat) { feat.classList.add("is-lead"); picker.insertBefore(feat, picker.firstElementChild); }

    // Feature-section order.
    var flow = document.getElementById("flow");
    if (flow && C.order) {
      C.order.forEach(function (id) {
        var s = flow.querySelector('[data-section="' + id + '"]');
        if (s) flow.appendChild(s);
      });
    }
  }

  /* ---------------- language switch ---------------- */
  var langListeners = [];
  var metaDesc = document.querySelector('meta[name="description"]');
  var metaDescAr = metaDesc ? metaDesc.getAttribute("content") : "";

  function applyLang(next, fromUser) {
    lang = next === "en" ? "en" : "ar";
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.__ar === undefined) el.__ar = el.innerHTML;
      var en = DICT[el.getAttribute("data-i18n")];
      el.innerHTML = (lang === "en" && en) ? en : el.__ar;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      if (el.__arAria === undefined) el.__arAria = el.getAttribute("aria-label");
      var en = DICT[el.getAttribute("data-i18n-aria")];
      el.setAttribute("aria-label", (lang === "en" && en) ? en : el.__arAria);
    });
    document.querySelectorAll("img[data-alt-en]").forEach(function (img) {
      if (img.__arAlt === undefined) img.__arAlt = img.alt;
      img.alt = lang === "en" ? img.getAttribute("data-alt-en") : img.__arAlt;
    });
    var metaKey = document.documentElement.getAttribute("data-meta-key") || "meta.description";
    if (metaDesc) metaDesc.setAttribute("content", lang === "en" ? (DICT[metaKey] || metaDescAr) : metaDescAr);

    applyCampaignText();
    applyRoutes();              // links inside swapped markup get official URLs + UTMs again
    renderBank();

    var btn = document.getElementById("lang-btn");
    if (btn) {
      var toEn = lang !== "en";
      btn.setAttribute("aria-label", toEn ? "Switch to English" : "التبديل إلى العربية");
      var lbl = btn.querySelector(".lang-label");
      if (lbl) { lbl.textContent = toEn ? "EN" : "عربي"; lbl.lang = toEn ? "en" : "ar"; }
    }
    document.querySelectorAll("[data-lang-toggle]").forEach(function (el) { el.lang = lang === "en" ? "ar" : "en"; });
    langListeners.forEach(function (fn) { try { fn(lang); } catch (e) { /* ignore */ } });
    if (fromUser) {
      save("bahjah_lang", lang);
      track("language_switch", { language: lang });
    }
  }

  /* ---------------- bank / awards ---------------- */
  function renderBank() {
    var b = CFG.bank || {};
    if (!b.verifiedOn || !b.accounts || !b.accounts.length) return;
    // Works on any page: fills every bank list it finds (main page block or [data-bank-list]).
    var lists = document.querySelectorAll("#bank-verified .bank-list, [data-bank-list]");
    lists.forEach(function (list) {
      list.innerHTML = "";
      b.accounts.forEach(function (acc) {
        var li = document.createElement("li");
        var name = document.createElement("span"); name.textContent = (lang === "en" && acc.bankEn) ? acc.bankEn : acc.bank;
        var num = document.createElement("code"); num.textContent = acc.number;
        var btn = document.createElement("button");
        btn.type = "button"; btn.textContent = t("bank.copy", "نسخ");
        btn.setAttribute("aria-label", "نسخ رقم حساب " + acc.bank);
        btn.addEventListener("click", function () {
          try { navigator.clipboard.writeText(acc.number); btn.textContent = t("bank.copied", "تم النسخ"); } catch (e) { /* ignore */ }
          track("bank_transfer_interaction", { action: "copy_account", bank: acc.bank });
        });
        li.appendChild(name); li.appendChild(num); li.appendChild(btn); list.appendChild(li);
      });
      list.hidden = false;
    });
    var date = document.getElementById("bank-date"); if (date) date.textContent = b.verifiedOn;
    var ok = document.getElementById("bank-verified"); if (ok) ok.hidden = false;
    var no = document.getElementById("bank-unverified"); if (no) no.hidden = true;
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
    }
  }

  function eventId() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  // Meta standard-event mapping. Everything else is sent as a custom event.
  var META_MAP = {
    landing_view: "PageView",
    payment_page_visit: "InitiateCheckout",
    donation_complete: "Donate",
    phone_click: "Contact",
    whatsapp_click: "Contact"
  };

  function track(event, data) {
    data = data || {};
    data.event_id = eventId();
    data.campaign_variant = campaignKey;
    data.language = lang;
    data.utm_source = last.utm_source || "";
    data.utm_medium = last.utm_medium || "";
    data.utm_campaign = last.utm_campaign || "";
    data.route_mode = usingFallback ? "fallback" : "primary";
    window.dataLayer.push(Object.assign({ event: event }, data));

    var directGtag = !T.gtmId && (T.ga4Id || T.googleAdsId);
    if (directGtag && T.ga4Id) window.gtag("event", event, Object.assign({ transport_type: "beacon" }, data));
    var adsLabel = T.googleAdsLabels && T.googleAdsLabels[event];
    if (directGtag && T.googleAdsId && adsLabel) {
      window.gtag("event", "conversion", { send_to: T.googleAdsId + "/" + adsLabel, value: data.value, currency: T.currency, transaction_id: data.transaction_id });
    }

    if (window.fbq && T.metaPixelId && !T.gtmId) {
      var std = META_MAP[event];
      var payload = { content_category: data.category, currency: T.currency, value: data.value };
      if (std) window.fbq("track", std, payload, { eventID: data.event_id });
      else window.fbq("trackCustom", event, payload, { eventID: data.event_id });
    }

    // Optional Conversions API relay (same event_id → Meta deduplicates Pixel + server events).
    if (T.capiEndpoint && navigator.sendBeacon) {
      try {
        navigator.sendBeacon(T.capiEndpoint, JSON.stringify({
          event_name: META_MAP[event] || event, event_id: data.event_id, event_time: Math.floor(Date.now() / 1000),
          event_source_url: location.href, custom_data: data, fbclid: last.fbclid || ""
        }));
      } catch (e) { /* ignore */ }
    }
  }

  var PAYMENT_ROUTES = { hub: 1, zakat: 1, kaffarat: 1, kafala: 1, ramadan: 1, sadaqah: 1, meat: 1, hardship: 1, renovation: 1, water: 1, bills: 1 };
  var ROUTE_EVENT = {
    zakat: "zakat_cta_click", ramadan: "ramadan_cta_click", kaffarat: "kaffarat_cta_click",
    hub: "general_donation_click", sadaqah: "general_donation_click",
    kafala: "project_select", hardship: "project_select", water: "project_select",
    meat: "project_select", bills: "project_select", renovation: "project_select",
    zakatCalculator: "zakat_calculator_click", appIos: "app_click", appAndroid: "app_click"
  };

  function onClick(e) {
    var a = e.target.closest && e.target.closest("a[data-cta]");
    if (!a) return;
    var route = a.getAttribute("data-route") || "";
    var cta = a.getAttribute("data-cta");
    var href = a.getAttribute("href") || "";
    var info = { cta: cta, category: a.getAttribute("data-category") || route, destination: a.href, route: route };
    var val = parseFloat(a.getAttribute("data-value") || "");
    if (!isNaN(val)) { info.value = val; save("bahjah_last_amount", val); }

    track("cta_click", info);
    if (cta.indexOf("hero") === 0) track("hero_cta_click", info);
    if (cta === "chooser" || cta === "hero_card") track("select_giving_category", info);
    if (cta === "zakat_calculator") track("zakat_calculator_click", info);
    else if (cta === "app_site") track("app_click", info);
    else if (ROUTE_EVENT[route]) track(ROUTE_EVENT[route], info);
    if (href.indexOf("tel:") === 0) track("phone_click", info);
    if (href.indexOf("wa.me") !== -1 || cta === "contact_whatsapp") track("whatsapp_click", info);
    if (a.getAttribute("data-event")) track(a.getAttribute("data-event"), info);

    if (PAYMENT_ROUTES[route]) {
      track("payment_page_visit", info);   // = official payment-page click
      save("bahjah_last_category", info.category);
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
      value: isNaN(value) ? undefined : value,              // only the amount the payment page reports
      intended_amount: load("bahjah_last_amount") || undefined,
      transaction_id: ref
    });
    var d = document.createElement("div");
    d.setAttribute("role", "status");
    d.textContent = t("thanks", "شكرًا لعطائك — تقبّل الله منك.");
    d.style.cssText = "position:fixed;top:78px;inset-inline:16px;z-index:60;background:#1E5A3C;color:#fff;padding:14px 18px;border-radius:14px;text-align:center;font-weight:600;box-shadow:0 12px 30px rgba(0,0,0,.2)";
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 6000);
  }

  /* ---------------- route health check ---------------- */
  function healthCheck() {
    var R = CFG.routing || {};
    if (!R.healthCheck || params.has("static") || !window.fetch || !window.AbortController) return;
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

  /* ---------------- UI: reveal + sticky ---------------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || params.has("static")) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

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

  /* Small API for page-specific scripts (e.g. fak-korba.js). */
  window.BahjahApp = {
    track: function (e, d) { track(e, d); },
    t: function (k, fb) { return t(k, fb); },
    lang: function () { return lang; },
    routeUrl: function (n) { return decorate(routeUrl(n)); },
    onLang: function (fn) { langListeners.push(fn); },
    config: CFG
  };

  /* ---------------- boot ---------------- */
  applyCampaign();
  applyRoutes();
  renderBank();
  if (lang === "en") applyLang("en", false);
  if (qLang === "en" || qLang === "ar") save("bahjah_lang", lang);
  var langBtn = document.getElementById("lang-btn");
  if (langBtn) langBtn.addEventListener("click", function () { applyLang(lang === "en" ? "ar" : "en", true); });
  document.querySelectorAll("[data-lang-toggle]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); applyLang(lang === "en" ? "ar" : "en", true); window.scrollTo({ top: 0 }); });
  });
  renderAwards();
  initVendors();
  if (window.fbq && T.metaPixelId) window.fbq("init", T.metaPixelId);
  document.addEventListener("click", onClick, true);
  track("landing_view", {
    first_source: (attribution.first || {}).utm_source || "",
    gclid: last.gclid || "", fbclid: last.fbclid || ""
  });
  checkCompletion();
  initReveal();
  initSticky();
  healthCheck();
})();

/*
 * Bahjah giving landing page — campaign configuration.
 *
 * Everything a campaign manager needs to change lives in this file.
 * Pick the campaign per ad set with ?campaign=zakat | ramadan | eid | general
 * (falls back to `defaultCampaign`).
 *
 * SOURCE RULE: every amount / fact here must trace to an official Bahjah source.
 * See SOURCES.md for the provenance and verification status of each value.
 */
window.BAHJAH_CONFIG = {
  defaultCampaign: "general",

  /* ------------------------------------------------------------------
   * Official destinations (primary = bahjah.org.om, per campaign brief).
   * `fallback` = the same initiative on Jood (Ministry of Social
   * Development portal, verified live 28 Sep 2026). Used only when
   * `routing.healthCheck` detects bahjah.org.om is unreachable.
   * `null` fallback = no equivalent online route; link is left as-is.
   * ------------------------------------------------------------------ */
  routes: {
    hub:       { url: "https://bahjah.org.om/wp/التبرعات/", fallback: "https://jood.om/ar/Board/CharityProfile/about/8659" },
    zakat:     { url: "https://bahjah.org.om/wp/product/الزكاة/", fallback: null },
    kaffarat:  { url: "https://bahjah.org.om/wp/product/كفارات/", fallback: "https://jood.om/ar/Donate/Initiative/bfeeaf34-f73b-4b10-afa1-b0a60000b0a6" },
    kafala:    { url: "https://bahjah.org.om/wp/product/برنامج-كفالة-يتيم/", fallback: "https://jood.om/ar/Donate/Initiative/3a0f60a4-f1f5-4102-8a44-b09c0000b09c" },
    // No dedicated product URL was confirmed for these on bahjah.org.om — they route to the hub.
    // Paste the product URL here once confirmed (e.g. .../wp/product/السلة-الرمضانية/).
    ramadan:   { url: "https://bahjah.org.om/wp/التبرعات/", fallback: "https://jood.om/ar/Donate/Initiative/5fa7fa49-6492-46ca-9ff9-b1170000b117" },
    sadaqah:   { url: "https://bahjah.org.om/wp/التبرعات/", fallback: "https://jood.om/ar/Donate/Initiative/cdf254ac-ca46-4647-a193-b0a40000b0a4" },
    meat:      { url: "https://bahjah.org.om/wp/التبرعات/", fallback: "https://jood.om/ar/Donate/Initiative/fbd635b1-8115-4766-8db9-b1290000b129" },
    hardship:  { url: "https://bahjah.org.om/wp/التبرعات/", fallback: "https://jood.om/ar/Donate/Initiative/f91012f5-6a7d-4c9f-b7e8-b0a40000b0a4" },
    renovation:{ url: "https://bahjah.org.om/wp/التبرعات/", fallback: "https://jood.om/ar/Donate/Initiative/264b804c-3680-4d63-bef2-b0a40000b0a4" },
    water:     { url: "https://bahjah.org.om/wp/التبرعات/", fallback: null },
    bills:     { url: "https://bahjah.org.om/wp/التبرعات/", fallback: null },
    forms:     { url: "https://bahjah.org.om/wp/الاستمارات/", fallback: null },
    contact:   { url: "https://bahjah.org.om/wp/تواصل/", fallback: null },
    home:      { url: "https://bahjah.org.om/wp/", fallback: null },
    // Legacy Zakat calculators (calendar year / Hijri year / Zakat al-Fitr).
    // Leave empty until confirmed live — the link is hidden while empty.
    zakatCalculator: { url: "", fallback: null },
    // Official app store links. Leave empty until confirmed — the app card then points to the official site.
    appIos:     { url: "", fallback: null },
    appAndroid: { url: "", fallback: null }
  },

  routing: {
    // Probe bahjah.org.om on load; if unreachable, swap links that have a fallback to Jood.
    healthCheck: true,
    healthCheckUrl: "https://bahjah.org.om/wp/",
    healthCheckTimeoutMs: 4500,
    // Append the visitor's stored UTM/click-id params to outbound official links.
    appendUtmToOutbound: true
  },

  /* ------------------------------------------------------------------
   * Campaign variants. Only ONE primary CTA per campaign.
   * `lead` = which content section is moved directly after the chooser.
   * `featured` = which giving card is highlighted first.
   * ------------------------------------------------------------------ */
  campaigns: {
    general: {
      eyebrow: "جمعية بهجة العمانية للأيتام",
      headline: "عطاؤك يصنع بهجةً في بيوت الأيتام",
      sub: "زكاة، صدقة، كفارة، أو مشروع موسمي — اختر طريقة عطائك وأكمل تبرعك عبر الصفحات الرسمية للجمعية.",
      primary: { label: "ساهم بعطائك", route: "hub", category: "general" },
      secondary: { label: "اختر نوع العطاء", href: "#choose" },
      final: { title: "عطاءٌ قليل، وبهجةٌ كبيرة", text: "اختر مشروعك وأكمل التبرع بأمان عبر صفحة الدفع الرسمية.", label: "ساهم بعطائك", route: "hub", category: "general" },
      sticky: { label: "ساهم بعطائك", route: "hub", category: "general" },
      lead: "sadaqah",
      featured: "sadaqah",
      docTitle: "تبرّع لأيتام بهجة | جمعية بهجة العمانية للأيتام"
    },
    zakat: {
      eyebrow: "زكاة المال",
      headline: "زكاتك أمانة، تصل إلى الأيتام المسجلين لدى بهجة",
      sub: "أخرج زكاة مالك لصالح الأيتام المسجلين لدى جمعية بهجة العمانية للأيتام، عبر صفحة الزكاة الرسمية.",
      primary: { label: "أخرج زكاتك الآن", route: "zakat", category: "zakat" },
      secondary: { label: "عن زكاة المال في بهجة", href: "#zakat" },
      final: { title: "أدِّ زكاتك إلى مستحقيها", text: "صفحة الزكاة الرسمية لجمعية بهجة العمانية للأيتام.", label: "أخرج زكاتك الآن", route: "zakat", category: "zakat" },
      sticky: { label: "أخرج زكاتك الآن", route: "zakat", category: "zakat" },
      lead: "zakat",
      featured: "zakat",
      docTitle: "أخرج زكاتك للأيتام | جمعية بهجة العمانية للأيتام"
    },
    ramadan: {
      eyebrow: "مشروع السلة الرمضانية",
      headline: "سلةٌ رمضانية تكفي أسرة يتيم معظم أيام الشهر",
      sub: "مشروع سنوي تقدّمه جمعية بهجة لأسر الأيتام المسجلة لديها — ٣٥ ر.ع للأسرة الواحدة.",
      primary: { label: "ساهم في السلة الرمضانية", route: "ramadan", category: "ramadan_basket" },
      secondary: { label: "كفارات الصيام", href: "#kaffarat" },
      final: { title: "شارك أسر الأيتام مائدة رمضان", text: "٣٥ ر.ع تكفي سلة أسرة مسجلة لمعظم أيام الشهر، بحسب الملف التعريفي للجمعية.", label: "ساهم في السلة الرمضانية", route: "ramadan", category: "ramadan_basket" },
      sticky: { label: "ساهم في السلة الرمضانية", route: "ramadan", category: "ramadan_basket" },
      lead: "ramadan",
      featured: "ramadan",
      docTitle: "السلة الرمضانية لأسر الأيتام | جمعية بهجة العمانية للأيتام"
    },
    eid: {
      eyebrow: "عطاء العيد",
      headline: "اجعل فرحة العيد أوسع لأسر الأيتام",
      sub: "صدقة عامة، ذبائح، أو كفالة يتيم — اختر مشروعك وأكمل تبرعك عبر الصفحات الرسمية لجمعية بهجة.",
      primary: { label: "ساهم بعطائك", route: "hub", category: "general" },
      secondary: { label: "اختر نوع العطاء", href: "#choose" },
      final: { title: "شارك الأيتام فرحة العيد", text: "اختر مشروعك وأكمل التبرع عبر صفحة الدفع الرسمية.", label: "ساهم بعطائك", route: "hub", category: "general" },
      sticky: { label: "ساهم بعطائك", route: "hub", category: "general" },
      lead: "sadaqah",
      featured: "sadaqah",
      docTitle: "عطاء العيد لأسر الأيتام | جمعية بهجة العمانية للأيتام"
    }
  },

  /* Documented facts (see SOURCES.md). */
  facts: {
    ramadanBasketOmr: 35,
    kaffarat: { oath: 15, fastingDay: 1.5, fastingMonth: 45 }
  },

  /* ------------------------------------------------------------------
   * Bank transfer. Account numbers are NOT rendered until `verifiedOn`
   * is set to the date someone confirmed them on the LIVE Bahjah
   * contact/payment page. Until then the page tells donors to confirm
   * current account details with Bahjah.
   * ------------------------------------------------------------------ */
  bank: {
    verifiedOn: "", // e.g. "2026-10-02" — set only after checking bahjah.org.om/wp/تواصل/
    accounts: [
      { bank: "بنك مسقط", number: "0397000008880035" },
      { bank: "بنك ظفار", number: "01041328888001" }
    ]
  },

  /* Contact details as published by Bahjah on its Jood profile (checked 28 Sep 2026). */
  contact: {
    phones: ["23289966", "91403312", "91403373"],
    email: "bahjah1.omani@gmail.com",
    x: "https://x.com/bahjah1_omani"
  },

  /* Awards / certifications. Add only items shown on the current official site. Empty = block hidden. */
  awards: [
    // { name: "", year: "", image: "assets/img/award-x.png", source: "https://bahjah.org.om/wp/..." }
  ],

  /* ------------------------------------------------------------------
   * Analytics. Leave IDs empty to disable a vendor (events still go to dataLayer).
   * ------------------------------------------------------------------ */
  tracking: {
    gtmId: "",            // "GTM-XXXXXXX" — preferred: load everything via GTM
    ga4Id: "",            // "G-XXXXXXXXXX" — only if not using GTM
    googleAdsId: "",      // "AW-XXXXXXXXX"
    googleAdsLabels: {    // conversion labels from Google Ads
      payment_page_visit: "",
      donation_complete: ""
    },
    metaPixelId: "",      // "123456789012345"
    // When the payment provider redirects back here after a successful donation,
    // point it to: <landing-url>?donation=complete&category=<cat>&value=<omr>
    completionParam: "donation",
    completionValue: "complete",
    currency: "OMR"
  }
};

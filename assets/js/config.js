/*
 * Bahjah giving landing page — campaign configuration.
 *
 * Everything a campaign manager needs to change lives in this file.
 * Pick the campaign per ad set with ?campaign=zakat | ramadan | eid | general
 * (falls back to a variant named inside utm_campaign, then `defaultCampaign`).
 *
 * SOURCE RULE: every amount / fact here must trace to an official Bahjah source.
 * See SOURCES.md for the provenance and verification status of each value.
 */
window.BAHJAH_CONFIG = {
  defaultCampaign: "general",
  // "ar" | "en". Visitors can switch with the header button; ?lang=en forces English (e.g. English ads).
  defaultLang: "ar",

  /* ------------------------------------------------------------------
   * Official destinations (primary = bahjah.org.om).
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
    // No dedicated product URL has been confirmed for these on bahjah.org.om — they route to the hub.
    // Paste the CURRENT product URL here once confirmed from the live site (do not guess slugs).
    ramadan:   { url: "https://bahjah.org.om/wp/product/السلة-الرمضانية/", fallback: "https://jood.om/ar/Donate/Initiative/5fa7fa49-6492-46ca-9ff9-b1170000b117" },
    sadaqah:   { url: "https://bahjah.org.om/wp/product/صدقة/", fallback: "https://jood.om/ar/Donate/Initiative/cdf254ac-ca46-4647-a193-b0a40000b0a4" },
    meat:      { url: "https://bahjah.org.om/wp/product/الذبائح/", fallback: "https://jood.om/ar/Donate/Initiative/fbd635b1-8115-4766-8db9-b1290000b129" },
    hardship:  { url: "https://bahjah.org.om/wp/product/فك-كربة/", fallback: "https://jood.om/ar/Donate/Initiative/f91012f5-6a7d-4c9f-b7e8-b0a40000b0a4" },
    renovation:{ url: "https://bahjah.org.om/wp/product/بناء-و-ترميم/", fallback: "https://jood.om/ar/Donate/Initiative/264b804c-3680-4d63-bef2-b0a40000b0a4" },
    water:     { url: "https://bahjah.org.om/wp/product/مياة-بهجة/", fallback: null },
    bills:     { url: "https://bahjah.org.om/wp/product/سداد-فواتير/", fallback: null },
    forms:     { url: "https://bahjah.org.om/wp/الاستمارات/", fallback: null },
    contact:   { url: "https://bahjah.org.om/wp/تواصل/", fallback: null },
    media:     { url: "https://bahjah.org.om/wp/المركز-الاعلامي/", fallback: null },
    home:      { url: "https://bahjah.org.om/wp/", fallback: null },
    privacy:   { url: "https://bahjah.org.om/wp/سياسة-الخصوصية/", fallback: null },
    // Official Zakat calculator. Leave empty until confirmed live — while empty the
    // "احسب زكاتك" button points to the official site (where the app and tools are listed).
    zakatCalculator: { url: "", fallback: null },
    // Official app store links. Leave empty until confirmed — the app card then points to the official site.
    appIos:     { url: "https://apps.apple.com/om/app/bahjah-association-for-orphans/id1574084411", fallback: null },
    appAndroid: { url: "https://play.google.com/store/apps/details?id=om.digitalorbits.bahjah", fallback: null }
  },

  routing: {
    // Probe bahjah.org.om on load; if unreachable, swap links that have a fallback to Jood.
    healthCheck: true,
    healthCheckUrl: "https://bahjah.org.om/wp/",
    healthCheckTimeoutMs: 4500,
    // Append the visitor's stored UTM params to outbound official links.
    appendUtmToOutbound: true
  },

  /* ------------------------------------------------------------------
   * Campaign variants.
   *   hero.primary / hero.secondary : { label, route | href }
   *   featured : chooser card shown largest + first ("zakat" | "ramadan" | "kaffarat" | "sadaqah")
   *   order    : order of the four feature sections after the chooser
   *   heroImage: "iftar" (default) | "eid"
 *   en       : English copy for the same fields (labels only — routes come from the Arabic spec)
   * ------------------------------------------------------------------ */
  campaigns: {
    general: {
      eyebrow: "جمعية بهجة العمانية للأيتام",
      headline: "في رمضان… اجعل لعطائك أثرًا في حياة يتيم",
      sub: "رمضان شهر الرحمة، وشهر تتضاعف فيه أبواب الخير. اجعل من زكاتك وصدقتك وكفارتك سببًا في إدخال الفرح والطمأنينة إلى بيوت الأيتام، وأتمّ تبرعك بأمان عبر القنوات الرسمية لجمعية بهجة العمانية للأيتام.",
      primary:   { label: "ساهم الآن", route: "hub", category: "general" },
      secondary: { label: "اختر باب الخير", href: "#choose" },
      sticky:    { label: "اختر باب الخير", href: "#choose" },
      final: {
        title: "عطاءٌ قد يبدو قليلًا… وأثره عند الله كبير",
        text: "قد لا تعرف وجه من أسعدته صدقتك، وقد لا ترى أثر عطائك بعينيك… لكن الله يعلم.",
        primary:   { label: "ساهم بعطائك الآن", route: "hub", category: "general" },
        secondary: { label: "اختر باب الخير", href: "#choose" }
      },
      featured: "zakat",
      order: ["zakat", "ramadan", "kaffarat", "sadaqah"],
      heroImage: "iftar",
      docTitle: "التبرع للأيتام في رمضان | زكاة وصدقة وكفارة — جمعية بهجة العمانية للأيتام",
      en: {
        eyebrow: "Omani Bahjah Orphan Society",
        headline: "This Ramadan… let your giving touch an orphan's life",
        sub: "Ramadan is the month of mercy, when the doors of goodness open wider. Let your Zakat, Sadaqah and Kaffarah bring joy and peace of mind into the homes of orphans, and complete your donation securely through the official channels of the Omani Bahjah Orphan Society.",
        primary: "Give now", secondary: "Choose a door of goodness", sticky: "Choose a door of goodness",
        final: { title: "A gift that may seem small… yet great with Allah", text: "You may never see the face your Sadaqah made happy, nor witness the effect of your giving with your own eyes… but Allah knows.", primary: "Give now", secondary: "Choose a door of goodness" },
        docTitle: "Donate to Orphans this Ramadan | Zakat, Sadaqah & Kaffarah — Omani Bahjah Orphan Society"
      }
    },
    zakat: {
      eyebrow: "زكاة المال",
      headline: "أخرج زكاتك للأيتام المسجلين لدى بهجة",
      sub: "تتيح جمعية بهجة العمانية للأيتام إخراج زكاة المال لصالح الأيتام المسجلين لديها، عبر صفحة الزكاة الرسمية.",
      primary:   { label: "أخرج زكاتك الآن", route: "zakat", category: "zakat" },
      secondary: { label: "اختر طريقة عطائك", href: "#choose" },
      sticky:    { label: "أخرج زكاتك الآن", route: "zakat", category: "zakat" },
      final: {
        title: "أدِّ زكاتك إلى مستحقيها",
        text: "عبر صفحة الزكاة الرسمية لجمعية بهجة العمانية للأيتام.",
        primary:   { label: "أخرج زكاتك الآن", route: "zakat", category: "zakat" },
        secondary: { label: "اختر نوع العطاء", href: "#choose" }
      },
      featured: "zakat",
      order: ["zakat", "ramadan", "kaffarat", "sadaqah"],
      heroImage: "iftar",
      docTitle: "أخرج زكاتك للأيتام | جمعية بهجة العمانية للأيتام",
      en: {
        eyebrow: "Zakat al-Mal",
        headline: "Pay your Zakat to orphans registered with Bahjah",
        sub: "Omani Bahjah Orphan Society lets you pay your wealth Zakat for the orphans registered with it, through its official Zakat page.",
        primary: "Pay your Zakat now", secondary: "Choose how to give", sticky: "Pay your Zakat now",
        final: { title: "Deliver your Zakat to those entitled to it", text: "Through the official Zakat page of Omani Bahjah Orphan Society.", primary: "Pay your Zakat now", secondary: "Choose a giving type" },
        docTitle: "Pay your Zakat for orphans | Omani Bahjah Orphan Society"
      }
    },
    ramadan: {
      eyebrow: "مشروع السلة الرمضانية",
      headline: "سلةٌ رمضانية تصل إلى أسر الأيتام",
      sub: "مشروع سنوي تقدّمه جمعية بهجة لأسر الأيتام المسجلة لديها — قيمة السلة 15 ر.ع.",
      primary:   { label: "ساهم في السلة الرمضانية", route: "ramadan", category: "ramadan_basket" },
      secondary: { label: "اختر طريقة عطائك", href: "#choose" },
      sticky:    { label: "ساهم في السلة الرمضانية", route: "ramadan", category: "ramadan_basket" },
      final: {
        title: "شارك أسر الأيتام مائدة رمضان",
        text: "قيمة السلة 15 ر.ع في حملة رمضان 2026م / 1447هـ، بحسب إعلان الجمعية الرسمي.",
        primary:   { label: "ساهم في السلة الرمضانية", route: "ramadan", category: "ramadan_basket" },
        secondary: { label: "اختر نوع العطاء", href: "#choose" }
      },
      featured: "ramadan",
      order: ["ramadan", "kaffarat", "zakat", "sadaqah"],
      heroImage: "iftar",
      docTitle: "السلة الرمضانية لأسر الأيتام | جمعية بهجة العمانية للأيتام",
      en: {
        eyebrow: "Ramadan Basket project",
        headline: "A Ramadan basket that reaches orphan families",
        sub: "An annual project for the orphan families registered with Bahjah — OMR 15 per basket.",
        primary: "Contribute to the Ramadan Basket", secondary: "Choose how to give", sticky: "Contribute to the Ramadan Basket",
        final: { title: "Share Ramadan's table with orphan families", text: "The basket value is OMR 15 for the Ramadan 2026 / 1447 AH campaign, as announced by the society.", primary: "Contribute to the Ramadan Basket", secondary: "Choose a giving type" },
        docTitle: "Ramadan Basket for orphan families | Omani Bahjah Orphan Society"
      }
    },
    eid: {
      eyebrow: "عطاء العيد",
      headline: "اجعل فرحة العيد أوسع لأسر الأيتام",
      sub: "صدقة عامة، ذبائح، أو كفالة يتيم — اختر مشروعك وأكمل تبرعك عبر الصفحات الرسمية لجمعية بهجة.",
      primary:   { label: "اختر طريقة عطائك", href: "#choose" },
      secondary: { label: "ساهم بعطائك", route: "hub", category: "general" },
      sticky:    { label: "اختر طريقة عطائك", href: "#choose" },
      final: {
        title: "شارك الأيتام فرحة العيد",
        text: "اختر باب عطائك وأكمل تبرعك بأمان عبر الصفحة الرسمية لجمعية بهجة.",
        primary:   { label: "ساهم بعطائك", route: "hub", category: "general" },
        secondary: { label: "اختر نوع العطاء", href: "#choose" }
      },
      featured: "sadaqah",
      order: ["sadaqah", "zakat", "kaffarat", "ramadan"],
      heroImage: "eid",
      docTitle: "عطاء العيد لأسر الأيتام | جمعية بهجة العمانية للأيتام",
      en: {
        eyebrow: "Eid giving",
        headline: "Make Eid joy reach more orphan families",
        sub: "General sadaqah, meat donations or orphan sponsorship — choose your project and complete your donation on Bahjah's official pages.",
        primary: "Choose how to give", secondary: "Give now", sticky: "Choose how to give",
        final: { title: "Share the joy of Eid with orphans", text: "Choose how you give and complete your donation securely on Bahjah's official page.", primary: "Give now", secondary: "Choose a giving type" },
        docTitle: "Eid giving for orphan families | Omani Bahjah Orphan Society"
      }
    }
  },

  /* ------------------------------------------------------------------
   * «فك كربة» page (/fak-korba/) — immediate-donation appeal.
   * Bahjah documents this initiative as «فك كربة» under cash assistance:
   * debt settlement for families (Jood initiative f91012f5…).
   * ------------------------------------------------------------------ */
  fakKorba: {
    route: "hardship",            // routes.hardship — paste the official فك كربة product URL there once confirmed
    amounts: [5, 10, 20, 50],     // OMR quick-pick amounts (one-time)
    defaultAmount: 10,
    minAmount: 1,

    /* A SPECIFIC CASE. Leave enabled:false unless Bahjah has supplied real, current figures
     * and an approved (anonymised) story. Never estimate or invent these numbers.
     * When enabled, the page shows: required / raised / remaining, % and a progress bar,
     * the "urgent case" tag and the case story. */
    case: {
      enabled: false,
      target: 0,                  // OMR required, e.g. 4000
      raised: 0,                  // OMR raised so far, e.g. 2480
      updatedOn: "",              // date the figures were confirmed, e.g. "2026-10-03"
      source: "",                 // who confirmed them (internal note, not shown)
      story: { ar: "", en: "" }   // 2–3 sentences, anonymised, approved by Bahjah
    }
  },

  /* Documented facts (see SOURCES.md). */
  facts: {
    ramadanBasketOmr: 15,   // official Ramadan 2026 / 1447 AH poster (bahjah.org.om, Feb 2026)
    kaffarat: { oath: 15, fastingDay: 1.5, fastingMonth: 45 }
  },

  /* ------------------------------------------------------------------
   * Bank transfer. Account numbers are NOT rendered until `verifiedOn`
   * is set to the date someone confirmed them on the LIVE Bahjah
   * contact/payment page.
   * ------------------------------------------------------------------ */
  bank: {
    verifiedOn: "2026-10-07", // matches the official Ramadan 2026 poster published on bahjah.org.om
    accounts: [
      { bank: "بنك مسقط", bankEn: "Bank Muscat", number: "0397000008880035" },
      { bank: "بنك ظفار", bankEn: "Bank Dhofar", number: "01041328888001" }
    ]
  },

  /* Contact details as published by Bahjah (Jood profile, checked 28 Sep 2026). Re-verify on /wp/تواصل/. */
  contact: {
    phones: ["92877577", "23289966"],   // official contact page, 7 Oct 2026
    email: "bahjah1.omani@gmail.com",
    whatsapp: "96892877577", // official site WhatsApp link (api.whatsapp.com/send?phone=96892877577)
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
    googleAdsLabels: {    // conversion labels from Google Ads (keys = dataLayer event names)
      payment_page_visit: "",
      donation_complete: ""
    },
    metaPixelId: "",      // "123456789012345"
    // Meta Conversions API: every event carries an `event_id` (also sent to the Pixel as eventID)
    // so a server-side sender (e.g. GTM server container) can deduplicate. Optional endpoint that
    // receives a JSON beacon per event — leave empty unless you run one.
    capiEndpoint: "",
    // When the payment page redirects back after a successful donation, point it to:
    // <landing-url>?donation=complete&category=<cat>&value=<omr>&ref=<order_id>
    completionParam: "donation",
    completionValue: "complete",
    currency: "OMR"
  }
};

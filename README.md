# Bahjah giving landing page

A static, dependency-free, Arabic RTL, mobile-first campaign page for Zakat, Ramadan, Eid and
year-round giving to جمعية بهجة العمانية للأيتام. It sends every donor to the official
Bahjah payment pages, so there is no payment form here.

```
src/index.src.html       ← EDIT THIS: main giving page (Zakat / Ramadan / Kaffarat / Sadaqah)
src/fak-korba.src.html   ← EDIT THIS: «فك كربة» urgent-donation page
index.html               generated — do not edit by hand
fak-korba/index.html     generated — do not edit by hand
assets/css/styles.css    styles (one typeface: IBM Plex Sans Arabic)
assets/js/config.js      ← campaign variables, routes, facts, bank, contact, tracking IDs
assets/js/i18n.js        English strings for the language toggle
assets/js/fak-korba.js   «فك كربة» amount picker + case box
assets/js/app.js         runtime (campaign switch, UTM, tracking, fallback, reveal, sticky CTA)
assets/img/opt/          optimised AVIF / WebP / JPEG variants (generated)
assets/img/src/          original downloads (git-ignored — keep a copy elsewhere)
tools/optimize_images.py crops + exports image variants
tools/build_html.py      expands <pic> shortcodes → responsive <picture> in index.html
SOURCES.md               provenance + verification status of every fact and image
```

## Build

Requires Python 3 and Pillow with AVIF/WebP support.

```bash
python3 tools/optimize_images.py
```

```bash
python3 tools/build_html.py
```

Only the second step is needed after text or markup edits. Deploy the whole folder except
`src/`, `tools/` and `assets/img/src/`.

## Page structure

1. **Hero:** headline and one primary CTA, with a floating «اختر باب عطائك» card that links straight to Zakat, the Ramadan basket, Kaffarat and Sadaqah.
2. **Chooser «كيف تحب أن تعطي؟»:** numbered 01–05, with a swipeable row on mobile. The featured type gets a large dark lead card.
3. **Zakat feature:** official Zakat link, the «احسب زكاتك» component and the fatwa-referral note.
4. **Ramadan basket:** full-bleed stage showing 35 ر.ع with its source.
5. **Kaffarat:** three separate amount blocks (15 / 1.5 / 45).
6. **Sadaqah:** «صدقتك حيث الحاجة» plus a compact six-project picker.
7. **«أبواب من عطائك»:** asymmetric mosaic. Real Bahjah photos are tagged «من بهجة».
8. **Trust:** fact timeline plus the official-payment-channels panel.
9. **Three ways to give:** website, app, bank transfer. Bank numbers stay hidden until verified.
10. **FAQ:** accordion, plus a contact card.
11. **Final CTA**, and a sticky CTA on mobile.

## «فك كربة» page — `/fak-korba/`

A single-purpose, immediate-donation page for Bahjah's «فك كربة» (hardship relief / debt settlement) initiative.

**Flow:** human hook («أسرة تنتظر الفرج… هل تكون أنت سبب الفرج؟») → case box (only with real data) → «كيف يساعد تبرعك؟» → amount picker + story → «لماذا بهجة؟» + secure payment + where the money goes → «قد يكون تبرعك اليوم هو الفرج الذي تنتظره هذه الأسرة».

- **Amounts:** 5 / 10 / 20 / 50 OMR plus a custom amount, one-time only (`config.fakKorba.amounts`, `defaultAmount`). The page cannot pre-fill the amount on the official payment page, so the CTA shows the amount and a note tells donors to enter it there.
- **Case box and story:** fill `config.fakKorba.case` (`target`, `raised`, `updatedOn`, `story.ar` / `story.en`) with figures and an anonymised story approved by Bahjah, set `enabled: true`, then rebuild. While it's disabled, the page runs as a general «فك كربة» appeal. Never estimate these numbers.
- **Destination:** `routes.hardship`. It currently points to the donation hub, with the Jood «فك كربة» initiative as the fallback. Paste the official «فك كربة» product URL there once confirmed.
- **Tracking:** `select_amount` (value, preset or custom), and `cta_click` / `project_select` / `payment_page_visit` with `value` = the chosen amount. `donation_complete` only reports the value sent back by the payment page, plus `intended_amount`.
- **SEO:** the Arabic title, description and headings target فك كربة عمان، تبرع عاجل، مساعدة أسرة محتاجة، تفريج كربة، تبرع الآن، صدقة. The English versions (`?lang=en`) target Emergency Donation Oman, Donate Now Oman, Urgent Charity Oman.
- **Ad URLs:** `https://forestgreen-camel-125506.hostingersite.com/fak-korba/` for Arabic, and the same URL with `?lang=en` for English.

## Language toggle (Arabic / English)

The header button switches the whole page between Arabic (RTL) and English (LTR) without reloading.

- Arabic is the source and lives in `src/index.src.html`. Translatable elements carry `data-i18n="key"`, and English strings are in `assets/js/i18n.js`. Image `alten="…"` attributes become `data-alt-en`.
- Campaign copy (hero, CTAs, final section, page title) is in `config.campaigns.<name>.en`.
- `?lang=en` forces English (use it for English ads). The visitor's choice is remembered in localStorage, and `config.defaultLang` sets the default.
- Every analytics event carries `language`, and switching fires `language_switch`.
- Official Bahjah donation pages are unchanged, so English visitors still pay on the official site.
- When you add new Arabic text, give it a `data-i18n` key and add the English to `i18n.js`. Otherwise it stays Arabic in English mode.

## Campaign variants

Add `?campaign=` to the ad URL. If it's missing, the page looks for a variant name inside
`utm_campaign` (e.g. `zakat_1447_meta` resolves to zakat), then falls back to `general`.

| URL | Hero primary CTA | Lead chooser card | Section order | Hero image |
|---|---|---|---|---|
| `?campaign=general` | اختر طريقة عطائك (+ secondary أخرج زكاتك الآن) | Zakat | Zakat → Ramadan → Kaffarat → Sadaqah | iftar |
| `?campaign=zakat` | أخرج زكاتك الآن | Zakat | Zakat → Ramadan → Kaffarat → Sadaqah | iftar |
| `?campaign=ramadan` | ساهم في السلة الرمضانية | Ramadan | Ramadan → Kaffarat → Zakat → Sadaqah | iftar |
| `?campaign=eid` | اختر طريقة عطائك (+ secondary ساهم بعطائك) | Sadaqah | Sadaqah → Zakat → Kaffarat → Ramadan | Eid |

All of this lives in `config.campaigns`.

## Tracking

Every event goes to `window.dataLayer`. Each event has a unique `event_id` plus
`campaign_variant`, `utm_*`, `category`, `destination` and `route_mode`. When the relevant IDs are
set in `config.tracking` without GTM, the page also calls gtag and the Meta Pixel directly.

| Event | Fires on | Meta (direct mode) |
|---|---|---|
| `landing_view` | page load | PageView |
| `hero_cta_click` | any hero CTA or hero-card item | custom |
| `select_giving_category` | chooser card or hero-card item | custom |
| `zakat_cta_click` / `ramadan_cta_click` / `kaffarat_cta_click` | any link to that route | custom |
| `general_donation_click` | donation hub / sadaqah links | custom |
| `project_select` | Kafala, hardship, water, meat, bills, renovation | custom |
| `zakat_calculator_click` | «احسب زكاتك» | custom |
| `payment_page_visit` | **any click to an official payment page** | InitiateCheckout |
| `app_click` | app store / app-links button | custom |
| `phone_click` / `whatsapp_click` | `tel:` / WhatsApp links | Contact |
| `bank_transfer_interaction` | «تحقّق من الحسابات», FAQ bank link, copy-account button | custom |
| `donation_complete` | return URL `?donation=complete&category=&value=&ref=` | Donate |
| `route_fallback` | bahjah.org.om unreachable, Jood links swapped in | custom |

- **Meta Conversions API:** the Pixel receives `eventID` = `event_id`. Send the same id server-side, either from a GTM server container reading the dataLayer or via `tracking.capiEndpoint` (the page beacons a JSON payload there), and Meta will deduplicate.
- **Completed donations:** this page can't see the payment result. Ask Bahjah's web team to redirect successful payments to `https://<landing-url>/?donation=complete&category={cat}&value={amount}&ref={order_id}`. `ref` de-duplicates reloads. No other conversion is recorded as a donation.
- **UTM persistence:** `utm_*` values and click IDs are stored in localStorage as first- and last-touch. `utm_*` values are added to every outbound official link.
- **QA switch:** `?static=1` shows all reveal-animated blocks and skips the route health check. Use it for screenshots only.

## Route fallback

On load the page pings `bahjah.org.om` (4.5 s timeout). If the site is unreachable, links that
have a Jood `fallback` switch to it. Zakat has no Jood equivalent and always stays on the official
URL. Disable with `routing.healthCheck: false`.

## ⚠ Pre-launch checklist

1. **Open bahjah.org.om** (unreachable from the build machine) and confirm every ⚠ row in `SOURCES.md`.
2. **Ramadan basket URL:** paste the current official product URL into `routes.ramadan`. It currently points to the donation hub. Do the same for Sadaqah, Water, Bills, Meat and Hardship.
3. **Zakat calculator:** set `routes.zakatCalculator.url` once the official calculator is confirmed live. Until then «احسب زكاتك» opens the official site.
4. **App links:** set `appIos` / `appAndroid`.
5. **Bank accounts:** verify them on `/wp/تواصل/`, then set `bank.verifiedOn`.
6. **WhatsApp:** set `contact.whatsapp` only if Bahjah confirms an official WhatsApp number.
7. **Contact numbers:** re-check the three phone numbers and the email on the live contact page.
8. **Real photos:** swap Pexels images for Bahjah media-center photos where available (see `SOURCES.md`).
9. **Awards:** add current badges to `config.awards`.
10. **Tracking IDs:** set `gtmId` (or `ga4Id` / `googleAdsId`) and `metaPixelId`, then test in GTM Preview and Meta Events Manager.
11. **Canonical / OG URLs** in `src/index.src.html` point to the Hostinger URL. Update them if the domain changes, then rebuild.

# Bahjah giving landing page

A static, dependency-free, Arabic RTL, mobile-first landing page for Zakat, Ramadan, Eid and
year-round giving campaigns run by جمعية بهجة العمانية للأيتام.

```
index.html              page markup (default content = "general" campaign, readable without JS)
assets/css/styles.css   styles
assets/js/config.js     ← campaign variables, routes, facts, bank, tracking IDs
assets/js/app.js        runtime (campaign switch, UTM persistence, tracking, fallback, sticky CTA)
assets/img/             official Bahjah images (see SOURCES.md)
SOURCES.md              provenance + verification status of every fact and image
```

## Campaign variants

Add `?campaign=` to the ad URL:

| URL | Hero / final / sticky CTA | Section shown first |
|---|---|---|
| `?campaign=zakat` | أخرج زكاتك الآن → Zakat product | Zakat |
| `?campaign=ramadan` | ساهم في السلة الرمضانية → Ramadan basket | Ramadan |
| `?campaign=eid` | ساهم بعطائك → donation hub | Sadaqah / projects |
| `?campaign=general` (default) | ساهم بعطائك → donation hub | Sadaqah / projects |

If `campaign` is missing, the page falls back to a variant name found inside `utm_campaign`
(so `zakat_1447_meta` resolves to zakat), then to `defaultCampaign`. All copy lives in
`config.campaigns`. Each campaign has exactly one primary CTA.

## Tracking

Every event goes to `window.dataLayer`. When the relevant IDs are set in `config.tracking`, the
page also calls gtag and the Meta Pixel directly. With GTM, map these events inside GTM instead.

| dataLayer event | When | Meta | Google Ads label key |
|---|---|---|---|
| `landing_view` | page load (includes first- and last-touch source) | PageView | – |
| `cta_click` | any tracked link | – | – |
| `select_giving_category` | chooser card click | `SelectGivingCategory` (custom) | – |
| `payment_page_visit` | click to any official payment route | InitiateCheckout | `payment_page_visit` |
| `donation_complete` | return URL `?donation=complete&category=&value=&ref=` | Donate | `donation_complete` |
| `route_fallback` | bahjah.org.om unreachable, Jood links swapped in | – | – |

Every event carries `campaign_variant`, `utm_*`, `category` and `route_mode`.

**Completed donations:** the payment pages are hosted by Bahjah or SmartPay, so this page only
sees a completed donation if the payment flow redirects back here. Ask Bahjah's web team to set
the WooCommerce/SmartPay success redirect (or a thank-you-page pixel) to
`https://<landing-url>/?donation=complete&category={cat}&value={amount}&ref={order_id}`.
`ref` de-duplicates reloads. The better long-term option is server-side conversions
(Meta CAPI / Google Ads offline conversions) from Bahjah's order data.

**UTM persistence:** `utm_*` and click IDs (`gclid`, `fbclid`, …) are stored in localStorage as
first- and last-touch. `utm_*` values are added to every outbound official link, so they reach
the WooCommerce order.

## Route fallback

When the page loads it pings `bahjah.org.om` (4.5 s timeout). If the site is unreachable, links
that have a `fallback` switch to the same initiative on Jood. Zakat has no Jood equivalent, so it
always stays on the official URL. Turn this off with `routing.healthCheck: false`.

## ⚠ Pre-launch checklist

1. **Open bahjah.org.om from Oman** (it was unreachable during the build) and confirm every ⚠ row in `SOURCES.md`.
2. **Bank accounts:** check `/wp/تواصل/`. If the numbers are current, set `bank.verifiedOn` to that date. Until then the numbers stay hidden.
3. **Product URLs:** paste the real Ramadan basket, Sadaqah, Water, Bills, Meat and Hardship product URLs into `config.routes`. They currently point to the donation hub.
4. **App links:** add the App Store / Google Play URLs (`appIos`, `appAndroid`).
5. **Zakat calculator:** if the legacy calculators are still live, set `routes.zakatCalculator.url`.
6. **Awards:** add the badges from the current site to `config.awards`, with images in `assets/img/`.
7. **Hero / OG image:** swap in an official seasonal photo and make `og:image` and `canonical` absolute URLs on the deployed domain.
8. **Tracking IDs:** set `gtmId` (or `ga4Id` / `googleAdsId`) and `metaPixelId`, then test in GTM Preview and Meta Events Manager.
9. **Consent:** if Bahjah's policy needs a consent banner, gate `initVendors()` in `app.js` behind it.
10. **Ramadan amount:** re-confirm OMR 35 on the current profile before each Ramadan campaign.

## Local preview

```bash
python3 -m http.server 8765
```

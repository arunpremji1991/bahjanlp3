# Sources & verification log

Checked on **28 Sep 2026**. `bahjah.org.om` and `bahjah.net` refused or timed out from every
tool available during the build (shell, browser, web fetch). **Anything marked ⚠ must be
checked against the live official site before launch.**

## Facts on the page

| Fact | Where it appears | Source | Status |
|---|---|---|---|
| Founded 10 Feb 2014, Royal Decree No. 14/2000 | Hero, Trust | Campaign brief (Bahjah profile); matches the Bahjah listing in search results | ⚠ confirm wording on the profile PDF |
| Ramadan basket OMR 35 per registered family, annual, covers most of Ramadan | Chooser, Ramadan, FAQ | Brief, citing the official profile PDF (Aug 2025) | ⚠ **not opened**. A third-party directory quotes OMR 30, possibly an older figure. Confirm before any Ramadan campaign |
| Basket distributed once in Ramadan to orphan families across the governorate's wilayats | Ramadan | Bahjah's Jood initiative page `5fa7fa49…` | ✅ live 28 Sep 2026 |
| Kaffarat al-Yamin OMR 15 (feeds 10 poor people) | Kaffarat, FAQ | Bahjah's Jood initiative page `bfeeaf34…` | ✅ live 28 Sep 2026 |
| Fasting kaffara OMR 1.5 / day, OMR 45 / month | Kaffarat, FAQ | Brief, citing the bahjah.org.om Kaffarat product page | ⚠ confirm on the product page |
| Zakat product = wealth zakat for registered orphans | Zakat, FAQ | Brief, citing the bahjah.org.om Zakat product | ⚠ confirm |
| Cards accepted via Bank Muscat SmartPay | Hero, How, FAQ | Brief, citing the bahjah.org.om FAQ | ⚠ confirm |
| App supports donations, projects and zakat calculation | Zakat, How, FAQ | Brief, citing the profile | ⚠ confirm and add store URLs in `config.js` |
| Under the Ministry of Social Development umbrella; serves orphans and widows across Dhofar's wilayats | Trust | Bahjah's own text on its Jood profile | ✅ live 28 Sep 2026 |
| Phones 23289966 / 91403312 / 91403373, email bahjah1.omani@gmail.com | FAQ, schema | Bahjah's Jood profile | ✅ live. Cross-check against `/wp/تواصل/` |
| Bank Muscat 0397000008880035, Bank Dhofar 01041328888001 | **Hidden** until `bank.verifiedOn` is set | Legacy contact page (via the brief) | ⚠ **must be verified live** |

Not included because they couldn't be verified: awards and certifications, historical statistics,
Ramadan/Eid activity dates, the Zakat calculator URL, app store URLs, and the hadith on the Jood
Sadaqah page (the brief allows only religious text Bahjah itself publishes; left out to stay conservative).

## Images

All optimised variants are in `assets/img/opt/` (AVIF + WebP + JPEG fallback, built by
`tools/optimize_images.py`). Every `<img>` carries a `data-source` attribute and an HTML comment
with its source URL.

### Official Bahjah images

Bahjah's own uploads on its Jood profile (jood.om, Ministry of Social Development portal).
They are marked «من بهجة» on the page.

| Variant | Original | Used for |
|---|---|---|
| `assets/img/bahjah-logo.jpg` | https://jood.om/en/Files/Image/9a53d08e-de45-4975-8bea-b0cf0000b0cf | Header, footer, favicon, OG image |
| `bahjah-kids` | https://jood.om/en/Files/Image/4d595cfc-cf92-4de0-bafc-b1800000b180 | Trust section, OG image |
| `bahjah-sponsorship` | https://jood.om/en/Files/Image/b07a6944-51b6-495f-9f72-b18e0000b18e | Chooser «مشاريع أخرى», mosaic «كفالة الأيتام» |
| `bahjah-hardship` | https://jood.om/en/Files/Image/3fabf74e-9d76-46f5-b411-b1800000b180 | Mosaic «فك كربة» |
| `bahjah-renovation` | https://jood.om/en/Files/Image/68e9da47-e51b-4e0f-ad01-b1800000b180 | Mosaic «بناء وترميم» |

### Pexels images (free under the Pexels License, https://www.pexels.com/license/)

These are illustrative only and do not show Bahjah beneficiaries. The page says so under the mosaic.

| Variant(s) | Pexels page | Used for |
|---|---|---|
| `hero-wide`, `hero-tall` | https://www.pexels.com/photo/man-having-dinner-7129737/ | Hero (all campaigns except Eid) |
| `eid-wide`, `eid-tall` | https://www.pexels.com/photo/bowl-of-dates-on-table-7249766/ | Hero, Eid campaign only |
| `arch` | https://www.pexels.com/photo/girl-reading-quran-inside-a-mosque-8164713/ | Chooser «الزكاة». **Cropped to the window only; the person in the original is not shown** |
| `zakat-tall`, `zakat-wide` | https://www.pexels.com/photo/dates-in-a-bowl-7427851/ | Zakat feature, mosaic «الزكاة» |
| `ramadan-wide` | https://www.pexels.com/photo/food-and-drinks-served-for-ramadan-20488448/ | Ramadan stage, mosaic «السلة الرمضانية» |
| `groceries-tall` | https://www.pexels.com/photo/close-up-shot-of-a-person-holding-a-grocery-basket-with-vegetables-8805171/ | Chooser «السلة الرمضانية», Ramadan inset |
| `kaffarat-wide` | https://www.pexels.com/photo/people-packing-food-6995260/ | Chooser + Kaffarat section |
| `sadaqah-wide` | https://www.pexels.com/photo/food-people-grocery-donation-6995201/ | Chooser + Sadaqah section |
| `water-tall` | https://www.pexels.com/photo/a-person-pouring-water-into-a-glass-6642422/ | Mosaic «مياه بهجة» |
| `final-wide`, `final-tall` | https://www.pexels.com/photo/woman-hand-holding-food-over-plate-21856018/ | Final CTA background |
| `fk-hero-tall`, `fk-hero-wide` | https://www.pexels.com/photo/father-and-child-silhouette-at-sunset-beach-29810534/ | «فك كربة» hero. Labelled «صورة تعبيرية», silhouettes only |
| `fk-hands` | https://www.pexels.com/photo/close-up-of-a-father-and-child-holding-hands-26775361/ | «فك كربة» story card. Labelled «صورة تعبيرية» |
| `fk-final-wide`, `fk-final-tall` | https://www.pexels.com/photo/silhouette-of-father-and-child-at-sunset-29702438/ | «فك كربة» final CTA background |

`og-image.jpg` (1200×630) is built from the official logo and `bahjah-kids`.

**Replace when possible:** real Bahjah photos from the media center (Ramadan basket
distribution, water project, renovation) should replace the Pexels images in those sections.
Put the original in `assets/img/src/`, add a job to `tools/optimize_images.py`, then change the
`<pic name=…>` in `src/index.src.html`.

## «فك كربة» page (`/fak-korba/`)

| Statement on the page | Source | Status |
|---|---|---|
| Bahjah runs an initiative called «فك كربة» under cash assistance, categorised as debt settlement («فك كربه (سداد دين)») | Bahjah's Jood initiative page `f91012f5…` and its related-initiatives listing | ✅ live 28 Sep 2026 |
| Serves orphans and widows across Dhofar's wilayats; under the Ministry of Social Development; founded 2014; Royal Decree 14/2000; card payment via SmartPay | See the facts table above | As above |
| Case figures (required / raised / remaining) and the case story | **None. Hidden until Bahjah supplies them** (`config.fakKorba.case`) | — |

Not used from the reference design because they don't come from Bahjah sources: "+50,000 beneficiaries",
"+15 years" (Bahjah was founded in 2014), "periodic reports", the Visa/Mastercard/Apple Pay/mada logos and the
monthly-donation option.

## Update 7 Oct 2026: bahjah.org.om reachable, facts re-checked

| Item | Finding on the official site | Change made |
|---|---|---|
| Ramadan basket | Official «السلة الرمضانية 2026م / 1447هـ» poster: **قيمة السلة 15 ريال** | **35 → 15 OMR** everywhere. Removed "covers most of the month" (not in the profile or the poster). The profile says the basket is distributed yearly to registered families "to meet their needs" |
| Kaffarat | Product page: يمين 15، يوم صيام 1.5، شهر رمضان 45 | ✅ unchanged |
| Zakat | Product page: «تبرع بزكاة مالك للأيتام المسجلين في بهجة الأيتام» | ✅ unchanged |
| Card payments | FAQ: «نقبل بطاقات الائتمان والخصم عبر بوابة بنك مسقط SmartPay» | ✅ unchanged |
| Product URLs | Donations hub lists /product/ pages for السلة-الرمضانية، صدقة، فك-كربة، الذبائح، مياة-بهجة، سداد-فواتير، بناء-و-ترميم، كفارات، الزكاة، برنامج-كفالة-يتيم | All routes now go to their own product page |
| Contact | Contact page: 92877577 – 23289966, bahjah1.omani@gmail.com. WhatsApp link: 96892877577 | Phones and WhatsApp switched to the official numbers (the Jood numbers were dropped) |
| App | App Store id1574084411; Google Play om.digitalorbits.bahjah | App buttons enabled |
| Bank accounts | Same 2026 poster: Bank Muscat 0397000008880035, Bank Dhofar 01041328888001 | `bank.verifiedOn = 2026-10-07`, so the accounts are now shown |
| Founding / decree / ISO | Profile: established 10/2/2014, Royal Decree 14/2000, ISO 2023 | ✅ |
| Awards row (7 logos) | Award logos shown on the official home page | Reused the processed logos from the orphan-sponsorship landing page (`assets/img/shared/awards/`) |
| "Bahjah on the ground" | News posts (Al Jazer agreement 4 Feb 2026, Sadah agreement 11 Feb 2026) linked from the official home page; activity photos from the profile | Reused the same photos and links as the sponsorship page (`assets/img/shared/`) |
| Address in footer | Not found in the official pages' text (it may be in a map or image) | Kept the sponsorship page's wording so all footers match. **⚠ Confirm** |
| "1,361 registered orphans (Dec 2023)" on the sponsorship page | The profile's statistics tables don't extract cleanly enough to tie the number to 2023 | **Not used here.** That tile shows Royal Decree 14/2000 instead. Re-check it on the sponsorship page |

## Religious texts on the main page (added 8 Oct 2026)

| Text | Exact wording used | Verified against |
|---|---|---|
| Quran, Al-Baqarah 2:110 (part) | ﴿وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ﴾ [البقرة: 110] | surahquran.com/aya-110-sora-2.html; quran.ksu.edu.sa (Tafsir Ibn Kathir 2:110) |
| Hadith | «أنا وكافل اليتيم في الجنة هكذا»، وأشار بالسبابة والوسطى، وفرّج بينهما شيئًا — رواه البخاري (5304) | Sahih al-Bukhari 5304 (also 6005, slightly different wording), narrated by Sahl ibn Sa'd: surahquran.com/Hadith-17271.html; Fath al-Bari (islamweb.net) |

English mode shows the Arabic text unchanged plus an English meaning marked "(meaning)". No other verses or hadith are quoted.

The orphan-sponsorship section photo (`assets/img/shared/photo-outing.webp`) comes from the Society profile's activity photos, via the sponsorship landing page.

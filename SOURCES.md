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

## Images (`assets/img/`)

These are the images Bahjah uploaded to its own profile on Jood (jood.om, the Ministry of Social
Development donation portal). They were resized and recompressed; nothing else was changed.

| File | Original | Jood original filename | Used for |
|---|---|---|---|
| `bahjah-logo.jpg` | https://jood.om/en/Files/Image/9a53d08e-de45-4975-8bea-b0cf0000b0cf | شعار الجمعية 2021.jpg | Header, favicon, og:image |
| `school-supplies.jpg` | https://jood.om/en/Files/Image/4d595cfc-cf92-4de0-bafc-b1800000b180 | المساعدات النقدية new-09.jpg (School bag initiative) | Hero |
| `sponsorship.jpg` | https://jood.om/en/Files/Image/b07a6944-51b6-495f-9f72-b18e0000b18e | DSC_50 2.JPG (Orphan sponsorship initiative) | Other giving |
| `food-kaffarat.jpg` | https://jood.om/en/Files/Image/487933ab-0ccf-48c3-8b27-b1870000b187 | detail.jpg (Kaffara / meat initiatives) | Ramadan section |
| `hardship.jpg` | https://jood.om/en/Files/Image/3fabf74e-9d76-46f5-b411-b1800000b180 | المساعدات النقدية new-02.jpg (Relieve a burden) | Other giving |
| `renovation.jpg` | https://jood.om/en/Files/Image/68e9da47-e51b-4e0f-ad01-b1800000b180 | المساعدات السكنية new-02.jpg (Renovation) | Other giving |

Only the hero and sponsorship images show children. Neither shows a face, and neither carries a
name or story. The hardship, renovation and food images are illustrative pictures Bahjah chose
for those initiatives. They are captioned as project images, not as beneficiary photos.

**Replace before launch if possible:** once bahjah.org.om is reachable, use its Ramadan/seasonal
news photos (1200×630 or larger) for the hero and `og:image`, and add award badges to
`config.awards`.

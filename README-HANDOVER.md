# HOPE website — handover notes (Xcela, November 2026)

New website for House of Power Equipments: **59 pages**. That is 16 main pages, 16 product pages (the same product list and web addresses as the current site's Products menu), 26 individual machine pages and a 404 page. It uses **208 photos**. Open `website/index.html` in a browser to preview it. Upload everything inside `website/` to the web host to publish it, including the hidden `.htaccess` file.

The zip has two folders: `website/` is the finished site, ready to upload. `source/` is what you edit to change the site.

## Menu

The **Products** menu matches the current site: four columns (Diesel generators, Electric motors, Transformers, Allied equipment) with every product listed, a "Need help choosing?" box with the sales number, and a "Stock available now" shortcut. On phones it opens as a section inside the menu.

## Pages

| Page | File | Job |
|---|---|---|
| Home | index.html | Machines in stock, what we do, RECD notice, test process, proof, enquiry form |
| Stock available now | stock.html | Every machine, with filters for type, size, grade and brand, plus search and sort. Links can be shared |
| Machine pages (26) | units/*.html | One page per machine: spec plate, price, WhatsApp button that quotes the stock number, similar machines |
| Product pages (15) | products/*.html | One page for each item in the Products menu: New, Used, Portable, Industrial, Marine and Silent DG sets; Slip-ring, SQIM, DC and HT motors; Power transformers; Water pumps, Air compressors, Reduction gears, EOT cranes & hoists. Each has photos, what we supply, machines in stock, FAQ and related products |
| Gensets | gensets.html | Used vs new comparison, sizing guide, all genset types, alternators and spares, brands, FAQ |
| Motors | motors.html | Motor types, slip-ring specification table, how a used motor is checked, more from the motor yard |
| Transformers, pumps and more | other-equipment.html | Allied equipment sourced to order |
| Rental | rental.html | How hire works, written hire terms, hire enquiry form |
| RECD compliance | recd-compliance.html | Who the MPCB rule applies to, three options, 5-step process, FAQ |
| Service & AMC | service-amc.html | Repairs, overhaul, rewinding, what an AMC includes |
| Sell to us | sell.html | Buy-back process and offer form |
| Export | export.html | Export process and enquiry form |
| How we test and warranty | quality.html | Test steps, what is on the test report, warranty terms |
| Industries | industries.html | Sectors and delivery locations |
| About | about.html | Company story, checkable proof, yard visit, careers |
| Contact | contact.html | Phones, email, enquiry form, address and GSTIN |
| Privacy, Terms, 404 | privacy.html, terms.html, 404.html | Legal pages; the 404 sends old links to the right sections |

## Logo intro (16 November 2026)

The HOPE badge is now also drawn in code (SVG, in `templates/macros.html`, macro `logo_svg`), so it stays sharp at any size and each part can move on its own. On a visitor's first page view, it plays a four-second intro:
1. A glowing red AC power waveform runs across the dark screen, then wraps itself into the badge's silver rim, sending out a shockwave.
2. A spark travels round the ring and lights "HOUSE OF POWER EQUIPMENTS" letter by letter.
3. The red core powers up with a flash and a red glow.
4. The white banner wipes in, and the Z emblem spins up like a rotor and settles.
5. "HOPE" flickers on like a tube light, the tagline settles in and a sheen crosses the badge.
6. The badge flies into the header logo spot, while the page opens in a widening circle around it.

It plays once per visit. A click, tap, scroll or key press skips straight to the landing. It never plays for visitors who have reduced motion turned on, and it hides itself after 6.5 seconds even if the script fails. The page loads fully underneath, so speed scores are unchanged (Lighthouse mobile 86–88 on the home page).

The year on the badge comes from `SITE["logo_year"]` in `data.py` (currently 1946, as on HOPE's logo). The site elsewhere says established 1974. HOPE should confirm which is right; it is one value to change.

## Latest changes (15 November 2026)

- **HOPE logo** is used in the header, footer, favicon, phone home-screen icon and link previews (see Logo intro above for the opening animation).
- **Logo wording to check:** the logo says "Power Solutions – 1946", but the site and IndiaMART say established 1974. HOPE should decide which year is right and use it everywhere.
- **Motors:** the ranges from the current site were added: slip-ring 5–1,500 HP, SQIM 0.5–500 HP (IE3, all enclosures), DC 1–500 HP (variable speed, reversible), HT 100–3,000 HP at 3.3–11 kV. New **Flameproof motors** product page (Ex d / Ex e, Zone 1 and 2), plus a Custom motors card on the Motors page. Confirm the flameproof certification wording (PESO / ATEX) with HOPE.
- **Stock filters fixed:** the cards now hide correctly. A style rule had kept "hidden" machines showing, so the count changed but the list didn't. The filter panel also scrolls on its own when it is taller than the screen.
- **Fixes:** custom dropdown arrows on every select; the Products menu button lines up with the other links; footer links are underlined and plain facts are grey, with icons beside the contact details.
- **Photos:** removed the off-topic "handshake" photos, including the man applying cream, and replaced them with HOPE's own photos or relevant ones (a delivery truck, the team inspecting a machine). Every people photo was reviewed against its page.

## Brands, motion and accessibility (November 2026 update)

**Brand wall.** The plain brand names are now four photo tiles: Cummins, Caterpillar, Kirloskar (KOEL) and Ashok Leyland (Leypower). Each photo is a crop of HOPE's own listing photos, showing the maker's badge on a machine in the yard. Each tile links to that make's machines in stock and shows how many there are. Other makes are listed by name; those with stock link to the stock list.

**Why not the makers' official logo files?** Manufacturers like Cummins and Caterpillar license their logo artwork to authorised dealers only. On an independent dealer's site, the official logos would suggest a dealership HOPE doesn't hold. That is the kind of claim we removed from the old site. A photo of the brand on a machine HOPE actually sells is accurate, and it builds more trust. If HOPE is an authorised dealer or service partner for any make, ask that maker for its logo files and dealer-use rules.

**Motion.** There is one signature moment: on each page's first photo, a rolling steel shutter lifts to reveal the machine, the way shops in Darukhana open each morning. On the home page, the rating plate then slides in and a light sheen crosses it once. Everything else is quiet:
- Photo grids and cards fade in as they scroll into view.
- In the five-step test process, a red line runs across the steps in order.
- Cards lift slightly, with a slow zoom on the photo, when you hover over them.
- The Products menu fades in.
- The header becomes a compact, frosted bar once you scroll.

All motion switches off for visitors whose device is set to reduce motion, and nothing is hidden if JavaScript fails to load.

**Depth.** The heroes and dark bands have soft steel gradients. The red call-to-action band is now a photo of HOPE's showroom under a dark wash. Buttons have a little material, and the footer carries the logo.

**Accessibility and structure.** The automated accessibility checker (axe-core, WCAG 2.2 AA plus best practice) found **0 issues** on all 59 pages, at desktop and phone width, with motion on and off. Fixes made for this:
- The top contact strip is now a labelled landmark.
- The machine-page sidebar is no longer nested inside the main content.
- The comparison table's empty header now has text for screen readers.
- Focus rings are yellow on dark backgrounds so keyboard users can see them.
- Form and footer headings are nested correctly.

Every page has exactly one h1, with no skipped heading levels: h1 for the page, h2 for sections, h3 for items inside them. No page needed an h4.

## Audit scorecard: before → after

| Area (from the audit) | Before | What the new site does | After |
|---|---|---|---|
| Visual design and brand | 3.5 | Original identity built around the machine rating plate. One typeface family (Barlow), steel and ink colours, red only for action, green for WhatsApp. Photography throughout, a restrained motion system with a signature shutter reveal, and soft depth in the dark bands | 5 |
| Messaging and positioning | 2 | Leads with the real strength: "tested in our yard before they reach yours". Used, new, rental, compliance, service and buy-back each get a page. No dealer claims | 5 |
| Information architecture | 3 | Stock is the first menu item. Separate pages for rental, RECD, AMC, sell and export. Breadcrumbs on every inner page | 5 |
| Calls to action and lead capture | 2.5 | One enquiry form on every key page. It opens WhatsApp with all details pre-typed, or email as a fallback. Every machine has a WhatsApp button with its stock number. Fixed Call / WhatsApp / Quote bar on mobile. The old form sent nothing (it had no destination and no field names) | 5 |
| Product and stock presentation | 1.5 | Live stock list with filters, a grade, year, hours, price or "price on request", and a separate page per machine with a photo gallery of HOPE's own photos of that machine | 5 |
| Trust signals | 1.5 | Checkable proof only: Justdial rating with link, IndiaMART TrustSEAL, GSTIN, written test process, warranty terms, yard visit, real yard photos including rating plates | 5 (customer quotes would add more) |
| Content accuracy | 1 | Removed "Since 1945 / 78+ years", "authorized dealer", ISO, "5000+ clients", "24/7" and "manufacturer warranty on used". Every fact lives in one file (`data.py`) | 5 (after HOPE confirms the list below) |
| Local SEO | 2 | Search-friendly title and description on every page. LocalBusiness, Breadcrumb, FAQ and Product structured data. Sitemap, robots.txt, canonical links. Pages written for real searches ("generator on rent Mumbai", "RECD fitting") | 5 |
| Legal and GST | 1.5 | GSTIN, legal name and full address in the footer and on Contact and About. Privacy and Terms rewritten in plain words | 5 |
| Old and duplicate pages | 1.5 | The 15 product pages keep the current /products/ web addresses, so Google rankings carry over. `.htaccess` redirects the remaining old /products/, /shop/, /product/, dealership and brands URLs to the matching new page | 5 |
| Accessibility (not scored before) | Unknown | 0 axe-core issues (WCAG 2.2 AA) on all 58 pages at both widths. Lighthouse accessibility 100. Keyboard-operable menu, skip link, labelled fields, visible focus on dark backgrounds, reduced-motion support | 5 |
| Speed (not measured before) | Unknown | Lighthouse mobile performance 88–94 on a plain test server with 200+ photos. Every photo is WebP in three sizes, lazy-loaded below the fold. No frameworks, self-hosted fonts, about 40 KB of code. The compression and caching rules in `.htaccess` are not active on the test server, so the live score should be higher | 4.5–5 |

Lighthouse mobile results on the home, stock, product, machine and industries pages: performance 88–94, accessibility 100, best practices 100, SEO 100. All 5,500+ internal links and image references were checked, with none broken. 149 structured-data blocks are valid.

## Confirm with HOPE before launch

Everything below is in `data.py` or the page text. These items came from HOPE's old site, IndiaMART or our meetings, and must be confirmed:

1. **Founding year:** the site says established 1974, matching IndiaMART. If the family story goes back to 1945, add one line to the About page.
2. **Stock list:** the 26 machines and the listed prices come from HOPE's current website and IndiaMART listings. Check each against the yard. Add or remove machines in `UNITS`. Where the make wasn't clear from a listing, the page says "make on request".
3. **Photos:** the product and yard photos are HOPE's own, taken from HOPE's IndiaMART catalogue. Confirm HOPE took them, and that each machine page shows the actual machine (or remove the listing).
4. **Warranty:** "6 months on engine and alternator" for Grade A comes from HOPE's own used-DG page. Confirm the period and the exclusions.
5. **Reply promise:** "We reply on WhatsApp within 15 minutes during working hours." Only keep it if someone owns the WhatsApp line.
6. **Rental terms:** taken from HOPE's published hire terms (₹5,000 operator, 80% load, 7 days' notice). Confirm they are current.
7. **Phones and email:** +91 98200 00013 (sales and WhatsApp), +91 98210 13466 (service), powereqpts@gmail.com. Consider a mailbox on the website's own domain (powereqpts.co).
8. **Hours:** Mon–Sat, 9 am – 7 pm.
9. **RECD wording:** check against the MPCB circular of 21 October 2026 before promoting the page.
10. **Customer locations and industries:** from our discovery notes. Remove any HOPE does not want published.
11. **Justdial rating:** 4.4 from 127 ratings in November 2026. Update it now and then.

## Still to add (needs HOPE)

- **Team photos:** the people shots (engineers, workshop, handshake) are licensed stock photos. Over time, swap them for photos of HOPE's own team, yard and deliveries. These look more real and build more trust.
- **New machine photos:** for each new listing, take 4–6 phone photos (front, side, engine, rating plate, panel). Run them through the photo step below.
- **2–3 customer quotes,** with permission, on the About page.
- **Google Business Profile:** claim it with exactly the same name, address and phone, then link it from the footer.
- **Visitor statistics:** add Google Analytics or Plausible, and paste the tag before `</head>` in `templates/base.html`.
- **CRM later (optional):** set `endpoint` in `templates/base.html` to a Zoho, Google Sheets or form-service URL. Every enquiry will then also be saved there, as well as opening WhatsApp.

## Updating the site

Requires Python 3 with Jinja2 and Pillow (`pip install jinja2 pillow`). Work inside `source/`. The first time, copy the `website/static/photos` folder to `source/static/photos`. The photos are stored once, in the website folder, to keep the download small.

1. Edit `data.py` to change stock, prices or contact details. Edit `templates/pages/*.html` to change page text.
2. Run `python3 build.py`. It rebuilds `dist/`, including machine pages, sitemap and structured data.
3. Upload the contents of `source/dist/`. The hidden `.htaccess` file must be uploaded too, because it holds the redirects and caching rules.

### Adding photos

Photos live in `static/photos/` as WebP in three widths. Product photos are named `p-<name>-480/720/960.webp` and decorative photos `d-<name>-800/1200/1600.webp`. Add a machine's photo names (without `p-` and the width) to its `photos=[...]` list in `data.py`. `build.py` copies only the photos the pages actually use.

## Photo credits and licence

- **Product, yard and dispatch photos (`p-…`):** HOPE's own photos from its IndiaMART catalogue (to be confirmed, see above).
- **People and industry photos (`d-…`):** from Unsplash, under the Unsplash License. They are free for commercial use with no credit required. Only free Unsplash photos were used, no Unsplash+ (paid) images. They must not be sold as standalone photos or used to suggest that the people shown endorse HOPE.

The fonts are Barlow and Barlow Condensed (SIL Open Font License), served from the site itself.

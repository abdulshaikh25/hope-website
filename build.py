"""Build the static HOPE website into ./dist  —  run:  python3 build.py"""
import os, re, shutil, json
from jinja2 import Environment, FileSystemLoader, select_autoescape
from data import SITE, NAV, UNITS, BRANDS, CATS, CAT_BY_SLUG, MEGA, ALT, BRAND_WALL, BRAND_OTHERS
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

env = Environment(loader=FileSystemLoader(os.path.join(HERE, "templates")),
                  autoescape=select_autoescape(["html"]), trim_blocks=True, lstrip_blocks=True)

PHOTO_DIR = os.path.join(HERE, "static", "photos")
USED = set()
_dims = {}


def ph(key):
    """Return file names, widths and intrinsic size for a photo key like 'p-g-0380-cu-1' or 'd-welding'."""
    sw, mw, lw = (480, 720, 960) if key.startswith("p-") else (800, 1200, 1600)
    small, mid, large = f"{key}-{sw}.webp", f"{key}-{mw}.webp", f"{key}-{lw}.webp"
    if not os.path.exists(os.path.join(PHOTO_DIR, small)):
        raise FileNotFoundError(f"Missing photo {small}")
    if key not in _dims:
        with Image.open(os.path.join(PHOTO_DIR, small)) as im:
            _dims[key] = im.size
        with Image.open(os.path.join(PHOTO_DIR, large)) as im:
            _dims[key + "@L"] = im.size
        with Image.open(os.path.join(PHOTO_DIR, mid)) as im:
            _dims[key + "@M"] = im.size
    USED.update([small, mid, large])
    w, h = _dims[key]
    return dict(small=small, mid=mid, large=large, sw=w, mw=_dims[key + "@M"][0], lw=_dims[key + "@L"][0], w=w, h=h, alt=ALT.get(key, ""))


env.globals["ph"] = ph

B = SITE["base"]
ORG = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": B + "/#business",
    "name": SITE["name"],
    "alternateName": "HOPE",
    "url": B + "/",
    "logo": B + "/static/img/logo-512.png",
    "telephone": SITE["phone_sales_tel"],
    "email": SITE["email"],
    "foundingDate": str(SITE["est"]),
    "taxID": SITE["gstin"],
    "address": {"@type": "PostalAddress", "streetAddress": SITE["street"], "addressLocality": SITE["city"],
                "postalCode": SITE["pin"], "addressRegion": SITE["state"], "addressCountry": "IN"},
    "openingHours": SITE["hours_schema"],
    "areaServed": "IN",
    "sameAs": [SITE["indiamart"], SITE["justdial"]],
    "description": "Used and new diesel generator sets, electric motors, genset rental, RECD compliance and service in Mumbai.",
}


def crumbs_schema(items):
    out = [{"@type": "ListItem", "position": 1, "name": "Home", "item": B + "/"}]
    for i, (name, href) in enumerate(items, start=2):
        out.append({"@type": "ListItem", "position": i, "name": name, "item": f"{B}/{href}"})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": out}


def faq_schema(path):
    """Pull <details><summary>Q</summary><p>A</p> pairs out of a rendered page."""
    html = open(path, encoding="utf-8").read()
    pairs = re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>", html, re.S)
    if not pairs:
        return None
    strip = lambda t: re.sub(r"<[^>]+>", "", t).strip()
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": strip(q),
                            "acceptedAnswer": {"@type": "Answer", "text": strip(a)}} for q, a in pairs]}


PAGES = [
    # file, nav key, title, description, breadcrumb label (None for home)
    ("index.html", None, "Used & New Diesel Generators and Motors in Mumbai | HOPE, Darukhana",
     "Tested used and new diesel generator sets (5–2,000+ kVA) and industrial motors up to 3,000 HP. Rental, RECD compliance and AMC. Darukhana, Mumbai, since 1974.", None),
    ("stock.html", "stock", "Used Generators and Motors in Stock, Mumbai | HOPE",
     "Browse used and refurbished diesel generator sets and electric motors in stock at our Darukhana, Mumbai yard. Specs, grade, warranty and price on WhatsApp.", "Stock available now"),
    ("gensets.html", "products", "Diesel Generator Sets: Used, Refurbished and New CPCB IV+ | HOPE Mumbai",
     "Silent and open diesel generator sets from 5 kVA to 2,000+ kVA. Refurbished used sets with load test and warranty, and new CPCB IV+ sets. Size guide inside.", "Diesel generator sets"),
    ("motors.html", "products", "Slip-Ring, HT and LT Electric Motors up to 3,000 HP | HOPE Mumbai",
     "Used and new industrial motors: slip-ring, squirrel-cage, HT, LT and DC, up to 3,000 HP. Tested before dispatch, rewinding through partners. Darukhana, Mumbai.", "Electric motors"),
    ("other-equipment.html", "products", "Transformers, Pumps, Compressors and Allied Equipment | HOPE Mumbai",
     "Power transformers, water pumps, air compressors, gearboxes, EOT cranes and panels, used or new, sourced to order by HOPE, Mumbai.", "Transformers, pumps and more"),
    ("rental.html", "rental", "Generator on Rent in Mumbai: Monthly Genset Hire | HOPE",
     "Diesel generators on monthly hire for sites, factories, events and shoots in Mumbai and Maharashtra. Operator available. Clear hire terms.", "Genset rental"),
    ("recd-compliance.html", "recd", "RECD Fitting for Diesel Gensets: MPCB Compliance in Maharashtra | HOPE",
     "MPCB requires in-use diesel gensets of 61 kW and above to fit a certified RECD, convert or replace. Survey, fitting, paperwork and AMC by HOPE, Mumbai.", "RECD and MPCB compliance"),
    ("service-amc.html", "service", "Generator Service, Overhaul and AMC in Mumbai | HOPE",
     "Genset breakdown repair, engine overhaul, motor rewinding and annual maintenance contracts (AMC) in Mumbai and Maharashtra.", "Service and AMC"),
    ("sell.html", "sell", "Sell Your Used Generator or Motor in Mumbai | HOPE Buys Used Equipment",
     "We buy used diesel generators, motors and transformers in any condition. Same-day indicative offer, inspection and removal from your site.", "Sell your equipment"),
    ("export.html", "", "Used Generators and Motors for Export from Mumbai | HOPE",
     "Refurbished diesel generator sets and industrial motors for export, with inspection, documents and shipping from Mumbai.", "Export enquiries"),
    ("quality.html", "", "How We Test Used Generators, and Our Warranty | HOPE",
     "Every Grade A used genset gets a full-load trial, a signed test report and a written warranty. See what we check and what the warranty covers.", "How we test and warranty"),
    ("industries.html", "", "Industries We Serve: Sugar Mills, Marine, Manufacturing | HOPE",
     "Gensets and motors for sugar mills, factories, ships, construction, steel mills, hospitals, events and offices across India.", "Industries we serve"),
    ("about.html", "about", "About House of Power Equipments, Darukhana, Mumbai (Est. 1974)",
     "A Delhiwala family business in Darukhana, Mumbai since 1974, buying, refurbishing, selling, renting and servicing power equipment.", "About HOPE"),
    ("contact.html", "contact", "Contact HOPE: WhatsApp, Phone and Yard Address, Darukhana Mumbai",
     "Call or WhatsApp +91 98200 00013. Visit our yard at Darukhana, Mazagaon, Mumbai 400010. Mon–Sat, 9 am to 7 pm.", "Contact"),
    ("privacy.html", "", "Privacy | House of Power Equipments", "How HOPE uses the details you share with us.", "Privacy"),
    ("terms.html", "", "Terms of Sale and Use | House of Power Equipments", "Terms for listings, payment, warranty and hire at HOPE, Mumbai.", "Terms"),
]


def render(tpl, out_rel, ctx):
    out = os.path.join(DIST, out_rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    html = env.get_template(tpl).render(**ctx)
    html = re.sub(r"\n\s*\n+", "\n", html)
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    return out


FEATURED = ["G-0380-CU", "G-2000-CA", "M-0690-SR", "G-0100-AL"]
HOME_CATS = ["used-dg-sets", "new-dg-sets", "silent-generators", "industrial-gensets", "portable-petrol-generators", "slipring-motors", "ht-motors", "sqim-motors"]
HOME_INDS = [("sugar", "Sugar mills", "d-sugarcane-harvest"), ("manufacturing", "Manufacturing", "d-workers-machine-india"),
             ("marine", "Marine", "d-ship-engine-room"), ("construction", "Construction", "d-construction-night"),
             ("events", "Events and film shoots", "d-concert-stage"), ("health", "Hospitals", "d-hospital-ward")]
INDUSTRIES = [
    ("sugar", "Sugar mills", "d-sugarcane-harvest", "Large motors and gensets for crushing season, supplied across Maharashtra."),
    ("manufacturing", "Manufacturing", "d-workers-machine-india", "Standby and prime power, plus replacement motors when a line goes down."),
    ("marine", "Marine", "d-ship-engine-room", "Generator sets and motors for ships, barges and repair yards."),
    ("construction", "Construction", "d-cranes-sunset", "Sets on sale or hire for sites, pumps and tower cranes."),
    ("steel", "Steel and rolling mills", "d-worker-sparks-furnace", "Heavy slip-ring and HT motors for mill drives."),
    ("events", "Events and film shoots", "d-concert-stage", "Silent sets on hire for stages and locations."),
    ("health", "Hospitals and clinics", "d-hospital-ward", "Silent sets with AMF panels for reliable backup."),
    ("commercial", "Offices, malls and societies", "d-industrial-building", "Backup power, RECD compliance and maintenance contracts."),
    ("infra", "Airports and infrastructure", "d-control-room", "Sets and motors for large facilities and project work."),
    ("datacentre", "Data centres and telecom", "d-data-centre", "Large standby sets with AMF panels for servers and towers."),
    ("farms", "Farms and irrigation", "d-sugarcane-field", "Pump motors and small gensets for wells, drip and lift irrigation."),
    ("transport", "Transport and warehouses", "d-truck-india-2", "Backup power for warehouses, cold stores and truck terminals."),
]
GROUP = {"gensets": ("Diesel generator sets", "gensets.html"), "motors": ("Electric motors", "motors.html"),
         "transformers": (None, None), "allied": ("Transformers, pumps and more", "other-equipment.html")}


def base_ctx(root):
    by_id = {u["id"]: u for u in UNITS}
    return dict(site=SITE, nav=NAV, units=UNITS, brands=BRANDS, org_schema=ORG, root=root,
                cats=CAT_BY_SLUG, mega=MEGA, featured=[by_id[i] for i in FEATURED], home_cats=HOME_CATS,
                home_inds=HOME_INDS, industries=INDUSTRIES, brand_wall=BRAND_WALL, brand_others=BRAND_OTHERS,
                unit_brands=sorted({u["brand"] for u in UNITS}, key=lambda b: (b == "Ask", b)))


def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    shutil.copytree(os.path.join(HERE, "static"), os.path.join(DIST, "static"), ignore=shutil.ignore_patterns("photos"))
    os.makedirs(os.path.join(DIST, "static", "photos"))
    css_path = os.path.join(DIST, "static", "css", "site.css")
    css = open(css_path, encoding="utf-8").read()
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};,>])\s*", r"\1", css).replace(";}", "}")
    open(css_path, "w", encoding="utf-8").write(css.strip())
    shutil.copy(os.path.join(HERE, "static", "img", "favicon.ico"), os.path.join(DIST, "favicon.ico"))

    urls = []
    for fn, nav, title, desc, crumb in PAGES:
        schema = [crumbs_schema([(crumb, fn)])] if crumb else []
        ctx = base_ctx("")
        ctx["page"] = dict(title=title, description=desc, canonical="" if fn == "index.html" else fn, nav=nav, schema=schema)
        out = render(f"pages/{fn}", fn, ctx)
        faq = faq_schema(out)
        if faq:
            ctx["page"]["schema"] = schema + [faq]
            render(f"pages/{fn}", fn, ctx)
        if fn not in ("privacy.html", "terms.html"):
            urls.append("" if fn == "index.html" else fn)

    # Product pages at the old site's /products/ addresses
    for c in CATS:
        gl, gh = GROUP[c["group"]]
        crumbs = [(gl, gh), (c["short"], c["url"])] if gh else [(c["short"], c["url"])]
        siblings = [x["slug"] for x in CATS if x["group"] == c["group"] and x["slug"] != c["slug"]]
        others = [x["slug"] for x in CATS if x["group"] != c["group"]]
        related = (siblings + others)[:4]
        ctx = base_ctx("../")
        ctx.update(c=c, group=c["group"], group_label=gl, group_href=gh, related=related)
        schema = [crumbs_schema(crumbs)]
        ctx["page"] = dict(title=c["title"], description=c["desc"], canonical=c["url"], nav="products", schema=schema)
        out = render("pages/category.html", c["url"], ctx)
        faq = faq_schema(out)
        if faq:
            ctx["page"]["schema"] = schema + [faq]
            render("pages/category.html", c["url"], ctx)
        urls.append(c["url"])

    # One static page per machine
    for u in UNITS:
        similar = [s for s in UNITS if s["type"] == u["type"] and s["id"] != u["id"]]
        similar.sort(key=lambda s: abs(s["rating"] - u["rating"]))
        offer = {"@type": "Offer", "priceCurrency": "INR", "availability": "https://schema.org/InStock",
                 "itemCondition": "https://schema.org/UsedCondition", "seller": {"@id": B + "/#business"}}
        if u["price"]:
            offer["price"] = str(u["price"])
        product = {"@context": "https://schema.org", "@type": "Product", "name": u["title"], "sku": u["id"],
                   "description": u["note"], "offers": offer}
        if u["brand"] != "Ask":
            product["brand"] = {"@type": "Brand", "name": u["brand"]}
        ctx = base_ctx("../")
        ctx.update(u=u, similar=similar[:2])
        ctx["page"] = dict(
            title=f"{u['title']} — Stock {u['id']} | HOPE Mumbai",
            description=f"{u['title']}. {u['rating_txt']}, year {u['year_txt']}. {u['grade_label']}. {u['note']} In stock at Darukhana, Mumbai."[:300],
            canonical=u["url"], nav="stock",
            schema=[crumbs_schema([("Stock", "stock.html"), (u["id"], u["url"])]), product])
        product["image"] = [f"{B}/static/photos/p-{p}-960.webp" for p in u["photos"]]
        render("pages/unit.html", u["url"], ctx)
        urls.append(u["url"])

    # 404 uses absolute paths because it is served from any URL
    ctx = base_ctx("/")
    ctx["page"] = dict(title="Page not found | HOPE", description="This page has moved.", canonical="404.html", nav="", schema=[])
    render("pages/404.html", "404.html", ctx)

    for f in sorted(USED):
        shutil.copy(os.path.join(PHOTO_DIR, f), os.path.join(DIST, "static", "photos", f))
    print(f"Photos used: {len(USED)//3} images ({len(USED)} files)")

    with open(os.path.join(DIST, "sitemap.xml"), "w") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for u in urls:
            f.write(f"  <url><loc>{B}/{u}</loc></url>\n")
        f.write("</urlset>\n")
    with open(os.path.join(DIST, "robots.txt"), "w") as f:
        f.write(f"User-agent: *\nAllow: /\n\nSitemap: {B}/sitemap.xml\n")
    shutil.copy(os.path.join(HERE, "htaccess.txt"), os.path.join(DIST, ".htaccess"))
    print(f"Built {len(urls) + 1} pages into {DIST}")


if __name__ == "__main__":
    main()

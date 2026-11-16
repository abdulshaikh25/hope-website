(function () {
  "use strict";
  var H = window.HOPE || {};

  // Mobile menu
  var btn = document.querySelector(".menu-btn"), nav = document.getElementById("site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  }

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // Enquiry forms: WhatsApp first, email as fallback, optional endpoint for a CRM.
  var params = new URLSearchParams(location.search);
  document.querySelectorAll("form[data-quote]").forEach(function (form) {
    var unit = params.get("unit"), need = params.get("need");
    if (unit && form.elements["unit"] && !form.elements["unit"].value) form.elements["unit"].value = unit;
    if (need) {
      var map = { "buy-used": "Buy used", "buy-new": "Buy new", rent: "Rent", recd: "RECD / compliance", service: "Service or AMC", sell: "Sell to HOPE", export: "Export" };
      var r = form.querySelector('input[name="need"][value="' + (map[need] || "") + '"]');
      if (r) r.checked = true;
    }
    var mode = "wa";
    form.querySelectorAll("[data-send]").forEach(function (b) { b.addEventListener("click", function () { mode = b.getAttribute("data-send"); }); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var name = form.elements["name"].value.trim(), phone = form.elements["phone"].value.trim();
      form.elements["name"].removeAttribute("aria-invalid"); form.elements["phone"].removeAttribute("aria-invalid");
      if (!name || phone.replace(/\D/g, "").length < 10) {
        if (!name) { form.elements["name"].setAttribute("aria-invalid", "true"); }
        if (phone.replace(/\D/g, "").length < 10) { form.elements["phone"].setAttribute("aria-invalid", "true"); }
        status.textContent = !name ? "Add your name so we know who to reply to." : "Add a 10-digit mobile number so we can reply.";
        (!name ? form.elements["name"] : form.elements["phone"]).focus();
        return;
      }
      var needEl = form.querySelector('input[name="need"]:checked');
      var lines = [
        "Enquiry from powereqpts.co",
        needEl ? "Need: " + needEl.value : "",
        "Name: " + name,
        "Mobile: " + phone,
        form.elements["company"].value ? "Company: " + form.elements["company"].value : "",
        form.elements["city"].value ? "Location: " + form.elements["city"].value : "",
        form.elements["equipment"].value ? "Equipment: " + form.elements["equipment"].value : "",
        form.elements["size"].value ? "Size: " + form.elements["size"].value : "",
        form.elements["when"].value ? "Needed: " + form.elements["when"].value : "",
        form.elements["unit"].value ? "Stock no.: " + form.elements["unit"].value : "",
        form.elements["message"].value ? "Details: " + form.elements["message"].value : ""
      ].filter(Boolean);
      var text = lines.join("\n");

      if (H.endpoint) {
        try { fetch(H.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: text, page: location.pathname }), keepalive: true }); } catch (err) {}
      }
      if (mode === "email") {
        location.href = "mailto:" + H.email + "?subject=" + encodeURIComponent("Enquiry: " + (needEl ? needEl.value : "HOPE")) + "&body=" + encodeURIComponent(text);
        status.textContent = "Your email app is opening with the enquiry filled in. Press send there.";
      } else {
        window.open("https://wa.me/" + H.wa + "?text=" + encodeURIComponent(text), "_blank", "noopener");
        status.textContent = "WhatsApp is opening with your enquiry filled in. Press send there to reach us.";
      }
    });
  });
})();

// Machine page photo gallery
document.querySelectorAll("[data-gallery]").forEach(function (g) {
  var main = g.querySelector(".ugal-main img");
  g.querySelectorAll(".ugal-t").forEach(function (b) {
    b.addEventListener("click", function () {
      main.removeAttribute("srcset");
      main.src = b.dataset.src; main.alt = b.dataset.alt;
      main.classList.remove("swap"); void main.offsetWidth; main.classList.add("swap");
      g.querySelectorAll(".ugal-t").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });
});

// Products mega menu
(function () {
  var li = document.querySelector(".has-mega"), b = li && li.querySelector(".mega-btn");
  if (!b) return;
  function set(open) { li.classList.toggle("open", open); b.setAttribute("aria-expanded", open ? "true" : "false"); }
  b.addEventListener("click", function (e) { e.stopPropagation(); set(!li.classList.contains("open")); });
  document.addEventListener("click", function (e) { if (!li.contains(e.target)) set(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && li.classList.contains("open")) { set(false); b.focus(); } });
})();

// Header settles into a compact bar after scrolling
(function () {
  var h = document.querySelector(".site-head");
  if (!h) return;
  var on = false;
  function check() {
    var s = window.scrollY > 24;
    if (s !== on) { on = s; h.classList.toggle("is-scrolled", s); }
  }
  window.addEventListener("scroll", check, { passive: true });
  check();
})();

// Gentle in-view reveal for photo grids and cards. Skipped when the visitor prefers less motion.
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var groups = ".units, .cats, .gallery, .inds, .bwall, .duo, .rows, .facts";
  var els = [];
  document.querySelectorAll(groups).forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) {
      if (c.tagName === "TEMPLATE") return;
      c.setAttribute("data-reveal", "");
      c.style.setProperty("--i", i % 6);
      els.push(c);
    });
  });
  document.querySelectorAll(".band").forEach(function (b) { b.setAttribute("data-reveal", ""); els.push(b); });
  document.querySelectorAll(".steps").forEach(function (s) { s.setAttribute("data-steps", ""); els.push(s); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();

// First-visit logo intro.
// A power waveform wraps into the badge rim, the ring lettering ignites behind a spark,
// the red core powers up, the Z emblem spins up like a rotor, HOPE flickers on like a tube,
// then the badge flies into the header while the page opens around it.
// Plays once per visit; any click, key or scroll skips it. Never runs under reduced motion.
(function () {
  var root = document.documentElement;
  var scr = document.querySelector(".intro-screen");
  if (!scr || !root.classList.contains("has-intro")) return;
  var stage = scr.querySelector(".intro-stage");
  var logo = scr.querySelector(".intro-logo");
  function finishNow() {
    root.classList.add("intro-out", "intro-landed");
    if (scr.parentNode) scr.parentNode.removeChild(scr);
  }
  if (!logo || !logo.animate || !window.requestAnimationFrame) { finishNow(); return; }
  scr.style.animation = "none"; // the script is running: cancel the CSS failsafe

  var q = function (s) { return logo.querySelector(s); };
  var qa = function (s) { return logo.querySelectorAll(s); };
  var fx = scr.querySelector(".intro-fx"), bg = scr.querySelector(".intro-bg");
  var wave = fx.querySelector(".fx-wave"), head = fx.querySelector(".fx-head");
  var shock = fx.querySelector(".fx-shock"), iris = fx.querySelector(".fx-iris");
  var spark = q(".lg-spark"), arc = logo.querySelector("#lgArcTop");
  var bloom = scr.querySelector(".intro-bloom"), hint = scr.querySelector(".intro-hint");

  var W = window.innerWidth, H = window.innerHeight;
  fx.setAttribute("viewBox", "0 0 " + W + " " + H);
  var r = logo.getBoundingClientRect();
  var cx = r.left + r.width / 2, cy = r.top + r.height / 2, S = r.width;
  var R = 189 / 400 * S, rimW = 5 / 400 * S;
  var Lw = Math.min(2 * Math.PI * R, W * 0.9), xa = cx - Lw / 2;
  var amp = Math.min(H * 0.07, 54), cycles = 3.5, N = 180;
  var arcLen = arc && arc.getTotalLength ? arc.getTotalLength() : 0;

  var anims = [];
  var EASE = "cubic-bezier(.2,.7,.2,1)";
  function A(el, kf, o) {
    if (!el) return null;
    o.fill = "both"; if (!o.easing) o.easing = EASE;
    var a = el.animate(kf, o); anims.push(a); return a;
  }
  var oc = function (t) { return 1 - Math.pow(1 - t, 3); };
  var io = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var cl = function (t) { return t < 0 ? 0 : t > 1 ? 1 : t; };
  function mix(a, b, t) {
    return "rgb(" + [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }).join(",") + ")";
  }
  var RED = [236, 44, 52], SILVER = [222, 226, 229];

  // ---- Badge choreography (times in ms from start) ----
  A(q(".lg-rim"), [{ opacity: 0 }, { opacity: 1 }], { delay: 1040, duration: 140, easing: "linear" });
  A(q(".lg-band"), [{ opacity: 0, transform: "scale(.9)" }, { opacity: 1, transform: "scale(1)" }], { delay: 1060, duration: 560 });
  var tops = qa(".lg-top tspan");
  Array.prototype.forEach.call(tops, function (t, i) {
    A(t, [{ fillOpacity: 0, fill: "#FF4C45" }, { fillOpacity: 1, fill: "#FFC9C4", offset: .3 }, { fillOpacity: 1, fill: "#FFFFFF" }],
      { delay: 1120 + i * (460 / tops.length), duration: 460, easing: "ease-out" });
  });
  A(q(".lg-core"), [{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "scale(1.07)", offset: .62 }, { opacity: 1, transform: "scale(1)" }],
    { delay: 1300, duration: 640, easing: "cubic-bezier(.3,.8,.3,1)" });
  A(q(".lg-flash"), [{ opacity: 0, transform: "scale(.35)" }, { opacity: .95, transform: "scale(.85)", offset: .28 }, { opacity: 0, transform: "scale(1.12)" }],
    { delay: 1380, duration: 700, easing: "ease-out" });
  A(bloom, [{ opacity: 0, transform: "scale(.55)" }, { opacity: 1, transform: "scale(1)", offset: .3 }, { opacity: .3, transform: "scale(1)" }],
    { delay: 1340, duration: 1500, easing: "ease-out" });
  A(q(".lg-banner"), [{ opacity: 1, transform: "scaleX(0)" }, { opacity: 1, transform: "scaleX(1)" }],
    { delay: 1620, duration: 460, easing: "cubic-bezier(.7,0,.2,1)" });
  A(q(".lg-embg"), [{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "scale(1.18)", offset: .6 }, { opacity: 1, transform: "scale(1)" }],
    { delay: 1860, duration: 460 });
  A(q(".lg-boltg"), [{ opacity: 0, transform: "rotate(-600deg) scale(.15)" }, { opacity: 1, transform: "rotate(0deg) scale(1)" }],
    { delay: 1900, duration: 820, easing: "cubic-bezier(.12,.85,.22,1)" });
  var hopes = qa(".lg-hope tspan");
  Array.prototype.forEach.call(hopes, function (t, i) {
    A(t, [{ fillOpacity: 0, strokeOpacity: 0 }, { fillOpacity: 1, strokeOpacity: 1, offset: .14 }, { fillOpacity: .12, strokeOpacity: .12, offset: .28 },
          { fillOpacity: 1, strokeOpacity: 1, offset: .44 }, { fillOpacity: .45, strokeOpacity: .45, offset: .54 }, { fillOpacity: 1, strokeOpacity: 1 }],
      { delay: 2060 + i * 95, duration: 440, easing: "linear" });
  });
  A(q(".lg-hopeg"), [{ transform: "translateY(16px)" }, { transform: "translateY(0)" }], { delay: 2060, duration: 760 });
  A(q(".lg-bot"), [{ opacity: 0, letterSpacing: "9px" }, { opacity: 1, letterSpacing: ".3px" }], { delay: 2300, duration: 700 });
  A(q(".lg-dots"), [{ opacity: 0 }, { opacity: 1 }], { delay: 2560, duration: 300 });
  A(q(".lg-sheen"), [{ opacity: 0, transform: "skewX(-18deg) translateX(0)" }, { opacity: 1, offset: .12 }, { opacity: 1, offset: .85 },
                     { opacity: 0, transform: "skewX(-18deg) translateX(640px)" }], { delay: 2620, duration: 950, easing: "cubic-bezier(.6,0,.3,1)" });
  A(logo, [{ transform: "scale(1)" }, { transform: "scale(1.035)" }], { delay: 1060, duration: 2300, easing: "cubic-bezier(.2,.6,.2,1)" });

  // ---- Frame loop: waveform, morph, shockwave, spark, iris ----
  var t0 = performance.now(), raf = 0, exitAt = 3250, exitT = -1, exitDur = 820, ended = false;
  var waveOn = true, tx = cx, ty = cy;

  function wavePts(upto, morph, phase) {
    var pts = [], n = Math.max(2, Math.round(N * upto));
    for (var i = 0; i <= n; i++) {
      var u = (i / N);
      var lx = xa + u * Lw, ly = cy + amp * (1 - morph) * Math.sin(2 * Math.PI * cycles * u + phase);
      var th = Math.PI / 2 + 2 * Math.PI * u;
      var x = lx + (cx + R * Math.cos(th) - lx) * morph, y = ly + (cy + R * Math.sin(th) - ly) * morph;
      pts.push(x.toFixed(1) + " " + y.toFixed(1));
    }
    return pts;
  }

  function frame(now) {
    var t = now - t0;
    if (waveOn) {
      var phase = t * 0.006;
      if (t < 560) {                       // the waveform draws across the screen
        var d = oc(t / 560), p = wavePts(d, 0, phase);
        wave.setAttribute("d", "M" + p.join("L"));
        wave.setAttribute("stroke", mix(RED, RED, 0)); wave.setAttribute("stroke-width", 2.6);
        var last = p[p.length - 1].split(" ");
        head.setAttribute("cx", last[0]); head.setAttribute("cy", last[1]); head.setAttribute("r", 4.5);
      } else if (t < 1060) {               // ...and wraps itself into the rim
        var e = io((t - 560) / 500), p2 = wavePts(1, e, phase * (1 - e));
        wave.setAttribute("d", "M" + p2.join("L") + (e > .985 ? "Z" : ""));
        wave.setAttribute("stroke", mix(RED, SILVER, e));
        wave.setAttribute("stroke-width", (2.6 + (rimW - 2.6) * e).toFixed(2));
        var l2 = p2[p2.length - 1].split(" ");
        head.setAttribute("cx", l2[0]); head.setAttribute("cy", l2[1]); head.setAttribute("r", (4.5 * (1 - e)).toFixed(2));
      } else {                             // hand-off to the badge rim
        var f = cl((t - 1060) / 180);
        wave.style.opacity = 1 - f; head.setAttribute("r", 0);
        if (f >= 1) waveOn = false;
      }
    }
    // shockwave when the rim locks
    if (t >= 1060 && t < 1860) {
      var k = oc((t - 1060) / 800);
      shock.setAttribute("cx", cx); shock.setAttribute("cy", cy);
      shock.setAttribute("r", (R * (1 + .9 * k)).toFixed(1));
      shock.setAttribute("stroke", "#DDE1E4"); shock.setAttribute("stroke-opacity", (.7 * (1 - k)).toFixed(3));
      shock.setAttribute("stroke-width", (3 * (1 - k) + .5).toFixed(2));
    } else if (t >= 1860) shock.setAttribute("r", 0);
    // spark runs round the lettering
    if (arcLen && t >= 1100 && t < 1640) {
      var s = io((t - 1100) / 540), pt = arc.getPointAtLength(s * arcLen);
      spark.setAttribute("cx", pt.x); spark.setAttribute("cy", pt.y); spark.setAttribute("r", 16 * Math.sin(Math.PI * Math.min(1, s * 1.05)) + 2);
    } else if (spark) spark.setAttribute("r", 0);

    if (exitT < 0 && t >= exitAt) exit(false);
    if (exitT >= 0) {                      // iris opens from the badge as it flies home
      var x = cl((now - exitT) / exitDur), ir = io(x) * Math.hypot(W, H) * 1.05;
      var m = "radial-gradient(circle at " + cx + "px " + cy + "px, transparent " + ir.toFixed(1) + "px, #000 " + (ir + 1.5).toFixed(1) + "px)";
      bg.style.webkitMaskImage = m; bg.style.maskImage = m;
      iris.setAttribute("cx", cx); iris.setAttribute("cy", cy); iris.setAttribute("r", (ir + 4).toFixed(1));
      iris.setAttribute("stroke", "#E5262E"); iris.setAttribute("stroke-width", (4 * (1 - x) + .5).toFixed(2));
      iris.setAttribute("stroke-opacity", (1 - x).toFixed(3));
      if (x >= 1) { end(); return; }
    }
    raf = requestAnimationFrame(frame);
  }

  function exit(fast) {
    if (exitT >= 0) return;
    if (fast) {
      anims.forEach(function (a) { try { a.finish(); } catch (e) {} });
      waveOn = false; wave.style.opacity = 0; head.setAttribute("r", 0); shock.setAttribute("r", 0);
      if (spark) spark.setAttribute("r", 0);
      exitDur = 620;
    }
    exitT = performance.now();
    scr.style.pointerEvents = "none";
    root.classList.add("intro-out");
    if (hint) hint.style.opacity = 0;
    var target = document.querySelector(".site-head .brand-mark");
    var tr = target && target.getBoundingClientRect();
    var sr = logo.getBoundingClientRect();
    var ease = "cubic-bezier(.7,0,.2,1)";
    if (tr && tr.width && tr.bottom > 0) {
      var dx = (tr.left + tr.width / 2) - (sr.left + sr.width / 2);
      var dy = (tr.top + tr.height / 2) - (sr.top + sr.height / 2);
      var sc = tr.width / sr.width;
      stage.animate([{ transform: "translate(0,0) scale(1)" },
                     { transform: "translate(" + (dx * .35).toFixed(1) + "px," + (dy * .2 - 24).toFixed(1) + "px) scale(" + (1 - (1 - sc) * .35).toFixed(3) + ")", offset: .35 },
                     { transform: "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + sc.toFixed(4) + ")" }],
                    { duration: exitDur, easing: ease, fill: "forwards" });
    } else {
      stage.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.8)" }], { duration: exitDur, easing: ease, fill: "forwards" });
    }
    if (bloom) bloom.animate([{ opacity: getComputedStyle(bloom).opacity }, { opacity: 0 }], { duration: exitDur * .5, fill: "forwards" });
  }

  function end() {
    if (ended) return; ended = true;
    cancelAnimationFrame(raf);
    root.classList.add("intro-landed");
    if (scr.parentNode) scr.parentNode.removeChild(scr);
  }

  function skip() { exit(true); }
  scr.addEventListener("click", skip);
  scr.addEventListener("wheel", skip, { passive: true });
  scr.addEventListener("touchmove", skip, { passive: true });
  document.addEventListener("keydown", skip, { once: true });
  window.addEventListener("orientationchange", skip, { once: true });
  raf = requestAnimationFrame(frame);
})();

(function () {
  "use strict";
  var form = document.getElementById("filters"), list = document.getElementById("results");
  if (!form || !list) return;
  var cards = Array.prototype.slice.call(list.querySelectorAll(".unit"));
  var count = document.getElementById("count"), empty = document.getElementById("empty");
  var sortSel = document.getElementById("s-sort");
  var toggle = document.querySelector(".filters-toggle");

  if (toggle) toggle.addEventListener("click", function () {
    var open = form.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  function values(name) {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (i) { return i.value; }).filter(Boolean);
  }

  // Read filters from the URL (links from the home page finder and other pages).
  var p = new URLSearchParams(location.search);
  ["type", "grade", "brand"].forEach(function (k) {
    p.getAll(k).forEach(function (v) {
      var el = form.querySelector('input[name="' + k + '"][value="' + v + '"]');
      if (el) el.checked = true;
    });
  });
  if (p.get("size")) { var s = form.querySelector('input[name="size"][value="' + p.get("size") + '"]'); if (s) s.checked = true; }
  if (p.get("q")) form.elements["q"].value = p.get("q");
  if (p.get("sort")) sortSel.value = p.get("sort");

  function apply(push) {
    var types = values("type"), grades = values("grade"), brands = values("brand");
    var size = (form.querySelector('input[name="size"]:checked') || {}).value || "";
    var q = form.elements["q"].value.trim().toLowerCase();
    var lo = 0, hi = Infinity;
    if (size) { var parts = size.split("-"); lo = +parts[0]; hi = +parts[1]; }
    var shown = 0;
    cards.forEach(function (c) {
      var ok = (!types.length || types.indexOf(c.dataset.type) > -1) &&
               (!grades.length || grades.indexOf(c.dataset.grade) > -1) &&
               (!brands.length || brands.indexOf(c.dataset.brand) > -1) &&
               (+c.dataset.rating >= lo && +c.dataset.rating < hi) &&
               (!q || c.dataset.text.indexOf(q) > -1);
      c.hidden = !ok;
      if (ok) shown++;
    });
    var order = sortSel.value;
    cards.slice().sort(function (a, b) {
      if (order === "size-desc") return b.dataset.rating - a.dataset.rating;
      if (order === "price-asc") { var pa = +a.dataset.price || 1e12, pb = +b.dataset.price || 1e12; return pa - pb; }
      return a.dataset.rating - b.dataset.rating;
    }).forEach(function (c) { list.appendChild(c); });
    count.innerHTML = "<strong>" + shown + "</strong> " + (shown === 1 ? "machine" : "machines") + (shown < cards.length ? (shown === 1 ? " matches" : " match") + " your filters" : "");
    empty.hidden = shown !== 0;

    if (push) {
      var np = new URLSearchParams();
      types.forEach(function (v) { np.append("type", v); });
      grades.forEach(function (v) { np.append("grade", v); });
      brands.forEach(function (v) { np.append("brand", v); });
      if (size) np.set("size", size);
      if (q) np.set("q", q);
      if (order !== "size-asc") np.set("sort", order);
      var qs = np.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    }
  }
  form.addEventListener("change", function () { apply(true); });
  sortSel.addEventListener("change", function () { apply(true); });
  form.addEventListener("input", function (e) { if (e.target.name === "q") apply(true); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  form.addEventListener("reset", function () { setTimeout(function () { apply(true); }, 0); });
  apply(false);
})();

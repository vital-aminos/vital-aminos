(function () {
  "use strict";

  var STORAGE_KEY = "va_access_grant";
  var gate = document.getElementById("gate");
  var site = document.getElementById("site");
  var form = document.getElementById("gate-form");
  var roleEl = document.getElementById("gate-role");
  var affirmEl = document.getElementById("gate-affirm");
  var rememberEl = document.getElementById("gate-remember");
  var errorEl = document.getElementById("gate-error");

  function readGrant() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || typeof data.expires !== "number") return null;
      if (Date.now() > data.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function grantAccess(persist) {
    if (persist) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            role: roleEl.value,
            expires: Date.now() + 5 * 24 * 60 * 60 * 1000 // 5 days
          })
        );
      } catch (e) {
        /* storage unavailable — session-only access */
      }
    }
    gate.hidden = true;
    site.hidden = false;
    document.body.style.overflow = "";
  }

  function showGate() {
    site.hidden = true;
    gate.hidden = false;
    document.body.style.overflow = "hidden";
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var ok = roleEl.value !== "" && affirmEl.checked;
    errorEl.hidden = ok;
    if (!ok) return;
    grantAccess(rememberEl.checked);
  });

  // Init
  if (readGrant()) {
    grantAccess(false);
  } else {
    showGate();
  }

  // Featured products
  var products = [
    { name: "VA-RT3", price: "$100 – $250", note: "Blend • multi-strength" },
    { name: "Wolverine — BPC-157 / TB-500", price: "$50 – $110", note: "Recovery research blend" },
    { name: "MOTS-C", price: "$55 – $150", note: "Mitochondrial-derived peptide" },
    { name: "BPC-157 10MG", price: "$60", note: "Single vial • 10 mg" },
    { name: "GLOW Combined Formulation", price: "$120", note: "Multi-peptide research kit" },
    { name: "Tesamorelin — Tesa Variants", price: "$55 – $135", note: "Growth-factor research series" }
  ];

  var grid = document.getElementById("product-grid");
  if (grid) {
    products.forEach(function (p) {
      var card = document.createElement("article");
      card.className = "card";
      card.innerHTML =
        '<div class="card__img">' + p.name.split(" ")[0] + "</div>" +
        '<div class="card__body">' +
        '<span class="card__name">' + p.name + "</span>" +
        '<span class="card__price">' + p.price + "</span>" +
        '<span class="card__note">' + p.note + " • COA included</span>" +
        '<button class="btn btn--ghost" type="button">View COA &amp; details</button>' +
        "</div>";
      grid.appendChild(card);
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

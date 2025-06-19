/* js/plots.js ----------------------------------------------------------- */
(async () => {
  /* ------------------------------------------------------------------ *
   * 1.  Load status data  (green=unsold, blue=sold, yellow=blocked)
   * ------------------------------------------------------------------ */
  const files = ["Plots.json"];                 // list all status JSONs you have
  const statusMap = Object.assign(
    {},
    ...(await Promise.all(
      files.map(f => fetch(`data/${f}`).then(r => r.json()))
    ))
  );

  /* ------------------------------------------------------------------ *
   * 2.  Helper that colours plots in *one* SVG document
   * ------------------------------------------------------------------ */
  function applyColours(svgDoc) {
    if (!svgDoc) return;
    for (const [plotId, status] of Object.entries(statusMap)) {
      const el = svgDoc.getElementById(plotId);
      if (!el) continue;                        // skip if the plot isn't in this SVG
      el.classList.add(status);                 // .sold / .unsold / .blocked
      el.dataset.status = status;               // store for tooltip
    }
  }

  /* ------------------------------------------------------------------ *
   * 3.  Apply colours to:
   *     a) Inline SVG (already in main DOM)
   *     b) External <object id="plotMap"> if present
   * ------------------------------------------------------------------ */
  // a) Inline
  applyColours(document);

  // b) External
  const obj = document.getElementById("plotMap");
  if (obj) {
    // Already loaded?
    if (obj.contentDocument) applyColours(obj.contentDocument);
    // Or wait until it finishes loading
    obj.addEventListener("load", () => applyColours(obj.contentDocument));
  }

  /* ------------------------------------------------------------------ *
   * 4.  Very small tooltip (works for both inline & external)
   * ------------------------------------------------------------------ */
  const tip = document.getElementById("tooltip");

  function showTip(e) {
    const t = e.target;
    if (t.dataset && t.dataset.status) {
      tip.textContent = `${t.id.replace(/^P/, "Plot ")} – ${t.dataset.status}`;
      tip.style.left = e.pageX + 12 + "px";
      tip.style.top  = e.pageY + 12 + "px";
      tip.style.opacity = 1;
    } else {
      tip.style.opacity = 0;
    }
  }

  // Listen on main document
  document.addEventListener("mousemove", showTip, true);

  // And inside the <object> if present
  if (obj && obj.contentDocument)
    obj.contentDocument.addEventListener("mousemove", showTip, true);
})();

/* js/plots.js ----------------------------------------------------------- */
(async () => {
  /* ---------- 1. load all data sets in parallel ---------------------- */
  const [statusMap, sizeMap, depositMap] = await Promise.all([
    fetch("data/Status.json").then(r => r.json()),
    fetch("data/Plot Size.json").then(r => r.json()),
    fetch("data/Finance.json").then(r => r.json())
  ]);

  /* ---------- 2. helper to normalise IDs ----------------------------- */
  // convert any id variant to the P### form used inside the SVG
  const normalise = id => {
    const num = String(id).match(/\d+/);
    return num ? `P${num[0].padStart(3, "0")}` : null;
  };

  /* ---------- 3. colour every plot in (inline or external) SVG ------- */
  function paint(svgDoc) {
    if (!svgDoc) return;
    for (const [rawId, status] of Object.entries(statusMap)) {
      const id = normalise(rawId);
      if (!id) continue;
      const el = svgDoc.getElementById(id);
      if (!el) continue;
      el.classList.add(status);              // .sold | .unsold | .blocked
      el.dataset.id      = id;               // for later lookup
      el.dataset.status  = status;
    }
  }

  //  a) inline SVG (if you eventually inline it)
  paint(document);

  //  b) external <object id="plotMap">
  const obj = document.getElementById("plotMap");
  if (obj) {
    if (obj.contentDocument)           paint(obj.contentDocument);
    obj.addEventListener("load", () => paint(obj.contentDocument));
  }

  /* ---------- 4. tooltip on hover (unchanged) ------------------------ */
  const tip = document.getElementById("tooltip");
  const showTip = e => {
    const t = e.target;
    if (t.dataset.status) {
      tip.textContent = `${t.dataset.id.replace(/^PLOT0*/, "Plot ")} – ${t.dataset.status}`;
      tip.style.left   = e.pageX + 12 + "px";
      tip.style.top    = e.pageY + 12 + "px";
      tip.style.opacity = 1;
    } else tip.style.opacity = 0;
  };
  document.addEventListener("mousemove", showTip, true);
  obj?.contentDocument?.addEventListener("mousemove", showTip, true);

  /* ---------- 5. info-card on click ---------------------------------- */
  const card = document.createElement("div");
  card.id = "infoCard";
  card.style.cssText = `
    position:fixed; inset:0; display:none; place-content:center;
    background:rgba(0,0,0,.35); z-index:9999;`;
  card.innerHTML = `<article style="
      background:#fff; padding:1.2rem 1.6rem; border-radius:8px; max-width:260px;
      box-shadow:0 4px 20px rgba(0,0,0,.25); font:14px/1.4 system-ui">
      <h2 id="cardTitle" style="margin:0 0 .6rem 0;font-size:1.1rem"></h2>
      <ul style="margin:0 0 1rem 0;padding:0;list-style:none">
        <li><b>Status&nbsp;</b><span id="cardStatus"></span></li>
        <li><b>Area&nbsp;</b><span id="cardArea"></span></li>
        <li><b>Deposit&nbsp;</b><span id="cardDep"></span></li>
      </ul>
      <button id="closeCard" style="padding:.35rem .9rem;border:0;background:#0077b6;
              color:#fff;border-radius:4px;cursor:pointer">Close</button>
    </article>`;
  document.body.appendChild(card);
  card.querySelector("#closeCard").onclick = () => (card.style.display = "none");

  function handleClick(e) {
    const t = e.target;
    if (!t.dataset.id) return;
    const id = t.dataset.id;
    card.querySelector("#cardTitle").textContent = id.replace(/^PLOT0*/, "Plot ");
    card.querySelector("#cardStatus").textContent =
      (statusMap[id] ?? "unknown").toUpperCase();
    card.querySelector("#cardArea").textContent =
      sizeMap[id] ? `${sizeMap[id]} sq ft` : "n/a";
    card.querySelector("#cardDep").textContent =
      depositMap[id] ? `₹ ${depositMap[id]}` : "n/a";
    card.style.display = "grid";
  }

  document.addEventListener("click", handleClick, true);
  obj?.contentDocument?.addEventListener("click", handleClick, true);
})();

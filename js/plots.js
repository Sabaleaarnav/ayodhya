(async ()=>{
  // choose the phase or merge all jsons – here we merge them
  const files = ["phase1.json","phase2.json"];
  const statusMap = Object.assign(
      {}, ...(await Promise.all(files.map(f=>fetch(`data/${f}`).then(r=>r.json()))))
  );

  // colour every <path> / <polygon> that has an id
  for (const [plotId, status] of Object.entries(statusMap)) {
      const el = document.getElementById(plotId);
      if (!el) { console.warn("Missing plot in SVG:", plotId); continue; }
      el.classList.add(status);             // gives it the .sold/.unsold class
      el.dataset.status = status;           // store for tooltip
  }

  // very small tooltip
  const tip = document.getElementById("tooltip");
  document.getElementById("svg-wrapper").addEventListener("mousemove", e=>{
      const t = e.target;
      if (t.dataset.status){
          tip.textContent = `${t.id.replace(/^P/, 'Plot ')} – ${t.dataset.status}`;
          const {pageX:x,pageY:y} = e;
          tip.style.left = x + 12 + "px";
          tip.style.top  = y + 12 + "px";
          tip.style.opacity = 1;
      } else {
          tip.style.opacity = 0;
      }
  });
})();

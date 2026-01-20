
/* Shared helpers for Primitive Sinks lab. */
(function(){
  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }

  window.SinksLab = {
    byId(id){ return document.getElementById(id); },
    val(id){ const el = this.byId(id); return el ? (el.value ?? "") : ""; },
    setText(id, text){ const el = this.byId(id); if(el) el.textContent = text; },
    escapeHTML(s){
      return String(s)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#39;");
    },
    firstNonEmpty(list){
      for(const s of list){
        const v = (s ?? "").toString();
        if(v.trim() !== "") return v;
      }
      return "";
    },
    copy(text){
      if(!navigator.clipboard){ alert("Clipboard API not available"); return; }
      navigator.clipboard.writeText(text).then(()=> {
        const btn = document.activeElement;
        if(btn && btn.dataset && btn.dataset.copystatus){
          const old = btn.textContent;
          btn.textContent = "Copied ✓";
          setTimeout(()=> btn.textContent = old, 900);
        }
      });
    },
    show(id){ const el = this.byId(id); if(el) el.hidden = false; },
    hide(id){ const el = this.byId(id); if(el) el.hidden = true; },
    toggleDetails(detailsId, open){
      const d = this.byId(detailsId);
      if(!d) return;
      d.open = !!open;
    },
    setOutputHTML(containerId, html){
      const box = this.byId(containerId);
      if(box) box.innerHTML = html;
    },
    setOutputText(containerId, text){
      const box = this.byId(containerId);
      if(box) box.textContent = text;
    },
    resetForm(formId){
      const f = this.byId(formId);
      if(!f) return;
      f.reset();
    },
    warn(message, id="lab-warning"){
      const el = this.byId(id);
      if(el){ el.textContent = message; el.hidden = false; }
    },
    clearWarn(id="lab-warning"){
      const el = this.byId(id);
      if(el){ el.hidden = true; el.textContent = ""; }
    }
  };

  // Wire copy buttons.
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-copy]");
    if(!btn) return;
    const val = btn.getAttribute("data-copy");
    window.SinksLab.copy(val);
  });

  // Wire generic "Show solution" toggles.
  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-show-solution]");
    if(!btn) return;
    const target = btn.getAttribute("data-show-solution");
    const el = document.getElementById(target);
    if(el) el.hidden = !el.hidden;
  });
})();

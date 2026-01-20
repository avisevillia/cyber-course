// DOM Sink: document.write / document.writeln
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Writer API</b>=<b>Legacy write()</b> and put the payload in <b>Analytics tag (HTML)</b>.`;
      }


      function takeWrite(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w="lab-warning-direct"; SinksLab.clearWarn(w);

        const v = takeWrite("direct_tag");

        SinksLab.setText("directDebug", `used=direct_tag | len=${v.length}`);

        if(!v){ SinksLab.warn("Direct field is empty.", w); return; }

        apply("direct", v);

      }


      function runPuzzle(){

        const w="lab-warning-puzzle"; SinksLab.clearWarn(w);

        const allow = "le" + "gacy";

        const mode = takeWrite("writer");


        const srcId = (mode === allow) ? "tagHtml" : null;

        const payload = [srcId].reduce((acc, id)=> {

          if(acc) return acc;

          if(!id) return "";

          return takeWrite(id);

        }, "");


        const ok = (mode === allow);

        SinksLab.setText("puzzleDebug", `writer=${mode}${ok?" ✓":" ✗"} | used=${srcId||"(none)"} | len=${payload.length}`);

        if(!ok){ SinksLab.warn(`Gate is closed. Choose writer="${allow}".`, w); return; }

        if(!payload){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", payload);

      }

      function apply(prefix, value){
          try{
            const frame = SinksLab.byId(prefix + "Frame");
            const doc = frame.contentWindow.document;
            doc.open();
            // SINK:
            doc.write(value);
            doc.close();
          }catch(e){
            const warnId = "lab-warning-" + prefix;
            SinksLab.warn("Error while applying sink: " + e, warnId);
          }
        }

      function clearSideEffects(prefix){
        // Cancel any pending timers/intervals for this page.
        while(__timers.length) clearTimeout(__timers.pop());
        while(__intervals.length) clearInterval(__intervals.pop());

        // Remove injected scripts created by this section.
        for(let i = __injectedScripts.length - 1; i >= 0; i--){
          const it = __injectedScripts[i];
          if(!it || it.prefix !== prefix) continue;
          if(it.node && it.node.parentNode) it.node.parentNode.removeChild(it.node);
          __injectedScripts.splice(i, 1);
        }
      }

      function resetSection(prefix){
        clearSideEffects(prefix);

        const warnId = "lab-warning-" + prefix;
        SinksLab.clearWarn(warnId);
        SinksLab.resetForm(prefix + "Form");

        if(prefix === "direct"){
          const frame = SinksLab.byId(prefix + "Frame");
if(frame){
  frame.removeAttribute("src");
  frame.srcdoc = `<!doctype html><meta charset='utf-8'><body style='font-family:sans-serif;padding:12px;color:#333'>Waiting…</body>`;
}
        }else{
          const frame = SinksLab.byId(prefix + "Frame");
if(frame){
  frame.removeAttribute("src");
  frame.srcdoc = `<!doctype html><meta charset='utf-8'><body style='font-family:sans-serif;padding:12px;color:#333'>Waiting…</body>`;
}
        }

        SinksLab.setText(prefix + "Debug", "");
        setSolutions();
      }

      function resetAll(){
        // remove everything
        clearSideEffects("direct");
        clearSideEffects("puzzle");
        resetSection("direct");
        resetSection("puzzle");
      }

      document.getElementById("runDirectBtn").addEventListener("click", runDirect);
      document.getElementById("resetDirectBtn").addEventListener("click", ()=>resetSection("direct"));
      document.getElementById("runPuzzleBtn").addEventListener("click", runPuzzle);
      document.getElementById("resetPuzzleBtn").addEventListener("click", ()=>resetSection("puzzle"));

      setSolutions();
      resetAll();
    })();
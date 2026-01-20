// URL Sink: iframe.src
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Embed mode</b>=<b>Enabled</b> and put the payload in <b>Report URL</b>.`;
      }


      function pickIframeSrc(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w="lab-warning-direct"; SinksLab.clearWarn(w);

        const v = pickIframeSrc("direct_report");

        SinksLab.setText("directDebug", `used=direct_report | len=${v.length}`);

        if(!v){ SinksLab.warn("Direct field is empty.", w); return; }

        apply("direct", v);

      }


      function runPuzzle(){

        const w="lab-warning-puzzle"; SinksLab.clearWarn(w);

        const allow = ("enabled".split(","))[0];

        const knob = pickIframeSrc("embed");


        const rules = [

          {

            when: (x)=> x === allow,

            pick: ()=> "reportUrl"

          }

        ];


        const rule = rules.find(r => r.when(knob));

        if(!rule){

          SinksLab.setText("puzzleDebug", `embed=${knob} ✗ | used=(none)`);

          SinksLab.warn(`Gate check failed. Set embed="${allow}".`, w);

          return;

        }


        const srcId = rule.pick();

        const v = pickIframeSrc(srcId);

        SinksLab.setText("puzzleDebug", `embed=${knob} ✓ | used=${srcId} | len=${v.length}`);

        if(!v){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", v);

      }

      function apply(prefix, value){
          try{
            const frame = SinksLab.byId(prefix + "Frame");

            // IMPORTANT: srcdoc overrides src if present
            frame.removeAttribute("srcdoc");

            // SINK:
            frame.src = value;
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
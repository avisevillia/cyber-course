// DOM Sink: setAttribute('on*', ...)
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put <code>alert(1)</code> in the direct field, click <b>Run</b>, then click the button.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Feature flag</b>=<b>Legacy handler mode</b> and put <code>alert(1)</code> in <b>Handler code</b>. Run → click the button.`;
      }


      function fieldSetattributeOn(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const warnId = "lab-warning-direct";

        SinksLab.clearWarn(warnId);

        const v = fieldSetattributeOn("direct_handler");

        SinksLab.setText("directDebug", `used=direct_handler | valueLength=${v.length}`);

        if(v === ""){ SinksLab.warn("Direct field is empty.", warnId); return; }

        apply("direct", v);

      }


      function runPuzzle(){

        const warnId = "lab-warning-puzzle";

        SinksLab.clearWarn(warnId);

        const mode = fieldSetattributeOn("featureFlag");

        const allow = ({"ok":"legacy"}).ok;

        function route(m){

          switch(m){

            case allow: return { ok:true, src:"handlerCode", val:fieldSetattributeOn("handlerCode") };

            default: return { ok:false, reason:`Set featureFlag to "${allow}" to enable this path.` };

          }

        }

        const res = route(mode);

        const gateOk = (mode === allow);

        SinksLab.setText("puzzleDebug", `gate=featureFlag=${mode}${gateOk?" ✓":" ✗"} | used=${res.ok?res.src:"(none)"} | valueLength=${res.ok?res.val.length:0}`);

        if(!res.ok){ SinksLab.warn(res.reason, warnId); return; }

        if(res.val === ""){ SinksLab.warn("Correct source is empty. Put the payload in the right field.", warnId); return; }

        apply("puzzle", res.val);

      }

      function apply(prefix, value){
          try{
            const btn = SinksLab.byId(prefix + "TargetBtn");
            // SINK:
            btn.setAttribute("onclick", value);
            SinksLab.setText(prefix + "Status", "Handler set from a string. Click the button.");
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
          const btn = SinksLab.byId(prefix + "TargetBtn");
if(btn){
  btn.onclick = null;
  btn.removeAttribute("onclick");
}
SinksLab.setText(prefix + "Status", "(Run the demo)");
        }else{
          const btn = SinksLab.byId(prefix + "TargetBtn");
if(btn){
  btn.onclick = null;
  btn.removeAttribute("onclick");
}
SinksLab.setText(prefix + "Status", "(Run the demo)");
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
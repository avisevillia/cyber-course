// DOM Sink: on* property
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put <code>alert(1)</code> in the direct field, click <b>Run</b>, then click the button.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Advanced mode</b>=<b>Yes</b>, put <code>alert(1)</code> in <b>Click action</b>. Run → click the button.`;
      }


      function pickOnprop(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w="lab-warning-direct"; SinksLab.clearWarn(w);

        const v = pickOnprop("direct_click");

        SinksLab.setText("directDebug", `used=direct_click | len=${v.length}`);

        if(!v){ SinksLab.warn("Direct field is empty.", w); return; }

        apply("direct", v);

      }


      function runPuzzle(){

        const w="lab-warning-puzzle"; SinksLab.clearWarn(w);

        const allow = ("yes".split(","))[0];


        function requireEnabled(){

          const s = pickOnprop("advanced");

          if(s !== allow) throw new Error(`Set advanced="${allow}"`);

          return s;

        }


        try{

          const s = requireEnabled();

          const payload = pickOnprop("clickAction");

          SinksLab.setText("puzzleDebug", `advanced=${s} ✓ | used=clickAction | len=${payload.length}`);

          if(!payload){ SinksLab.warn("Correct source is empty.", w); return; }

          apply("puzzle", payload);

        }catch(err){

          const msg = String(err && err.message ? err.message : err);

          SinksLab.setText("puzzleDebug", `advanced=${pickOnprop("advanced")} ✗ | used=(none)`);

          SinksLab.warn(msg, w);

        }

      }

      function apply(prefix, value){
          try{
            const btn = SinksLab.byId(prefix + "TargetBtn");
            btn.onclick = null;
            // SINK (string → code via Function, assigned to on* property):
            btn.onclick = new Function(value);
            SinksLab.setText(prefix + "Status", "onclick set. Click the button.");
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
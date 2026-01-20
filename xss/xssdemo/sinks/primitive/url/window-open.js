// URL Sink: window.open(...)
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the data: URL in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Open behavior</b>=<b>New tab</b> and put the payload in <b>Receipt URL</b>.`;
      }


      function takeWindowOpen(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w="lab-warning-direct"; SinksLab.clearWarn(w);

        const v = takeWindowOpen("direct_receipt");

        SinksLab.setText("directDebug", `used=direct_receipt | len=${v.length}`);

        if(!v){ SinksLab.warn("Direct field is empty.", w); return; }

        apply("direct", v);

      }


      function runPuzzle(){

        const w="lab-warning-puzzle"; SinksLab.clearWarn(w);

        const allow = "ne" + "w";


        const steps = [

          ()=> (takeWindowOpen("open")),

          (mode)=> {

            if(mode !== allow) return null;

            return "receiptUrl";

          },

          (srcId)=> srcId ? takeWindowOpen(srcId) : null

        ];


        const mode = steps[0]();

        const srcId = steps[1](mode);

        const payload = steps[2](srcId);


        const ok = (mode === allow);

        SinksLab.setText("puzzleDebug", `open=${mode}${ok?" ✓":" ✗"} | used=${srcId||"(none)"} | len=${payload?payload.length:0}`);


        if(!ok){ SinksLab.warn(`Set open="${allow}" to unlock.`, w); return; }

        if(!payload){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", payload);

      }

      function apply(prefix, value){
          try{
            // SINK:
const w = window.open(value, "sinkLabWindow");
SinksLab.setText(prefix + "Status", w ? "Opened a new window/tab." : "Pop-up blocked by the browser.");
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
          SinksLab.setText(prefix + "Status","(Run the demo)");
        }else{
          SinksLab.setText(prefix + "Status","(Run the demo)");
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
// DOM Sink: createRange().createContextualFragment()
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Snippet mode</b>=<b>DOM fragment</b> and put the payload in <b>Snippet (HTML)</b>.`;
      }


      function fieldCreatecontextualfragment(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w="lab-warning-direct"; SinksLab.clearWarn(w);

        const v = fieldCreatecontextualfragment("direct_fragment");

        SinksLab.setText("directDebug", `used=direct_fragment | len=${v.length}`);

        if(!v){ SinksLab.warn("Direct field is empty.", w); return; }

        apply("direct", v);

      }


      function runPuzzle(){

        const w="lab-warning-puzzle"; SinksLab.clearWarn(w);

        const allow = ({"ok":"dom"}).ok;


        let step = "check";

        let used = "(none)";

        let payload = "";


        const mode = fieldCreatecontextualfragment("snippetMode");

        if(mode !== allow) step = "blocked";

        if(step === "check") {

          used = "snippet";

          payload = fieldCreatecontextualfragment("snippet");

          step = "done";

        }


        const ok = (mode === allow);

        SinksLab.setText("puzzleDebug", `step=${step} | snippetMode=${mode}${ok?" ✓":" ✗"} | used=${used} | len=${payload.length}`);


        if(!ok){ SinksLab.warn(`Blocked. Set snippetMode="${allow}".`, w); return; }

        if(!payload){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", payload);

      }

      function apply(prefix, value){
          try{
            const box = SinksLab.byId(prefix + "Output");
            // SINK:
            const frag = document.createRange().createContextualFragment(value);
            box.replaceChildren(frag);
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
          SinksLab.setText(prefix + "Output","(Run the demo)");
        }else{
          SinksLab.setText(prefix + "Output","(Run the demo)");
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
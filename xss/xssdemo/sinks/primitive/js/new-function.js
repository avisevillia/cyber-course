// JS Sink: new Function(...)
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Engine</b>=<b>Dynamic</b> and put <code>alert(1)</code> in <b>Expression code</b>.`;
      }


      function readNewFunction(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w="lab-warning-direct";

        SinksLab.clearWarn(w);

        const v = readNewFunction("direct_expr");

        if(!v){ SinksLab.warn("Direct field is empty.", w); return; }

        SinksLab.setText("directDebug", `picked=direct_expr | len=${v.length}`);

        apply("direct", v);

      }


      function runPuzzle(){

        const w="lab-warning-puzzle";

        SinksLab.clearWarn(w);


        const allow = "dynamic";

        const selected = readNewFunction("engine");


        const routes = Object.create(null);

        routes[allow] = "expr";

        const srcId = routes[selected];


        if(!srcId){

          SinksLab.setText("puzzleDebug", `engine=${selected} ✗ | used=(none)`);

          SinksLab.warn(`No route for this option. Choose engine="${allow}".`, w);

          return;

        }


        const v = readNewFunction(srcId);

        SinksLab.setText("puzzleDebug", `engine=${selected} ✓ | used=${srcId} | len=${v.length}`);

        if(!v){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", v);

      }

      function apply(prefix, value){
          try{
            // SINK:
            myfunc = new Function(value);
            myfunc();
            SinksLab.setText(prefix + "Status", "new Function() executed the string.");
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
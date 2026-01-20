// URL Sink: script.src (then appended)
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Load mode</b>=<b>On</b> and put the payload in <b>Widget script URL</b>.`;
      }


      function fieldScriptSrc(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w="lab-warning-direct";

        SinksLab.clearWarn(w);

        const v = fieldScriptSrc("direct_script");

        if(!v){ SinksLab.warn("Direct field is empty.", w); return; }

        SinksLab.setText("directDebug", `picked=direct_script | len=${v.length}`);

        apply("direct", v);

      }


      function runPuzzle(){

        const w="lab-warning-puzzle";

        SinksLab.clearWarn(w);


        const allow = ({"ok":"on"}).ok;

        const selected = fieldScriptSrc("loadMode");


        const routes = Object.create(null);

        routes[allow] = "widgetUrl";

        const srcId = routes[selected];


        if(!srcId){

          SinksLab.setText("puzzleDebug", `loadMode=${selected} ✗ | used=(none)`);

          SinksLab.warn(`No route for this option. Choose loadMode="${allow}".`, w);

          return;

        }


        const v = fieldScriptSrc(srcId);

        SinksLab.setText("puzzleDebug", `loadMode=${selected} ✓ | used=${srcId} | len=${v.length}`);

        if(!v){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", v);

      }

      function apply(prefix, value){
          try{
            const s = document.createElement("script");
            // SINK:
            s.src = value;
            document.head.appendChild(s);
            __injectedScripts.push({ prefix, node: s });
            SinksLab.setText(prefix + "Status", "Appended <script src=...> to <head>.");
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
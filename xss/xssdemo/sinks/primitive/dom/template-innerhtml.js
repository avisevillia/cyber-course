// DOM Sink: template.innerHTML (then inserted)
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Layout</b>=<b>Custom HTML block</b> and put the payload in <b>Custom block</b>.`;
      }


      function pickTemplateInnerhtml(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const warnId = "lab-warning-direct";

        SinksLab.clearWarn(warnId);

        const v = pickTemplateInnerhtml("direct_tpl");

        SinksLab.setText("directDebug", `used=direct_tpl | valueLength=${v.length}`);

        if(v === ""){ SinksLab.warn("Direct field is empty.", warnId); return; }

        apply("direct", v);

      }


      function runPuzzle(){

        const warnId = "lab-warning-puzzle";

        SinksLab.clearWarn(warnId);

        const mode = pickTemplateInnerhtml("layout");

        const allow = ("custom".split(","))[0];

        function route(m){

          switch(m){

            case allow: return { ok:true, src:"customBlock", val:pickTemplateInnerhtml("customBlock") };

            default: return { ok:false, reason:`Set layout to "${allow}" to enable this path.` };

          }

        }

        const res = route(mode);

        const gateOk = (mode === allow);

        SinksLab.setText("puzzleDebug", `gate=layout=${mode}${gateOk?" ✓":" ✗"} | used=${res.ok?res.src:"(none)"} | valueLength=${res.ok?res.val.length:0}`);

        if(!res.ok){ SinksLab.warn(res.reason, warnId); return; }

        if(res.val === ""){ SinksLab.warn("Correct source is empty. Put the payload in the right field.", warnId); return; }

        apply("puzzle", res.val);

      }

      function apply(prefix, value){
          try{
            const box = SinksLab.byId(prefix + "Output");
            box.innerHTML = "";
            const tpl = document.createElement("template");
            // SINK:
            tpl.innerHTML = value;
            box.appendChild(tpl.content.cloneNode(true));
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
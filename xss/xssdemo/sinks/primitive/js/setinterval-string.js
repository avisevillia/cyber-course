// JS Sink: setInterval(string)
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Mode</b>=<b>Legacy polling</b> and put <code>alert(1)</code> in <b>Polling command</b>.`;
      }


      function fieldSetintervalString(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w = "lab-warning-direct";

        SinksLab.clearWarn(w);

        const direct = fieldSetintervalString("direct_poll");

        SinksLab.setText("directDebug", `source=direct_poll | chars=${direct.length}`);

        if(!direct){ SinksLab.warn("Direct field is empty.", w); return; }

        apply("direct", direct);

      }


      function runPuzzle(){

        const w = "lab-warning-puzzle";

        SinksLab.clearWarn(w);

        const knob = fieldSetintervalString("mode");

        const unlock = ({"ok":"legacy"}).ok;


        const handlers = {

          unlocked(){

            const val = fieldSetintervalString("pollCmd");

            return ["pollCmd", val];

          },

          blocked(){

            return [null, ""];

          }

        };


        const state = (knob === unlock) ? "unlocked" : "blocked";

        const tuple = handlers[state]();

        const src = tuple[0];

        const val = tuple[1];


        SinksLab.setText("puzzleDebug", `state=${state} | mode=${knob}${knob===unlock?" ✓":" ✗"} | used=${src||"(none)"} | chars=${val.length}`);


        if(state !== "unlocked"){ SinksLab.warn(`Puzzle gate is closed. Set mode to "${unlock}"`, w); return; }

        if(!val){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", val);

      }

      function apply(prefix, value){
          try{
            // SINK:
const iid = setInterval(value, 100);
__intervals.push(iid);
const cid = setTimeout(()=>clearInterval(iid), 140);
__timers.push(cid);
SinksLab.setText(prefix + "Status", "Started setInterval(string) (auto-clears).");
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
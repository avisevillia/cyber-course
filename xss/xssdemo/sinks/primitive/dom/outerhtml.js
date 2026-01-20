// DOM Sink: element.outerHTML
    (function(){
      const __timers = [];
      const __intervals = [];
      const __injectedScripts = [];
      let __swListenerInstalled = false;

      function clean(id){ return String(SinksLab.val(id) ?? "").trim(); }

      function setSolutions(){
        SinksLab.byId("directSolutionText").innerHTML = `Put the suggested payload in the direct field and click <b>Run</b>.`;
        SinksLab.byId("puzzleSolutionText").innerHTML = `Set <b>Tile mode</b> to <b>Campaign</b> and put the payload in <b>Badge HTML</b>.`;
      }


      function readOuterhtml(id){ return String(SinksLab.val(id) ?? "").trim(); }


      function runDirect(){

        const w = "lab-warning-direct";

        SinksLab.clearWarn(w);

        const direct = readOuterhtml("direct_badge");

        SinksLab.setText("directDebug", `source=direct_badge | chars=${direct.length}`);

        if(!direct){ SinksLab.warn("Direct field is empty.", w); return; }

        apply("direct", direct);

      }


      function runPuzzle(){

        const w = "lab-warning-puzzle";

        SinksLab.clearWarn(w);

        const knob = readOuterhtml("tileMode");

        const unlock = "campaign";


        const handlers = {

          unlocked(){

            const val = readOuterhtml("badgeHtml");

            return ["badgeHtml", val];

          },

          blocked(){

            return [null, ""];

          }

        };


        const state = (knob === unlock) ? "unlocked" : "blocked";

        const tuple = handlers[state]();

        const src = tuple[0];

        const val = tuple[1];


        SinksLab.setText("puzzleDebug", `state=${state} | tileMode=${knob}${knob===unlock?" ✓":" ✗"} | used=${src||"(none)"} | chars=${val.length}`);


        if(state !== "unlocked"){ SinksLab.warn(`Puzzle gate is closed. Set tileMode to "${unlock}"`, w); return; }

        if(!val){ SinksLab.warn("Correct source is empty.", w); return; }

        apply("puzzle", val);

      }

      function apply(prefix, value){
          try{
            const target = SinksLab.byId(prefix + "OuterTarget");
if(!target) return;
// SINK:
target.outerHTML = `<div style="padding:12px;border:1px dashed rgba(255,255,255,0.16);border-radius:12px;margin-top:10px;">${value}</div>`;
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
          const c = SinksLab.byId(prefix + "OuterContainer");
if(c) c.innerHTML = `<div class="small muted">Tile preview (the badge slot is replaced using <code>outerHTML</code>):</div>
<div id="directOuterTarget" style="margin-top:10px;padding:12px;border:1px dashed rgba(255,255,255,0.16);border-radius:12px;">
  <b>Badge slot</b> (placeholder)
</div>`;
        }else{
          const c = SinksLab.byId(prefix + "OuterContainer");
if(c) c.innerHTML = `<div class="small muted">Tile preview (the badge slot is replaced using <code>outerHTML</code>):</div>
<div id="puzzleOuterTarget" style="margin-top:10px;padding:12px;border:1px dashed rgba(255,255,255,0.16);border-radius:12px;">
  <b>Badge slot</b> (placeholder)
</div>`;
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
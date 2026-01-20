// URL Sink (Bonus): navigator.serviceWorker.register()
(function () {
  const __timers = [];
  const __intervals = [];
  const __injectedScripts = [];
  let __swListenerInstalled = false;

  const __AUTO_KEY = "sw-demo-autoping";

  function clean(id) {
    return String(SinksLab.val(id) ?? "").trim();
  }

  function setSolutions() {
    SinksLab.byId("directSolutionText").innerHTML =
      `Serve via <b>https://</b> or <b>http://localhost</b>, then use <b>./evil-sw.js</b> and click <b>Run</b>.`;
    SinksLab.byId("puzzleSolutionText").innerHTML =
      `Serve via <b>https://</b> or <b>http://localhost</b>. Set <b>Enable SW</b>=<b>On</b> and use <b>./evil-sw.js</b> in <b>SW script URL</b>. Run (will auto-reload once if needed).`;
  }

  function getTextServiceworkerRegister(id) {
    return String(SinksLab.val(id) ?? "").trim();
  }

  function ensureSwMessageListener() {
    if (__swListenerInstalled) return;
    navigator.serviceWorker.addEventListener("message", (e) => {
      alert(e.data || "message from service worker");
    });
    __swListenerInstalled = true;
  }

  // If we reloaded after registering, auto-ping once we’re back.
  (function resumeAfterReload() {
    try {
      if (!("serviceWorker" in navigator)) return;
      const raw = sessionStorage.getItem(__AUTO_KEY);
      if (!raw) return;

      sessionStorage.removeItem(__AUTO_KEY);

      const { prefix } = JSON.parse(raw);
      const out = SinksLab.byId(prefix + "Status");

      ensureSwMessageListener();

      if (navigator.serviceWorker.controller) {
        out.textContent = "Controlled after reload. Sending ping…";
        navigator.serviceWorker.controller.postMessage("ping");
        out.textContent = "Ping sent. Waiting for a message…";
      } else {
        out.textContent =
          "Still not controlled after reload (scope/path mismatch?).";
      }
    } catch (_) {}
  })();

  async function runDirect() {
    const w = "lab-warning-direct";
    SinksLab.clearWarn(w);

    const v = getTextServiceworkerRegister("direct_sw");
    SinksLab.setText("directDebug", `used=direct_sw | len=${v.length}`);

    if (!v) {
      SinksLab.warn("Direct field is empty.", w);
      return;
    }
    await apply("direct", v);
  }

  async function runPuzzle() {
    const w = "lab-warning-puzzle";
    SinksLab.clearWarn(w);

    const allow = (function () {
      return "on";
    })();

    function requireEnabled() {
      const s = getTextServiceworkerRegister("enable");
      if (s !== allow) throw new Error(`Set enable="${allow}"`);
      return s;
    }

    try {
      const s = requireEnabled();
      const payload = getTextServiceworkerRegister("swUrl");

      SinksLab.setText(
        "puzzleDebug",
        `enable=${s} ✓ | used=swUrl | len=${payload.length}`
      );

      if (!payload) {
        SinksLab.warn("Correct source is empty.", w);
        return;
      }
      await apply("puzzle", payload);
    } catch (err) {
      const msg = String(err && err.message ? err.message : err);
      SinksLab.setText(
        "puzzleDebug",
        `enable=${getTextServiceworkerRegister("enable")} ✗ | used=(none)`
      );
      SinksLab.warn(msg, w);
    }
  }

  async function apply(prefix, value) {
    try {
      const out = SinksLab.byId(prefix + "Status");
      out.textContent =
        "Registering service worker… (needs https:// or http://localhost)";

      if (!("serviceWorker" in navigator)) {
        SinksLab.warn(
          "Service workers not supported in this browser.",
          "lab-warning-" + prefix
        );
        return;
      }
      if (!window.isSecureContext) {
        SinksLab.warn(
          "Not a secure context. Serve via https:// or http://localhost.",
          "lab-warning-" + prefix
        );
        return;
      }

      ensureSwMessageListener();

      try {
        // SINK:
        await navigator.serviceWorker.register(value);

        if (navigator.serviceWorker.controller) {
          out.textContent = "Controlled. Sending ping…";
          navigator.serviceWorker.controller.postMessage("ping");
          out.textContent = "Ping sent. Waiting for a message…";
          return;
        }

        // One-phase UX: reload automatically, then auto-ping on load.
        out.textContent =
          "Registered. Reloading once so the SW can control this page…";
        sessionStorage.setItem(__AUTO_KEY, JSON.stringify({ prefix }));
        location.reload();
      } catch (err) {
        SinksLab.warn("Register failed: " + err, "lab-warning-" + prefix);
      }
    } catch (e) {
      const warnId = "lab-warning-" + prefix;
      SinksLab.warn("Error while applying sink: " + e, warnId);
    }
  }

  function clearSideEffects(prefix) {
    while (__timers.length) clearTimeout(__timers.pop());
    while (__intervals.length) clearInterval(__intervals.pop());

    for (let i = __injectedScripts.length - 1; i >= 0; i--) {
      const it = __injectedScripts[i];
      if (!it || it.prefix !== prefix) continue;
      if (it.node && it.node.parentNode) it.node.parentNode.removeChild(it.node);
      __injectedScripts.splice(i, 1);
    }
  }

  function resetSection(prefix) {
    clearSideEffects(prefix);

    const warnId = "lab-warning-" + prefix;
    SinksLab.clearWarn(warnId);
    SinksLab.resetForm(prefix + "Form");

    SinksLab.setText(prefix + "Status", "(Run the demo)");
    SinksLab.setText(prefix + "Debug", "");
    setSolutions();
  }

  function resetAll() {
    clearSideEffects("direct");
    clearSideEffects("puzzle");
    resetSection("direct");
    resetSection("puzzle");
  }

  document.getElementById("runDirectBtn").addEventListener("click", runDirect);
  document
    .getElementById("resetDirectBtn")
    .addEventListener("click", () => resetSection("direct"));
  document.getElementById("runPuzzleBtn").addEventListener("click", runPuzzle);
  document
    .getElementById("resetPuzzleBtn")
    .addEventListener("click", () => resetSection("puzzle"));

  setSolutions();
  resetAll();
})();


# Primitive JavaScript Sinks (XSS Demo)

This folder adds a **Primitive JS Sinks** lab to the course website.

## What you get
- A hub page: `xss/xssdemo/sinks/primitive/index.html`
- 3 categories of primitive sinks:
  - **DOM execution** (HTML parsing, event handlers, DOM builders, script text)
  - **URL execution** (navigation + resource loading)
  - **JS execution** (string → code)
- Each sink has its own demo page with:
  - multiple input fields (quiz-style),
  - a short “find the source → reach the sink” puzzle,
  - a suggested payload that triggers `alert(1)`,
  - a link to the exact JS file students should read.

## How to run
Most demos work from `file://`, but for the **bonus** service worker demo you must serve the site from:
- `https://...` OR
- `http://localhost`

Recommended (from repository root):
```bash
python3 -m http.server 8000
```
Then browse:
- `http://localhost:8000/xss/xssdemo/sinks/primitive/index.html`

## Teaching plan (suggested)
### 1) Warmup: DOM execution
1. `element.innerHTML`
2. `setAttribute('onclick', ...)`
3. `createContextualFragment` or `DOMParser`

Key message:
- HTML parsing sinks turn **strings** into **live DOM**.
- The sink is where parsing happens; the bug is “attacker controls the string”.

### 2) URL execution
1. `location.href`
2. `script.src`

Key message:
- A URL sink can become code execution via `javascript:`/`data:`/loading scripts.

### 3) JS execution
1. `eval`
2. `setTimeout(string)`

Key message:
- Pure “string → code” sinks are the most direct.

## How to teach "source tracing"
For each page:
1. Tell students to open DevTools → **Sources**
2. Open the linked JS file
3. Search for the **sink string** (e.g., `innerHTML`, `setAttribute(`, `location.href`, `eval(`)
4. Walk **backwards** to find the variable feeding it
5. Keep walking back until you find the **source** (one of the form fields)

Tip:
- Students should avoid brute forcing all fields.
- The debug box will show which field was used **after** they run it.

## Notes / gotchas
- Some browsers restrict `javascript:` in some navigation contexts. If a demo seems blocked, use the provided `data:` payload instead.
- Pop-up blockers may block `window.open()` unless allowed.
- `element.onclick = "alert(1)"` is legacy behavior; if it doesn't fire in a specific environment, use the `setAttribute('onclick', ...)` demo.



/*
  "Evil" Service Worker demo script (for classroom purposes only).
  This file lives in the project so the URL can be same-origin.
*/

self.addEventListener("install", (event) => {
  // Take over quickly.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", async (event) => {
  // Reply to the page that registered us.
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for(const c of clients){
    c.postMessage("alert(1)");
  }
});

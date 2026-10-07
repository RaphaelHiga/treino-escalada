// Service worker do Diário de Escalada.
// Guarda uma cópia do app no aparelho para ele abrir sem internet.
// Com internet boa, busca a versão mais nova. Se a rede demorar (sinal fraco no ginásio),
// abre na hora com a cópia guardada e atualiza em segundo plano para a próxima vez.
// Se você publicar uma atualização, aumente o número em CACHE (v56 -> v57).
// As fontes ficam no próprio app e entram aqui: o app abre com a fonte certa mesmo sem sinal.
const CACHE = "diario-escalada-app-v60";
const ARQUIVOS = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png",
  "fontes/archivo.woff2", "fontes/bebas-neue.woff2"];
const ESPERA_MS = 2500;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  // Arquivos do app: rede primeiro, mas sem esperar mais que ESPERA_MS se já houver cópia.
  const daRede = fetch(req).then((res) => {
    if (res && res.ok) { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
    return res;
  });
  e.waitUntil(daRede.catch(() => {}));
  e.respondWith(
    caches.match(req).then((guardado) => {
      const reserva = () => guardado || caches.match("index.html");
      if (!guardado) return daRede.catch(reserva);
      const tempo = new Promise((ok) => setTimeout(() => ok(guardado), ESPERA_MS));
      return Promise.race([daRede.catch(reserva), tempo]);
    })
  );
});

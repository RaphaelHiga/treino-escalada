/*
  Mascote Frango -> Máquina
  Uso:
    1) No HTML:  <div id="mascote"></div>
                 <script src="mascote.js"></script>
    2) Depois de calcular as métricas:
                 Mascote.atualizar(dedosPct, barraPct);
       dedosPct = carga total do max hang / peso corporal * 100
       barraPct = carga total da barra (1RM) / peso corporal * 100
*/
(function () {
  const CONFIG = {
    container: "#mascote",
    corteDedos: 120, // % do peso corporal
    corteBarra: 135, // % do peso corporal
    chave: "mascote-fase" // onde o app lembra a última fase
  };

  const CSS = `
  .msc{max-width:360px;margin:0 auto;font-family:inherit;text-align:center}
  .msc svg{width:100%;height:auto;display:block}
  .msc .st{opacity:0;transform-box:fill-box;transform-origin:50% 100%}
  .msc .st.on{opacity:1}
  .msc .st.pop{animation:msc-pop .7s cubic-bezier(.3,1.7,.5,1)}
  @keyframes msc-pop{0%{transform:scale(.2) rotate(-8deg)}100%{transform:scale(1) rotate(0)}}
  .msc .burst{transform-box:fill-box;transform-origin:center;opacity:0}
  .msc .burst.go{animation:msc-burst .7s ease-out}
  @keyframes msc-burst{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.6)}}
  .msc .blink{transform-box:fill-box;transform-origin:center;animation:msc-blink 3s infinite}
  @keyframes msc-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
  .msc .shake{animation:msc-shake .12s linear infinite}
  @keyframes msc-shake{0%,100%{transform:translateX(-1.5px)}50%{transform:translateX(1.5px)}}
  .msc .drip{animation:msc-drip 1.4s ease-in infinite}
  @keyframes msc-drip{0%{transform:translateY(0);opacity:1}100%{transform:translateY(40px);opacity:0}}
  .msc .xl{transform-box:fill-box;transform-origin:100% 100%;animation:msc-xl .7s ease-in-out infinite alternate}
  @keyframes msc-xl{to{transform:rotate(16deg)}}
  .msc .xr{transform-box:fill-box;transform-origin:0% 100%;animation:msc-xr .7s ease-in-out infinite alternate}
  @keyframes msc-xr{to{transform:rotate(-16deg)}}
  .msc-nome{font-size:1.25rem;font-weight:600;margin-top:.25rem}
  .msc-msg{font-size:.9rem;opacity:.75;min-height:1.4em}
  .msc-barra{height:8px;border-radius:999px;background:rgba(127,127,127,.2);margin:.6rem 0;overflow:hidden}
  .msc-barra div{height:100%;width:0;background:#FFD23F;transition:width .4s}
  @media (prefers-reduced-motion:reduce){.msc *{animation:none!important}}
  `;

  const SVG = `
<svg viewBox="0 0 380 260" role="img" aria-label="Mascote">
<circle cx="190" cy="132" r="118" fill="#2E4057"/>
<rect x="96" y="60" width="8" height="8" rx="2" fill="#FFD23F" transform="rotate(20 100 64)"/><rect x="282" y="74" width="8" height="8" rx="2" fill="#E84855" transform="rotate(-15 286 78)"/><rect x="100" y="196" width="8" height="8" rx="2" fill="#3BB273"/><rect x="276" y="186" width="8" height="8" rx="2" fill="#7768AE" transform="rotate(30 280 190)"/><circle cx="130" cy="40" r="4" fill="#F9A03F"/><circle cx="250" cy="36" r="4" fill="#3BB273"/>
<ellipse cx="190" cy="236" rx="56" ry="8" fill="#1F2A38" opacity=".6"/>
<circle class="burst" cx="190" cy="150" r="80" fill="none" stroke="#FFD23F" stroke-width="10" stroke-dasharray="6 14"/>
<g class="st" data-fase="0"><g class="shake">
<path d="M180 220 l-4 14 M200 220 l4 14 M168 234 h14 M198 234 h14" stroke="#FF8C1A" stroke-width="4" stroke-linecap="round"/>
<path d="M158 170 q-18 16 -6 36 q10 -6 10 -22z" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="3.5" stroke-linejoin="round"/>
<path d="M222 170 q18 16 6 36 q-10 -6 -10 -22z" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="3.5" stroke-linejoin="round"/>
<ellipse cx="190" cy="184" rx="34" ry="40" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="4"/>
<rect x="184" y="120" width="13" height="30" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="3.5"/>
<path d="M180 92 q-2 -14 8 -12 q2 -10 11 -4 q8 -4 8 8z" fill="#E84855" stroke="#2B2B2B" stroke-width="3" stroke-linejoin="round"/>
<circle cx="192" cy="110" r="25" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="4"/>
<g class="blink"><circle cx="184" cy="106" r="11" fill="#fff" stroke="#2B2B2B" stroke-width="3"/><circle cx="202" cy="106" r="11" fill="#fff" stroke="#2B2B2B" stroke-width="3"/><circle cx="184" cy="109" r="4" fill="#2B2B2B"/><circle cx="202" cy="109" r="4" fill="#2B2B2B"/></g>
<path d="M176 94 l10 -3 M208 91 l-10 -3" stroke="#2B2B2B" stroke-width="3" stroke-linecap="round"/>
<path d="M186 116 l7 9 l7 -9z" fill="#FF8C1A" stroke="#2B2B2B" stroke-width="3" stroke-linejoin="round"/>
<path d="M183 131 q4 -3 8 0 q4 3 8 0" fill="none" stroke="#2B2B2B" stroke-width="2.5" stroke-linecap="round"/>
<path class="drip" d="M222 88 q-5 8 0 11 q5 -3 0 -11z" fill="#7EC8E3"/>
<path d="M170 226 l-8 -2 M214 226 l8 -2" stroke="#FFD23F" stroke-width="2.5" stroke-linecap="round"/>
</g></g>
<g class="st" data-fase="1">
<path d="M170 222 l-4 12 M210 222 l4 12 M156 234 h18 M206 234 h18" stroke="#FF8C1A" stroke-width="7" stroke-linecap="round"/>
<g class="xl"><path d="M146 176 q-32 0 -36 -36" stroke="#2B2B2B" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M146 176 q-32 0 -36 -36" stroke="#F7F4EC" stroke-width="13" stroke-linecap="round" fill="none"/><circle cx="122" cy="160" r="14" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="3.5"/><circle cx="110" cy="136" r="11" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="3.5"/></g>
<g class="xr"><path d="M234 176 q32 0 36 -36" stroke="#2B2B2B" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M234 176 q32 0 36 -36" stroke="#F7F4EC" stroke-width="13" stroke-linecap="round" fill="none"/><circle cx="258" cy="160" r="14" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="3.5"/><circle cx="270" cy="136" r="11" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="3.5"/></g>
<ellipse cx="190" cy="184" rx="58" ry="46" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="4"/>
<path d="M168 172 q22 16 44 0" fill="none" stroke="#2B2B2B" stroke-width="3" stroke-linecap="round"/>
<path d="M174 80 q-4 -20 10 -18 q4 -14 16 -6 q12 -8 14 8 q12 2 4 16z" fill="#E84855" stroke="#2B2B2B" stroke-width="3.5" stroke-linejoin="round"/>
<circle cx="194" cy="112" r="30" fill="#F7F4EC" stroke="#2B2B2B" stroke-width="4"/>
<rect x="165" y="92" width="58" height="10" rx="3" fill="#3BB273" stroke="#2B2B2B" stroke-width="3"/>
<path d="M166 97 l-16 -6 l4 12z" fill="#3BB273" stroke="#2B2B2B" stroke-width="3" stroke-linejoin="round"/>
<g class="blink"><circle cx="184" cy="114" r="10" fill="#fff" stroke="#2B2B2B" stroke-width="3"/><circle cx="206" cy="114" r="10" fill="#fff" stroke="#2B2B2B" stroke-width="3"/><circle cx="186" cy="115" r="4.5" fill="#2B2B2B"/><circle cx="208" cy="115" r="4.5" fill="#2B2B2B"/></g>
<path d="M174 106 l14 4 M216 106 l-12 4" stroke="#2B2B2B" stroke-width="3.5" stroke-linecap="round"/>
<path d="M184 128 h20 l-10 12z" fill="#FF8C1A" stroke="#2B2B2B" stroke-width="3" stroke-linejoin="round"/>
<path d="M186 128 h16" stroke="#fff" stroke-width="2"/>
<circle cx="276" cy="92" r="5" fill="#fff" opacity=".85"/><circle cx="288" cy="104" r="3.5" fill="#fff" opacity=".7"/><circle cx="104" cy="92" r="4" fill="#fff" opacity=".7"/>
</g>
</svg>`;

  let raiz = null;

  function montar() {
    raiz = document.querySelector(CONFIG.container);
    if (!raiz) return false;
    if (!document.getElementById("msc-css")) {
      const s = document.createElement("style");
      s.id = "msc-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
    raiz.classList.add("msc");
    raiz.innerHTML = SVG +
      '<div class="msc-nome"></div><div class="msc-msg"></div>' +
      '<div class="msc-barra"><div></div></div>';
    return true;
  }

  function lerFase() {
    try { const v = localStorage.getItem(CONFIG.chave); return v === null ? null : +v; }
    catch (e) { return null; }
  }
  function salvarFase(f) {
    try { localStorage.setItem(CONFIG.chave, String(f)); } catch (e) {}
  }

  function mostrar(fase, animar) {
    raiz.querySelectorAll(".st").forEach(g => {
      g.classList.remove("on", "pop");
      if (+g.dataset.fase === fase) {
        g.classList.add("on");
        if (animar) { void g.getBBox(); g.classList.add("pop"); }
      }
    });
    if (animar) {
      const b = raiz.querySelector(".burst");
      b.classList.remove("go"); void b.getBBox(); b.classList.add("go");
    }
    raiz.querySelector(".msc-nome").textContent = fase ? "Máquina" : "Frango";
  }

  function atualizar(dedosPct, barraPct) {
    if (!raiz && !montar()) return;
    const sd = dedosPct / CONFIG.corteDedos;
    const sb = barraPct / CONFIG.corteBarra;
    const media = (sd + sb) / 2;
    const fase = media >= 1 ? 1 : 0;

    raiz.querySelector(".msc-barra div").style.width = Math.min(100, media * 100) + "%";
    raiz.querySelector(".msc-msg").textContent = fase
      ? "Modo máquina ligado. Agora é não deixar enferrujar."
      : sd <= sb
        ? "Ponto fraco: dedos. Meta: " + CONFIG.corteDedos + "%."
        : "Ponto fraco: barra. Meta: " + CONFIG.corteBarra + "%.";

    const anterior = lerFase();
    const mudou = anterior !== null && anterior !== fase;
    mostrar(fase, mudou);
    salvarFase(fase);
    return { fase, media, dedos: sd, barra: sb };
  }

  window.Mascote = { atualizar, config: CONFIG };
})();

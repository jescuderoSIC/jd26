/* Plantillas del blog claude-clon-substack.
   Las usa editor.html para generar posts/<slug>.html e index.html.
   Funcionan también en Node (module.exports) para regenerar desde la terminal. */
(function (root) {
  'use strict';

  var FONTS =
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;0,7..72,700;1,7..72,400&display=swap" rel="stylesheet">';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function slugify(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '') || 'entrada';
  }
  function fecha(iso) {
    if (!iso) return '';
    try {
      return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
        .format(new Date(iso)).replace(/\./g, '');
    } catch (e) { return String(iso).slice(0, 10); }
  }
  function palabras(html) {
    var t = String(html || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
    return (t.match(/[\p{L}\p{N}]+/gu) || []).length;
  }
  function minutos(n) { return Math.max(1, Math.round(n / 230)); }
  // Color por defecto: terracota oscura de la paleta del jardín (legible sobre crema)
  var COLOR_DEFECTO = '#B4513A';
  function color(blog) { return /^#[0-9a-f]{6}$/i.test(blog && blog.color || '') ? blog.color : COLOR_DEFECTO; }
  function inicial(nombre) { return (String(nombre || '?').trim().charAt(0) || '?').toUpperCase(); }

  // rutas guardadas relativas a la raíz del blog ("imagenes/x.jpg") -> relativas a la página
  function ruta(src, raiz) { return /^imagenes\//.test(src || '') ? raiz + src : src; }

  /* ===== Bloques de código =====
     En el editor se guardan como <pre data-lang="javascript">…</pre>; al publicar se convierten en
     <div class="codigo"> con cabecera (lenguaje + botón Copiar) y <code class="language-…"> para highlight.js. */
  var LENGUAJES = [
    ['', 'Automático'], ['html', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'], ['typescript', 'TypeScript'],
    ['json', 'JSON'], ['python', 'Python'], ['php', 'PHP'], ['sql', 'SQL'], ['bash', 'Terminal (bash)'],
    ['java', 'Java'], ['c', 'C'], ['cpp', 'C++'], ['csharp', 'C#'], ['xml', 'XML'], ['markdown', 'Markdown'],
    ['yaml', 'YAML'], ['plaintext', 'Texto sin formato']
  ];
  var ALIAS = { js: 'JavaScript', ts: 'TypeScript', py: 'Python', sh: 'Terminal', shell: 'Terminal', md: 'Markdown', yml: 'YAML', text: 'Texto', txt: 'Texto', plaintext: 'Texto' };
  function nombreLenguaje(id) {
    if (!id) return '';
    if (ALIAS[id]) return ALIAS[id];
    for (var i = 0; i < LENGUAJES.length; i++) if (LENGUAJES[i][0] === id) return LENGUAJES[i][1];
    return id;
  }
  function limpiaLenguaje(id) { id = String(id || '').toLowerCase(); return /^[a-z0-9+#._-]{1,24}$/.test(id) ? id : ''; }

  /* ===== HTML incrustado (artefactos) =====
     Se guarda como <figure class="html[ ancho]"[ data-alto="600"] data-html="BASE64"></figure>.
     Al publicar se muestra en un iframe aislado (sandbox sin allow-same-origin): sus estilos y scripts
     no tocan la página del blog. Un pequeño script dentro del marco avisa de su altura. */
  var SANDBOX = 'allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals allow-downloads';
  function b64enc(s) {
    var b = new TextEncoder().encode(String(s || '')), t = '';
    for (var i = 0; i < b.length; i += 8192) t += String.fromCharCode.apply(null, b.subarray(i, i + 8192));
    return btoa(t);
  }
  function b64dec(s) {
    try {
      var t = atob(String(s || '')), b = new Uint8Array(t.length);
      for (var i = 0; i < t.length; i++) b[i] = t.charCodeAt(i);
      return new TextDecoder().decode(b);
    } catch (e) { return ''; }
  }
  var ALTO_JS =
    '<script data-jd26-alto>(function(){var u=-1;function e(){var d=document.documentElement,b=document.body;if(!d)return;' +
    'var h=Math.ceil(d.scrollHeight);if(b)h=Math.max(h,Math.ceil(b.getBoundingClientRect().bottom+(parseFloat(getComputedStyle(b).marginBottom)||0)));' +
    'if(h!==u){u=h;try{parent.postMessage({jd26alto:h},"*")}catch(x){}}}' +
    'addEventListener("load",e);if(document.readyState!=="loading")e();else document.addEventListener("DOMContentLoaded",e);' +
    'if(window.ResizeObserver)try{var r=new ResizeObserver(e);r.observe(document.documentElement);if(document.body)r.observe(document.body)}catch(x){}' +
    'setTimeout(e,500);setTimeout(e,2000)})();</script>';
  function srcdoc(code) {
    code = String(code || '');
    var i = code.toLowerCase().lastIndexOf('</body>');
    return i >= 0 ? code.slice(0, i) + ALTO_JS + code.slice(i) : code + ALTO_JS;
  }
  function sinAlto(s) { return String(s || '').replace(/<script data-jd26-alto>[\s\S]*?<\/script>/g, ''); }

  function cuerpo(html, raiz) {
    return String(html || '')
      .replace(/(<img\b[^>]*?\bsrc=")(imagenes\/)/g, '$1' + raiz + '$2')
      .replace(/<pre( data-lang="([^"]*)")?>([\s\S]*?)<\/pre>/g, function (m, a, lang, inner) {
        lang = limpiaLenguaje(lang);
        var texto = inner.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
        return '<div class="codigo"><div class="codigo-cab"><span>' + esc(nombreLenguaje(lang) || 'Código') + '</span>' +
          '<button type="button" class="copiar">Copiar</button></div>' +
          '<pre><code' + (lang ? ' class="language-' + lang + '"' : '') + '>' + texto + '</code></pre></div>';
      })
      .replace(/<figure class="html( ancho)?"(?: data-alto="(\d+)")? data-html="([A-Za-z0-9+/=]*)"><\/figure>/g, function (m, ancho, alto, b64) {
        return '<figure class="html' + (ancho || '') + '"' + (alto ? ' data-alto="' + alto + '"' : '') + '>' +
          '<iframe class="incrustado" title="Contenido incrustado" loading="lazy" sandbox="' + SANDBOX + '"' +
          (alto ? ' data-fijo style="height:' + alto + 'px"' : '') + ' srcdoc="' + esc(srcdoc(b64dec(b64))) + '"></iframe></figure>';
      })
      .replace(/<figure class="video" data-youtube="([\w-]{11})"[^>]*>[\s\S]*?<\/figure>/g, function (m, id) {
        return '<figure class="video"><div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + id +
          '" title="Vídeo de YouTube" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></figure>';
      });
  }

  /* ===== Tema claro / oscuro =====
     TEMA_HEAD va en <head> para aplicar el tema guardado antes de pintar (sin parpadeo).
     TEMA_BOTON + TEMA_JS ponen el botón sol/luna. La elección se guarda en
     localStorage ('jd26.tema'); sin elección, manda la preferencia del sistema. */
  var TEMA_HEAD =
    '<script>try{var t=localStorage.getItem("jd26.tema");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>\n';
  var TEMA_BOTON =
    '<button type="button" class="tema" id="temaBtn" aria-label="Cambiar a modo oscuro" title="Cambiar a modo oscuro">' +
    '<svg class="luna" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    '<svg class="sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
    '</button>\n';
  var TEMA_JS =
    '<script>(function(){var b=document.getElementById("temaBtn");if(!b)return;var r=document.documentElement,mq=matchMedia("(prefers-color-scheme: dark)");' +
    'function actual(){return r.getAttribute("data-theme")||(mq.matches?"dark":"light")}' +
    'function pintar(){var m=actual(),t=m==="dark"?"Cambiar a modo claro":"Cambiar a modo oscuro";b.setAttribute("data-modo",m);b.setAttribute("aria-label",t);b.title=t}' +
    'b.addEventListener("click",function(){var n=actual()==="dark"?"light":"dark";r.setAttribute("data-theme",n);try{localStorage.setItem("jd26.tema",n)}catch(e){}pintar()});' +
    'mq.addEventListener("change",pintar);pintar()})();</script>\n';
  var CSS_TEMA =
    '.tema{position:absolute;top:10px;right:12px;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--bg);color:var(--muted);display:grid;place-items:center;cursor:pointer;z-index:5}\n' +
    '.tema:hover{color:var(--accent);border-color:var(--accent)}\n' +
    '.tema:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n' +
    '.tema svg{width:18px;height:18px}\n' +
    '.tema[data-modo="dark"] .luna,.tema:not([data-modo="dark"]) .sol{display:none}\n';

  /* Paleta del jardín jd26: crema #F4F1DE · terracota #E07A5F · pizarra #3D405B · salvia #81B29A · arena #F2CC8F
     El acento (color del blog) se aclara mezclándolo con crema en modo oscuro. */
  function css(acc) {
    // --h-*: colores del resaltado de código (highlight.js)
    var oscuro = '--bg:#22243A;--ink:#F4F1DE;--muted:#B5B3A3;--line:#3A3D57;--accent:color-mix(in srgb,' + acc + ' 62%,#F4F1DE);--soft:color-mix(in srgb,var(--accent) 14%,transparent);' +
      '--h-com:#8F8D82;--h-kw:#E8957E;--h-str:#9CCBB2;--h-num:#F2CC8F;--h-fn:#9DB4E8;--h-attr:#CDA8E6;--h-del:#F08A73;color-scheme:dark';
    return ':root{--bg:#FFFDF6;--ink:#2A2C40;--muted:#64667A;--line:#E4DEC6;--accent:' + acc + ';--soft:color-mix(in srgb,var(--accent) 9%,transparent);' +
      '--h-com:#7D7B6E;--h-kw:#A8432E;--h-str:#2F6E50;--h-num:#8A520F;--h-fn:#2F5596;--h-attr:#7A3E96;--h-del:#B23A22;color-scheme:light}\n' +
      '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){' + oscuro + '}}\n' +
      ':root[data-theme="dark"]{' + oscuro + '}\n' +
      '*,*::before,*::after{box-sizing:border-box}\n' +
      'body{margin:0;background:var(--bg);color:var(--ink);font-family:Literata,Georgia,serif;-webkit-font-smoothing:antialiased}\n' +
      'a{color:inherit}\n' +
      '.wrap{max-width:680px;margin:0 auto;padding:0 16px}\n' +
      '.ui{font-family:"Bricolage Grotesque",system-ui,-apple-system,"Segoe UI",sans-serif}\n' +
      '.top{border-bottom:1px solid var(--line);padding:14px 0;text-align:center}\n' +
      '.top a{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-weight:700;font-size:1.05rem;text-decoration:none;letter-spacing:-.01em}\n' +
      '.top a:hover{color:var(--accent)}\n' +
      '.avatar{width:38px;height:38px;border-radius:50%;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-family:"Bricolage Grotesque",system-ui,sans-serif;font-weight:700;flex:none}\n' +
      'footer.pie{border-top:1px solid var(--line);margin-top:56px;padding:28px 0 48px;text-align:center;color:var(--muted);font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:.86rem;line-height:1.6}\n' +
      'footer.pie a{color:var(--muted);text-underline-offset:3px}\n' +
      'footer.pie a:hover{color:var(--accent)}\n' +
      CSS_TEMA;
  }

  /* ===== Índice lateral (rayas) =====
     Una raya por cada h2/h3 del cuerpo; al pasar el ratón se despliegan los títulos.
     Solo en pantallas anchas y si la entrada tiene al menos 3 títulos. */
  var CSS_INDICE =
    '.cuerpo h2,.cuerpo h3{scroll-margin-top:24px}\n' +
    '@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}\n' +
    '.indice{position:fixed;left:20px;top:50%;transform:translateY(-50%);z-index:4;display:none}\n' +
    '@media (min-width:1000px){.indice{display:block}}\n' +
    '.indice ol{list-style:none;margin:0;padding:10px 8px;max-height:72vh;overflow-y:auto;scrollbar-width:thin;border:1px solid transparent;border-radius:10px;transition:background-color .18s,border-color .18s,box-shadow .18s}\n' +
    '.indice a{display:flex;align-items:center;gap:12px;padding:5px 4px;text-decoration:none;color:var(--muted);font-size:.86rem;line-height:1.3}\n' +
    '.indice .raya{flex:none;position:relative;width:24px;height:2px}\n' +
    '.indice .raya::before{content:"";position:absolute;left:0;top:0;width:16px;height:2px;border-radius:2px;background:currentColor;opacity:.45;transition:width .18s,opacity .18s}\n' +
    '.indice .n3 .raya::before{width:9px}\n' +
    '.indice .texto{max-width:0;opacity:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;transition:max-width .18s,opacity .18s}\n' +
    '.indice .n3 .texto{padding-left:12px}\n' +
    '.indice:hover ol,.indice:focus-within ol{background:var(--bg);border-color:var(--line);box-shadow:0 10px 30px rgba(0,0,0,.12)}\n' +
    '.indice:hover .texto,.indice:focus-within .texto{max-width:250px;opacity:1}\n' +
    '.indice a:hover{color:var(--ink)}\n' +
    '.indice a:hover .raya::before{opacity:.9}\n' +
    '.indice a[aria-current]{color:var(--accent)}\n' +
    '.indice a[aria-current] .raya::before{width:24px;opacity:1}\n' +
    '.indice .n3[aria-current] .raya::before{width:16px}\n' +
    '.indice a:focus-visible{outline:2px solid var(--accent);outline-offset:1px;border-radius:4px}\n' +
    '@media print{.indice{display:none}}\n';
  var INDICE_JS =
    '<script>(function(){\n' +
    'var hs=document.querySelectorAll(".cuerpo h2,.cuerpo h3"),usados={},links=[],ol=document.createElement("ol");\n' +
    'Array.prototype.forEach.call(hs,function(h){\n' +
    '  var t=h.textContent.replace(/\\s+/g," ").trim();if(!t)return;\n' +
    '  if(!h.id){var b=t.normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"seccion",id=b,i=2;\n' +
    '    while(usados[id]||document.getElementById(id))id=b+"-"+i++;h.id=id}\n' +
    '  usados[h.id]=1;\n' +
    '  var li=document.createElement("li"),a=document.createElement("a"),r=document.createElement("span"),s=document.createElement("span");\n' +
    '  a.href="#"+encodeURIComponent(h.id);a.className=h.tagName==="H3"?"n3":"n2";\n' +
    '  r.className="raya";r.setAttribute("aria-hidden","true");s.className="texto";s.textContent=t;\n' +
    '  a.appendChild(r);a.appendChild(s);li.appendChild(a);ol.appendChild(li);links.push([h,a]);\n' +
    '});\n' +
    'if(links.length<3)return;\n' +
    'var nav=document.createElement("nav");nav.className="indice ui";nav.setAttribute("aria-label","Índice de la entrada");\n' +
    'nav.appendChild(ol);document.body.appendChild(nav);\n' +
    'var actual=null,pend=false;\n' +
    'function marcar(){pend=false;var y=innerHeight*.3,act=null;\n' +
    '  for(var i=0,n=links.length;i<n;i++){if(links[i][0].getBoundingClientRect().top<=y)act=links[i][1];else break}\n' +
    '  if(act===actual)return;if(actual)actual.removeAttribute("aria-current");\n' +
    '  if(act)act.setAttribute("aria-current","location");actual=act}\n' +
    'function pedir(){if(!pend){pend=true;requestAnimationFrame(marcar)}}\n' +
    'addEventListener("scroll",pedir,{passive:true});addEventListener("resize",pedir);marcar();\n' +
    '})();</script>\n';

  var CSS_CODIGO =
    '.cuerpo .codigo{margin:0 0 1.4em;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:color-mix(in srgb,var(--ink) 4%,var(--bg))}\n' +
    '.codigo-cab{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 6px 5px 14px;border-bottom:1px solid var(--line);font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:.78rem;color:var(--muted);letter-spacing:.02em}\n' +
    '.copiar{border:1px solid var(--line);background:var(--bg);color:var(--muted);border-radius:6px;padding:3px 10px;font:inherit;cursor:pointer}\n' +
    '.copiar:hover{color:var(--accent);border-color:var(--accent)}\n' +
    '.copiar:focus-visible{outline:2px solid var(--accent);outline-offset:1px}\n' +
    '.cuerpo .codigo pre{margin:0;border-radius:0;background:none;white-space:pre;tab-size:4}\n' +
    '.cuerpo .codigo pre code{display:block}\n' +
    '.hljs-comment,.hljs-quote,.hljs-meta{color:var(--h-com)}\n' +
    '.hljs-comment,.hljs-quote{font-style:italic}\n' +
    '.hljs-keyword,.hljs-selector-tag,.hljs-literal,.hljs-doctag,.hljs-tag,.hljs-name,.hljs-meta .hljs-keyword{color:var(--h-kw)}\n' +
    '.hljs-string,.hljs-regexp,.hljs-addition,.hljs-meta .hljs-string,.hljs-char{color:var(--h-str)}\n' +
    '.hljs-number,.hljs-symbol,.hljs-bullet,.hljs-variable.constant_,.hljs-link{color:var(--h-num)}\n' +
    '.hljs-title,.hljs-title.function_,.hljs-title.class_,.hljs-section{color:var(--h-fn)}\n' +
    '.hljs-attr,.hljs-attribute,.hljs-property,.hljs-built_in,.hljs-type,.hljs-selector-class,.hljs-selector-id,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-template-variable{color:var(--h-attr)}\n' +
    '.hljs-deletion{color:var(--h-del)}\n' +
    '.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}\n';
  var CSS_INCRUSTADO =
    '.cuerpo figure.html{margin:2em 0}\n' +
    '.cuerpo figure.html iframe{display:block;width:100%;height:200px;border:1px solid var(--line);border-radius:8px;background:#fff}\n' +
    '.cuerpo figure.html.ancho{width:min(1100px,calc(100vw - 32px));position:relative;left:50%;transform:translateX(-50%)}\n';
  var CODIGO_JS =
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" defer></script>\n' +
    '<script>document.addEventListener("DOMContentLoaded",function(){\n' +
    '// detección automática solo entre los lenguajes habituales (si no, confunde SQL con Visual Basic, etc.)\n' +
    'var AUTO=["xml","css","javascript","typescript","json","python","php","sql","bash","java","c","cpp","csharp","markdown","yaml"];\n' +
    'document.querySelectorAll(".codigo").forEach(function(b){\n' +
    '  var c=b.querySelector("code"),l=b.querySelector(".codigo-cab span"),btn=b.querySelector(".copiar");if(!c)return;\n' +
    '  var txt=c.textContent,m=(c.className.match(/language-(\\S+)/)||[])[1];\n' +
    '  if(window.hljs&&m!=="plaintext"){try{\n' +
    '    if(m&&hljs.getLanguage(m))hljs.highlightElement(c);\n' +
    '    else if(!m){var r=hljs.highlightAuto(txt,AUTO);if(r.relevance>=5){c.innerHTML=r.value;c.classList.add("hljs");var g=hljs.getLanguage(r.language);l.textContent=g&&g.name||r.language}}\n' +
    '  }catch(x){}}\n' +
    '  if(btn)btn.addEventListener("click",function(){\n' +
    '    function ok(){btn.textContent="Copiado";setTimeout(function(){btn.textContent="Copiar"},1600)}\n' +
    '    function viejo(){var a=document.createElement("textarea");a.value=txt;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(x){}a.remove()}\n' +
    '    if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(txt).then(ok,viejo);else viejo();\n' +
    '  });\n' +
    '});\n' +
    '});</script>\n';
  // ajusta la altura de los marcos de HTML incrustado según lo que avisa cada uno
  var INCRUSTADO_JS =
    '<script>addEventListener("message",function(e){var d=e.data;if(!d||typeof d.jd26alto!=="number")return;\n' +
    'var fs=document.querySelectorAll("iframe.incrustado");for(var i=0;i<fs.length;i++){var f=fs[i];if(f.contentWindow!==e.source)continue;\n' +
    '  if(f.hasAttribute("data-fijo"))return;f._n=(f._n||0)+1;if(f._n>60)return;\n' +
    '  var h=Math.max(60,Math.min(6000,Math.ceil(d.jd26alto)));if(Math.abs(f.clientHeight-h)>2)f.style.height=(h+f.offsetHeight-f.clientHeight)+"px";return}\n' +
    '});</script>\n';

  var CSS_POST =
    'h1.titulo{font-size:clamp(1.95rem,5.4vw,2.6rem);line-height:1.15;letter-spacing:-.02em;font-weight:700;margin:44px 0 10px;text-wrap:balance}\n' +
    '.subtitulo{font-size:clamp(1.1rem,3vw,1.3rem);line-height:1.45;color:var(--muted);margin:0 0 24px}\n' +
    '.firma{display:flex;align-items:center;gap:12px;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-size:.88rem;color:var(--muted)}\n' +
    '.firma b{display:block;color:var(--ink);font-weight:500;font-size:.95rem}\n' +
    '.portada{margin:28px 0 0}\n' +
    '.portada img{width:100%;height:auto;display:block;border-radius:4px}\n' +
    '.cuerpo{font-size:1.16rem;line-height:1.75;margin:28px 0 0;overflow-wrap:break-word}\n' +
    '.cuerpo>:first-child,.cuerpo>.bloque-md:first-child>:first-child{margin-top:0}\n' +
    '.cuerpo p{margin:0 0 1.25em}\n' +
    '.cuerpo h2{font-size:1.6rem;line-height:1.25;letter-spacing:-.01em;margin:1.8em 0 .55em}\n' +
    '.cuerpo h3{font-size:1.32rem;line-height:1.3;margin:1.6em 0 .5em}\n' +
    '.cuerpo h4{font-size:1.12rem;line-height:1.35;margin:1.5em 0 .5em}\n' +
    '.cuerpo a{color:var(--accent);text-underline-offset:3px;text-decoration-thickness:1px}\n' +
    '.cuerpo blockquote{margin:1.6em 0;padding:2px 0 2px 22px;border-left:3px solid var(--accent);font-style:italic}\n' +
    '.cuerpo blockquote p:last-child{margin-bottom:0}\n' +
    '.cuerpo ul,.cuerpo ol{margin:0 0 1.25em;padding-left:1.4em}\n' +
    '.cuerpo li{margin:.35em 0}\n' +
    '.cuerpo li p{margin:0}\n' +
    '.cuerpo hr{border:0;height:auto;margin:2.4em 0;text-align:center;overflow:visible}\n' +
    '.cuerpo hr::after{content:"* * *";color:var(--muted);letter-spacing:.5em;font-size:1rem}\n' +
    '.cuerpo figure{margin:2em 0}\n' +
    '.cuerpo img{max-width:100%;height:auto;display:block;margin:0 auto;border-radius:4px}\n' +
    '.cuerpo figcaption{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:.86rem;line-height:1.45;color:var(--muted);text-align:center;margin-top:10px}\n' +
    '.cuerpo code{font-family:ui-monospace,Consolas,"Cascadia Mono",monospace;font-size:.86em;background:var(--soft);padding:.12em .35em;border-radius:4px}\n' +
    '.cuerpo pre{font-family:ui-monospace,Consolas,"Cascadia Mono",monospace;background:var(--soft);padding:14px 16px;border-radius:8px;overflow:auto;font-size:.9rem;line-height:1.55;margin:0 0 1.4em;white-space:pre-wrap}\n' +
    '.cuerpo pre code{background:none;padding:0;font-size:inherit}\n' +
    '.cuerpo .video .frame{position:relative;aspect-ratio:16/9}\n' +
    '.cuerpo .video iframe{position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:4px}\n' +
    '.volver{display:inline-block;margin-top:40px;font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:.92rem;color:var(--accent);text-decoration:none}\n' +
    '.volver:hover{text-decoration:underline}\n' +
    '@media (max-width:560px){.cuerpo{font-size:1.08rem}h1.titulo{margin-top:32px}}\n' +
    CSS_INDICE + CSS_CODIGO + CSS_INCRUSTADO;

  var CSS_INDEX =
    '.cabecera{text-align:center;padding:56px 0 30px;border-bottom:1px solid var(--line)}\n' +
    '.cabecera h1{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:clamp(2rem,6vw,2.8rem);letter-spacing:-.025em;line-height:1.08;margin:0}\n' +
    '.cabecera p{margin:12px auto 0;max-width:52ch;color:var(--muted);font-size:1.06rem;line-height:1.5}\n' +
    '.cabecera .autor{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:.88rem;margin-top:14px}\n' +
    '.lista{list-style:none;margin:0;padding:0}\n' +
    '.lista li{border-bottom:1px solid var(--line)}\n' +
    '.lista a{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;padding:24px 0;text-decoration:none}\n' +
    '.lista h2{font-size:1.28rem;line-height:1.28;margin:0;letter-spacing:-.01em}\n' +
    '.lista a:hover h2{color:var(--accent)}\n' +
    '.lista .sub{margin:6px 0 0;color:var(--muted);font-size:.98rem;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n' +
    '.lista .meta{margin:10px 0 0;font-family:"Bricolage Grotesque",system-ui,sans-serif;font-size:.8rem;color:var(--muted);letter-spacing:.02em;text-transform:uppercase}\n' +
    '.lista img{width:136px;height:92px;object-fit:cover;border-radius:4px;display:block;background:var(--soft)}\n' +
    '.vacio{text-align:center;color:var(--muted);padding:56px 0;font-size:1.05rem}\n' +
    '@media (max-width:560px){.lista img{width:88px;height:66px}.lista h2{font-size:1.12rem}.lista a{gap:14px;padding:20px 0}}\n';

  function head(titulo, desc, acc, extraCss, imagen) {
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>' + esc(titulo) + '</title>\n' +
      (desc ? '<meta name="description" content="' + esc(desc) + '">\n' : '') +
      '<meta property="og:title" content="' + esc(titulo) + '">\n' +
      (desc ? '<meta property="og:description" content="' + esc(desc) + '">\n' : '') +
      (imagen && /^https?:/.test(imagen) ? '<meta property="og:image" content="' + esc(imagen) + '">\n' : '') +
      '<meta name="generator" content="jd26 · claude-clon-substack">\n' +
      TEMA_HEAD +
      FONTS + '\n<style>\n' + css(acc) + extraCss + '</style>\n</head>\n';
  }

  /* p: { id, slug, titulo, subtitulo, portada, autor, fecha, html }
     blog: { nombre, descripcion, autor, color }
     opts.raiz: ruta a la raíz del blog desde la página ('../' por defecto) */
  function post(p, blog, opts) {
    opts = opts || {};
    var raiz = opts.raiz == null ? '../' : opts.raiz;
    var nombreBlog = blog && blog.nombre || 'Mi blog';
    var autor = p.autor || blog && blog.autor || '';
    var n = palabras(p.html);
    var fuente = { v: 1, id: p.id, slug: p.slug, titulo: p.titulo, subtitulo: p.subtitulo || '', portada: p.portada || '', autor: autor, fecha: p.fecha };
    return head(p.titulo + ' — ' + nombreBlog, p.subtitulo, color(blog), CSS_POST, p.portada) +
      '<body>\n' + TEMA_BOTON +
      '<header class="top"><div class="wrap"><a href="' + esc(raiz) + 'index.html">' + esc(nombreBlog) + '</a></div></header>\n' +
      '<main class="wrap">\n<article>\n' +
      '<h1 class="titulo">' + esc(p.titulo) + '</h1>\n' +
      (p.subtitulo ? '<p class="subtitulo">' + esc(p.subtitulo) + '</p>\n' : '') +
      '<div class="firma ui">' + (autor ? '<span class="avatar" aria-hidden="true">' + esc(inicial(autor)) + '</span>' : '') +
        '<span>' + (autor ? '<b>' + esc(autor) + '</b>' : '') + '<time datetime="' + esc(p.fecha || '') + '">' + esc(fecha(p.fecha)) + '</time> · ' + minutos(n) + ' min de lectura</span></div>\n' +
      (p.portada ? '<figure class="portada"><img src="' + esc(ruta(p.portada, raiz)) + '" alt=""></figure>\n' : '') +
      '<div class="cuerpo">\n' + cuerpo(p.html, raiz) + '\n</div>\n' +
      '</article>\n' +
      '<a class="volver" href="' + esc(raiz) + 'index.html">← Todas las entradas de ' + esc(nombreBlog) + '</a>\n' +
      '</main>\n' +
      '<footer class="pie"><div class="wrap">' + esc(nombreBlog) + (autor ? ' · ' + esc(autor) : '') + '</div></footer>\n' +
      '<script type="application/json" id="fuente">' + JSON.stringify(fuente).replace(/</g, '\\u003c') + '</script>\n' +
      TEMA_JS + INDICE_JS +
      (/<pre[ >]/.test(p.html || '') ? CODIGO_JS : '') +
      (/<figure class="html/.test(p.html || '') ? INCRUSTADO_JS : '') +
      '</body>\n</html>\n';
  }

  /* entradas: [{ slug, titulo, subtitulo, portada, autor, fecha, palabras }] ya ordenadas */
  function index(blog, entradas) {
    blog = blog || {};
    var nombre = blog.nombre || 'Mi blog';
    var items = (entradas || []).map(function (e) {
      return '<li><a href="posts/' + esc(e.slug) + '.html"><div>' +
        '<h2>' + esc(e.titulo) + '</h2>' +
        (e.subtitulo ? '<p class="sub">' + esc(e.subtitulo) + '</p>' : '') +
        '<p class="meta">' + esc(fecha(e.fecha)) + (e.autor ? ' · ' + esc(e.autor) : '') + (e.palabras ? ' · ' + minutos(e.palabras) + ' min' : '') + '</p>' +
        '</div>' + (e.portada ? '<img src="' + esc(e.portada) + '" alt="" loading="lazy">' : '') + '</a></li>';
    });
    return head(nombre, blog.descripcion, color(blog), CSS_INDEX) +
      '<body>\n' + TEMA_BOTON + '<main class="wrap">\n' +
      '<header class="cabecera"><h1>' + esc(nombre) + '</h1>' +
        (blog.descripcion ? '<p>' + esc(blog.descripcion) + '</p>' : '') +
        (blog.autor ? '<p class="autor">Por ' + esc(blog.autor) + '</p>' : '') + '</header>\n' +
      (items.length ? '<ul class="lista">\n' + items.join('\n') + '\n</ul>\n' : '<p class="vacio">Todavía no hay entradas publicadas.</p>\n') +
      '</main>\n' +
      '<footer class="pie"><div class="wrap">' + esc(nombre) + ' · <a href="editor.html">Escribir</a> · <a href="instrucciones.html">Cómo funciona</a> · <a href="../index.html">jd26</a></div></footer>\n' +
      TEMA_JS +
      '</body>\n</html>\n';
  }

  var api = {
    post: post, index: index, slugify: slugify, fecha: fecha, palabras: palabras, minutos: minutos, esc: esc,
    LENGUAJES: LENGUAJES, nombreLenguaje: nombreLenguaje, limpiaLenguaje: limpiaLenguaje,
    SANDBOX: SANDBOX, b64enc: b64enc, b64dec: b64dec, srcdoc: srcdoc, sinAlto: sinAlto
  };
  root.Plantillas = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

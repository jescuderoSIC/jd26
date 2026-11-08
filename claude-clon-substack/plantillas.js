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
  function cuerpo(html, raiz) {
    return String(html || '')
      .replace(/(<img\b[^>]*?\bsrc=")(imagenes\/)/g, '$1' + raiz + '$2')
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
    var oscuro = '--bg:#22243A;--ink:#F4F1DE;--muted:#B5B3A3;--line:#3A3D57;--accent:color-mix(in srgb,' + acc + ' 62%,#F4F1DE);--soft:color-mix(in srgb,var(--accent) 14%,transparent);color-scheme:dark';
    return ':root{--bg:#FFFDF6;--ink:#2A2C40;--muted:#64667A;--line:#E4DEC6;--accent:' + acc + ';--soft:color-mix(in srgb,var(--accent) 9%,transparent);color-scheme:light}\n' +
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

  var CSS_POST =
    'h1.titulo{font-size:clamp(1.95rem,5.4vw,2.6rem);line-height:1.15;letter-spacing:-.02em;font-weight:700;margin:44px 0 10px;text-wrap:balance}\n' +
    '.subtitulo{font-size:clamp(1.1rem,3vw,1.3rem);line-height:1.45;color:var(--muted);margin:0 0 24px}\n' +
    '.firma{display:flex;align-items:center;gap:12px;padding:14px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);font-size:.88rem;color:var(--muted)}\n' +
    '.firma b{display:block;color:var(--ink);font-weight:500;font-size:.95rem}\n' +
    '.portada{margin:28px 0 0}\n' +
    '.portada img{width:100%;height:auto;display:block;border-radius:4px}\n' +
    '.cuerpo{font-size:1.16rem;line-height:1.75;margin:28px 0 0;overflow-wrap:break-word}\n' +
    '.cuerpo>:first-child{margin-top:0}\n' +
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
    '@media (max-width:560px){.cuerpo{font-size:1.08rem}h1.titulo{margin-top:32px}}\n';

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
      TEMA_JS +
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

  var api = { post: post, index: index, slugify: slugify, fecha: fecha, palabras: palabras, minutos: minutos, esc: esc };
  root.Plantillas = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

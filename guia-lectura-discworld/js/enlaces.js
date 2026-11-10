// Enlaces de Mundodisco: colección de enlaces por categorías.
// Adaptado de aRtefactoRia-US/ril-enlaces-utiles.html.
// Los datos viven en enlaces/enlaces-mundodisco.json. Con Chrome o Edge se puede «conectar» la carpeta
// enlaces/ y cada cambio se escribe en el archivo; si no, se guarda en el navegador y se descarga el JSON.
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var FOLDER = 'enlaces';                    // subcarpeta de guia-lectura-discworld/
  var FILE = 'enlaces-mundodisco.json';
  var TITULO = 'Enlaces de Mundodisco';
  var LS_DRAFT = 'mundodisco-enlaces.borrador';
  var LS_FILTER = 'mundodisco-enlaces.filtro';
  var IDB = 'mundodisco-enlaces';            // base de datos propia: no se mezcla con otras apps de enlaces
  var NOCAT = '__sin__';
  var canFolder = 'showDirectoryPicker' in window;

  var data = { titulo: TITULO, enlaces: [] };
  var dirty = false;         // cambios aún no escritos en el archivo
  var dir = null;            // carpeta conectada (File System Access)
  var filter = '';           // '' = todas, NOCAT o el nombre de una categoría
  try { filter = localStorage.getItem(LS_FILTER) || ''; } catch (e) { /* sin almacenamiento */ }

  // ---------- utilidades ----------
  var toastTimer, toastAction = null;
  function toast(msg, actionLabel, action, ms) {
    $('toastText').textContent = msg;
    var b = $('toastBtn');
    b.hidden = !actionLabel; b.textContent = actionLabel || ''; toastAction = action || null;
    $('toast').classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { $('toast').classList.remove('show'); }, ms || (action ? 6000 : 3200));
  }
  $('toastBtn').addEventListener('click', function () { if (toastAction) toastAction(); $('toast').classList.remove('show'); });
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function localIso(d) { d = d || new Date(); var o = -d.getTimezoneOffset(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + (o >= 0 ? '+' : '-') + pad(Math.floor(Math.abs(o) / 60)) + ':' + pad(Math.abs(o) % 60); }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
  function favicon(u) { return 'https://www.google.com/s2/favicons?sz=64&domain=' + encodeURIComponent(host(u)); }
  function normUrl(u) {
    u = String(u || '').trim();
    var m = u.match(/https?:\/\/[^\s<>"']+/i); if (m) u = m[0];
    else if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(u)) u = 'https://' + u;
    try { var x = new URL(u); if (!/^https?:$/.test(x.protocol)) return ''; return x.href; } catch (e) { return ''; }
  }
  function sameUrl(a, b) {
    var k = function (u) { try { var x = new URL(u); return (x.hostname.replace(/^www\.|^m\./, '') + x.pathname.replace(/\/$/, '') + x.search).toLowerCase(); } catch (e) { return u; } };
    return k(a) === k(b);
  }
  function ytId(u) {
    try {
      var x = new URL(u);
      if (/(^|\.)youtu\.be$/.test(x.hostname)) return x.pathname.slice(1, 12);
      if (!/(^|\.)youtube\.com$/.test(x.hostname)) return '';
      var v = x.searchParams.get('v'); if (v) return v;
      var m = x.pathname.match(/\/(?:shorts|embed|live|v)\/([\w-]{11})/); return m ? m[1] : '';
    } catch (e) { return ''; }
  }
  function fetchJson(url, ms) {
    var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, ms || 12000);
    return fetch(url, { signal: ctl.signal, cache: 'no-cache' }).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function catOf(e) { return (e.categoria || '').trim(); }
  function catLabel(k) { return k === NOCAT ? 'Sin categoría' : k; }

  // ---------- datos del enlace ----------
  async function readMeta(url) {
    var out = { url: url, titulo: '', descripcion: '', imagen: '', sitio: '', icono: '', autor: '' };
    try {
      var j = await fetchJson('https://api.microlink.io/?url=' + encodeURIComponent(url));
      if (j.status === 'success' && j.data) {
        var d = j.data;
        out.titulo = d.title || ''; out.descripcion = d.description || '';
        out.imagen = d.image && d.image.url || ''; out.icono = d.logo && d.logo.url || '';
        out.sitio = d.publisher || ''; out.autor = d.author || '';
      }
    } catch (e) { /* se prueba con YouTube o se queda lo básico */ }
    var id = ytId(url);
    if (id && (!out.titulo || !out.imagen)) {
      try {
        var o = await fetchJson('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(url));
        out.titulo = out.titulo || o.title || ''; out.autor = out.autor || o.author_name || '';
        out.sitio = out.sitio || 'YouTube';
      } catch (e) { /* sin datos de YouTube */ }
      out.imagen = out.imagen || 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    }
    if (!out.titulo) { var x = new URL(url); out.titulo = host(url) + (x.pathname.length > 1 ? decodeURIComponent(x.pathname).replace(/\/$/, '') : ''); }
    if (!out.sitio) out.sitio = host(url);
    if (!out.icono) out.icono = favicon(url);
    if (id && out.descripcion && out.autor && out.descripcion.indexOf(out.autor) === -1) out.descripcion = out.autor + ' · ' + out.descripcion;
    else if (id && !out.descripcion && out.autor) out.descripcion = out.autor;
    return out;
  }

  // ---------- carpeta y archivo ----------
  function idb(mode, fn) {
    return new Promise(function (res, rej) {
      var r = indexedDB.open(IDB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
      r.onerror = function () { rej(r.error); };
      r.onsuccess = function () {
        var tx = r.result.transaction('kv', mode), st = tx.objectStore('kv'), q = fn(st);
        tx.oncomplete = function () { res(q && q.result); }; tx.onerror = function () { rej(tx.error); };
      };
    });
  }
  function normalize(d) {
    var arr = Array.isArray(d) ? d : d && Array.isArray(d.enlaces) ? d.enlaces : [];
    return {
      titulo: d && !Array.isArray(d) && d.titulo || TITULO,
      enlaces: arr.filter(function (e) { return e && e.url; }).map(function (e) { if (e.categoria == null) e.categoria = ''; return e; })
    };
  }
  // devuelve los datos del disco, o null si el archivo aún no existe; lanza error si el JSON está mal
  async function readDisk(handle) {
    var fh;
    try { fh = await handle.getFileHandle(FILE); } catch (e) { if (e.name === 'NotFoundError') return null; throw e; }
    return normalize(JSON.parse(await (await fh.getFile()).text()));
  }
  async function writeDisk() {
    var fh = await dir.getFileHandle(FILE, { create: true });
    var w = await fh.createWritable();
    await w.write(JSON.stringify(data, null, 2) + '\n');
    await w.close();
  }
  var saving = Promise.resolve();
  function persist() {
    if (dir) {
      saving = saving.then(async function () {
        if (!dirty) return;
        dirty = false;
        try { await writeDisk(); saveDraft(); }
        catch (e) { dirty = true; saveDraft(); toast('No he podido escribir en la carpeta: ' + (e.message || e)); }
        renderStore();
      });
    } else { saveDraft(); renderStore(); }
  }
  // cambios aún no escritos en el archivo: se guardan en el navegador para no perderlos
  function saveDraft() {
    try { if (dirty) localStorage.setItem(LS_DRAFT, JSON.stringify(data, null, 2) + '\n'); else localStorage.removeItem(LS_DRAFT); } catch (e) { /* sin almacenamiento */ }
  }
  function loadDraft() {
    var d = null; try { d = JSON.parse(localStorage.getItem(LS_DRAFT)); } catch (e) { d = null; }
    if (d) { data = normalize(d); dirty = true; return true; }
    return false;
  }

  async function connect(handle, quiet) {
    var disk;
    try { disk = await readDisk(handle); }
    catch (e) { toast('No he podido leer ' + FILE + ': ¿está bien escrito el JSON?', null, null, 8000); return; }
    dir = handle;
    // el borrador del navegador manda sobre lo que haya en disco
    if (!dirty && disk) data = disk;
    if (!disk) dirty = true;
    try { await idb('readwrite', function (st) { return st.put(handle, 'dir'); }); } catch (e) { /* no se recordará */ }
    render();
    if (dirty) persist();
    renderStore();
    if (!quiet) toast('Carpeta conectada: ' + handle.name);
  }
  $('connectBtn').addEventListener('click', async function () {
    try {
      if (pendingHandle) {
        if ((await pendingHandle.requestPermission({ mode: 'readwrite' })) === 'granted') { var h = pendingHandle; pendingHandle = null; await connect(h); return; }
      }
      var handle = await window.showDirectoryPicker({ id: IDB, mode: 'readwrite', startIn: 'documents' });
      if (handle.name !== FOLDER && !confirm('La carpeta se llama «' + handle.name + '», no «' + FOLDER + '». ¿Usarla igualmente?')) return;
      await connect(handle);
    } catch (e) { if (e.name !== 'AbortError') toast('No se ha podido abrir la carpeta: ' + (e.message || e)); }
  });
  $('downloadBtn').addEventListener('click', function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' })); a.download = FILE;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    toast('Copia ' + FILE + ' a la carpeta ' + FOLDER + '. Cuando esté allí, los cambios dejarán de marcarse como pendientes.', 'Ya está', function () { dirty = false; saveDraft(); renderStore(); }, 9000);
  });

  var pendingHandle = null, serverLoaded = false;
  function renderStore() {
    var el = $('store'), msg = $('storeMsg');
    el.classList.toggle('ok', !!dir && !dirty);
    el.classList.toggle('dirty', !dir && dirty);
    $('connectBtn').hidden = !!dir || !canFolder;
    $('connectBtn').textContent = pendingHandle ? 'Reconectar carpeta' : 'Conectar carpeta';
    $('downloadBtn').hidden = !!dir || !dirty;
    if (dir) msg.innerHTML = 'Guardando automáticamente en <b>' + esc(dir.name) + '/' + FILE + '</b>' + (dirty ? ' · escribiendo…' : '.');
    else if (dirty) msg.innerHTML = '<b>Hay cambios guardados solo en este navegador.</b> ' + (canFolder ? 'Conecta la carpeta ' + FOLDER + ' para escribirlos, o descarga el JSON.' : 'Descarga el JSON y cópialo a la carpeta ' + FOLDER + '.');
    else if (pendingHandle) msg.innerHTML = 'Pulsa <b>Reconectar carpeta</b> para dar permiso de nuevo a <b>' + esc(pendingHandle.name) + '</b>.';
    else msg.innerHTML = (serverLoaded ? 'Mostrando los enlaces publicados. ' : '') + (canFolder ? 'Conecta la carpeta <b>guia-lectura-discworld/' + FOLDER + '</b> para que lo que añadas se escriba en el archivo.' : 'Lo que añadas se guarda en este navegador; luego podrás descargar el JSON.');
  }

  // ---------- operaciones ----------
  function find(url) { return data.enlaces.find(function (e) { return sameUrl(e.url, url); }); }
  function touch() { dirty = true; persist(); }
  function cats() {
    var s = {}; data.enlaces.forEach(function (e) { var c = catOf(e); if (c) s[c] = true; });
    return Object.keys(s).sort(function (a, b) { return a.localeCompare(b, 'es', { sensitivity: 'base' }); });
  }

  async function add(raw) {
    var url = normUrl(raw);
    if (!url) { toast('Eso no parece un enlace'); return; }
    var dup = find(url);
    if (dup) {
      toast('Ya lo tienes guardado' + (catOf(dup) ? ' en «' + catOf(dup) + '»' : ''));
      if (filter && filter !== (catOf(dup) || NOCAT)) setFilter('');
      flash(dup.url);
      return;
    }
    var entry = { url: url, titulo: host(url), descripcion: '', imagen: '', sitio: host(url), icono: favicon(url), autor: '', fecha: localIso(), categoria: filter && filter !== NOCAT ? filter : '', nota: '', _loading: true };
    data.enlaces.unshift(entry);
    render(); flash(url);
    var meta = await readMeta(url);
    Object.assign(entry, meta, { url: url }); delete entry._loading;
    touch(); render();
  }
  function flash(url) {
    requestAnimationFrame(function () {
      var c = Array.prototype.find.call(document.querySelectorAll('.card'), function (x) { return x.dataset.url === url; });
      if (c) { c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash'); }
    });
  }
  function locate(card) { return data.enlaces.find(function (x) { return x.url === card.dataset.url; }); }

  // ---------- pintar ----------
  function setFilter(f, silent) {
    filter = f; try { localStorage.setItem(LS_FILTER, f); } catch (e) { /* sin almacenamiento */ }
    if (!silent) render();
  }
  var ICONS = {
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
  };
  function cardHtml(e) {
    var isVideo = !!ytId(e.url) || /vimeo\.com|bilibili\.com/.test(e.url);
    var thumb = e.imagen
      ? '<img src="' + esc(e.imagen) + '" alt="" loading="lazy" referrerpolicy="no-referrer" data-fallback="' + esc(e.icono || favicon(e.url)) + '">'
      : '<span class="noimg"><img src="' + esc(e.icono || favicon(e.url)) + '" alt="" loading="lazy"></span>';
    return '<article class="card' + (e._loading ? ' loading' : '') + '" data-url="' + esc(e.url) + '">' +
      '<span class="thumb">' + thumb + (isVideo && e.imagen ? '<span class="play" aria-hidden="true">' + ICONS.play + '</span>' : '') + '</span>' +
      '<div class="body">' +
        '<a class="title" href="' + esc(e.url) + '" target="_blank" rel="noopener noreferrer">' + esc(e._loading ? 'Leyendo ' + host(e.url) + '…' : e.titulo) + '</a>' +
        (e.descripcion ? '<p class="desc">' + esc(e.descripcion) + '</p>' : '') +
        (e.nota ? '<p class="note">' + esc(e.nota) + '</p>' : '') +
        '<div class="foot"><img src="' + esc(e.icono || favicon(e.url)) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'"><span class="site">' + esc(host(e.url)) + '</span>' +
          '<span class="acts">' +
            '<button class="ibtn" type="button" data-act="edit" title="Editar o cambiar de categoría" aria-label="Editar">' + ICONS.edit + '</button>' +
            '<button class="ibtn" type="button" data-act="del" title="Borrar" aria-label="Borrar">' + ICONS.del + '</button>' +
          '</span></div>' +
      '</div></article>';
  }
  function render() {
    var q = $('q').value.trim().toLowerCase();
    var cs = cats(), groups = {}, total = data.enlaces.length;
    data.enlaces.forEach(function (e) { var k = catOf(e) || NOCAT; (groups[k] = groups[k] || []).push(e); });
    var keys = cs.concat(groups[NOCAT] ? [NOCAT] : []);
    if (filter && !groups[filter]) filter = '';

    // pestañas de categoría (solo si hay alguna categoría)
    var tabs = $('tabs');
    tabs.hidden = !cs.length;
    tabs.innerHTML = cs.length ? ['<button type="button" data-f="" aria-pressed="' + (filter === '') + '">Todas (' + total + ')</button>'].concat(keys.map(function (k) {
      return '<button type="button" data-f="' + esc(k) + '" aria-pressed="' + (filter === k) + '">' + esc(catLabel(k)) + ' (' + groups[k].length + ')</button>';
    })).join('') : '';
    $('catList').innerHTML = cs.map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    var hint = $('hint');
    hint.hidden = !(filter && filter !== NOCAT);
    if (!hint.hidden) hint.innerHTML = 'Lo que pegues ahora irá a la categoría <b>' + esc(filter) + '</b>.';

    var html = [];
    keys.forEach(function (k) {
      if (filter && filter !== k) return;
      var cards = groups[k].filter(function (e) {
        return !q || [e.titulo, e.descripcion, e.nota, e.url, e.autor, e.sitio, e.categoria].join(' ').toLowerCase().indexOf(q) !== -1;
      }).map(cardHtml);
      if (!cards.length) return;
      html.push('<section class="group">' + (cs.length ? '<h2><b>' + esc(catLabel(k)) + '</b>' + cards.length + '</h2>' : '') + cards.join('') + '</section>');
    });
    $('list').innerHTML = html.join('') || '<p class="empty">' + (q ? 'Ningún enlace coincide con «' + esc(q) + '».' : 'Todavía no hay enlaces.<br>Pega uno arriba' + (location.protocol === 'file:' ? ', o abre la página con un servidor local para ver los que ya están en ' + FOLDER + '/' + FILE : '') + '.') + '</p>';
    Array.prototype.forEach.call($('list').querySelectorAll('.thumb img[data-fallback]'), function (img) {
      img.addEventListener('error', function () {
        var span = document.createElement('span'); span.className = 'noimg';
        span.innerHTML = '<img src="' + esc(img.dataset.fallback) + '" alt="">'; img.replaceWith(span);
      }, { once: true });
    });
  }

  // ---------- eventos ----------
  $('adder').addEventListener('submit', function (e) { e.preventDefault(); var v = $('urlIn').value; $('urlIn').value = ''; add(v); });
  document.addEventListener('paste', function (e) {
    var t = (e.target.tagName || '').toLowerCase();
    if (t === 'input' || t === 'textarea' || $('dlg').open) return;
    var text = (e.clipboardData || window.clipboardData).getData('text');
    if (normUrl(text)) { e.preventDefault(); add(text); }
  });
  var veilDepth = 0;
  document.addEventListener('dragenter', function (e) { if (Array.prototype.indexOf.call(e.dataTransfer.types, 'text/uri-list') !== -1 || Array.prototype.indexOf.call(e.dataTransfer.types, 'text/plain') !== -1) { veilDepth++; $('veil').classList.add('show'); } });
  document.addEventListener('dragleave', function () { if (--veilDepth <= 0) { veilDepth = 0; $('veil').classList.remove('show'); } });
  document.addEventListener('dragover', function (e) { e.preventDefault(); });
  document.addEventListener('drop', function (e) {
    e.preventDefault(); veilDepth = 0; $('veil').classList.remove('show');
    var link = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '').split('\n').filter(function (l) { return l && l[0] !== '#'; })[0];
    if (link) add(link);
  });
  $('tabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setFilter(b.dataset.f); });
  $('q').addEventListener('input', render);

  $('list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    e.preventDefault();
    var entry = locate(b.closest('.card')); if (!entry) return;
    if (b.dataset.act === 'del') {
      var i = data.enlaces.indexOf(entry);
      data.enlaces.splice(i, 1); touch(); render();
      toast('Enlace borrado', 'Deshacer', function () { data.enlaces.splice(i, 0, entry); touch(); render(); });
    } else openEdit(entry);
  });

  var editing = null;
  function openEdit(entry) {
    editing = entry;
    $('fTitle').value = entry.titulo || ''; $('fCat').value = entry.categoria || ''; $('fDesc').value = entry.descripcion || '';
    $('fImg').value = entry.imagen || ''; $('fNote').value = entry.nota || ''; $('fUrl').value = entry.url;
    $('dlg').showModal();
  }
  $('dlg').addEventListener('close', function () {
    if ($('dlg').returnValue !== 'ok' || !editing) { editing = null; return; }
    var e = editing, url = normUrl($('fUrl').value) || e.url;
    e.titulo = $('fTitle').value.trim() || e.titulo; e.descripcion = $('fDesc').value.trim();
    e.categoria = $('fCat').value.trim();
    e.imagen = $('fImg').value.trim(); e.nota = $('fNote').value.trim();
    if (url !== e.url) { e.url = url; e.icono = favicon(url); }
    touch(); editing = null; render(); flash(e.url);
  });
  $('fRefetch').addEventListener('click', async function () {
    var url = normUrl($('fUrl').value); if (!url) return;
    this.disabled = true; this.textContent = 'Leyendo…';
    var m = await readMeta(url);
    $('fTitle').value = m.titulo; $('fDesc').value = m.descripcion; $('fImg').value = m.imagen;
    if (editing) editing.icono = m.icono;
    this.disabled = false; this.textContent = 'Volver a leer los datos';
  });

  // ---------- arranque ----------
  async function start() {
    loadDraft();
    // 1) carpeta recordada
    if (canFolder) {
      try {
        var h = await idb('readonly', function (st) { return st.get('dir'); });
        if (h) {
          var perm = await h.queryPermission({ mode: 'readwrite' });
          if (perm === 'granted') { await connect(h, true); if (dir) return; }
          else pendingHandle = h;
        }
      } catch (e) { /* sin IndexedDB o sin carpeta */ }
    }
    // 2) archivo publicado junto a la página
    try {
      var d = await fetchJson(FOLDER + '/' + FILE, 8000);
      if (!dirty) data = normalize(d);
      serverLoaded = true;
    } catch (e) { /* abierta con doble clic o sin archivo todavía */ }
    render(); renderStore();
  }
  setFilter(filter, true);
  start();
})();

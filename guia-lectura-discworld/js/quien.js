// Quién es quién en el Mundodisco: tarjetas cuadradas de personajes y su biografía.
// Usa js/libros.js (DISCWORLD), js/historia.js (colores de saga) y js/personajes.js (MUNDODISCO_PERSONAJES).
(function () {
    const D = window.DISCWORLD;
    const P = window.MUNDODISCO_PERSONAJES;
    const COLORES = Object.assign({ varias: '#6B4E33' }, (window.MUNDODISCO_HISTORIA || {}).coloresSaga);
    const GUIA = 'guia-de-lectura-de-mundodisco.html';
    const libro = new Map(D.libros.map(l => [l.id, l]));
    const porId = new Map(P.personajes.map(p => [p.id, p]));
    const nombreSaga = s => s === 'varias' ? 'Toda la serie' : (D.sagas[s] ? D.sagas[s].nombre : s);
    const color = s => COLORES[s] || '#6B4E33';

    // ---------- Emblemas (100 × 100) ----------
    const C = '#FFF3DC', O = '#2E1B0E', ORO = '#E3A21A', ROJO = '#B23A2B';
    const EMBLEMAS = {
        sombreroMago: `<path d="M50 8 L74 72 L26 72Z"/><ellipse cx="50" cy="74" rx="36" ry="9"/><path fill="${ORO}" d="M50 36l3.5 7.5 8 .7-6 5.4 1.8 8-7.3-4.2-7.3 4.2 1.8-8-6-5.4 8-.7z"/>`,
        sombreroBruja: `<path d="M40 12 Q60 22 64 70 L36 70 Q44 40 40 12Z"/><ellipse cx="50" cy="72" rx="40" ry="9"/><rect x="37" y="61" width="26" height="6" fill="${O}"/>`,
        relojArena: `<path d="M28 12h44M28 88h44" stroke-width="7"/><path d="M33 15 Q33 40 50 50 Q67 40 67 15Z"/><path d="M33 85 Q33 60 50 50 Q67 60 67 85Z"/><path fill="${ORO}" stroke="none" d="M38 82 Q50 66 62 82Z M45 30 Q50 40 55 30Z"/>`,
        placa: `<path d="M50 10 L82 22 Q82 66 50 90 Q18 66 18 22Z"/><circle cx="50" cy="46" r="13" fill="${ORO}"/><path d="M50 37v18M41 46h18" stroke-width="3"/>`,
        sarten: `<circle cx="40" cy="60" r="26"/><circle cx="40" cy="60" r="17" fill="${O}"/><path d="M60 42 L84 16" stroke-width="10" stroke-linecap="round"/>`,
        sobre: `<rect x="14" y="26" width="72" height="50" rx="4"/><path d="M14 28 L50 56 L86 28" fill="none"/><rect x="64" y="32" width="15" height="17" fill="${ROJO}" stroke-width="2"/>`,
        torre: `<path d="M28 88h44v-9h-7l-5-32h7V24h-9v8h-5v-8h-8v8h-5v-8h-9v23h7l-5 32h-7z"/>`,
        jarra: `<path d="M64 40h9a9 9 0 0 1 9 9v12a9 9 0 0 1-9 9h-9" fill="none" stroke-width="8"/><rect x="24" y="32" width="42" height="54" rx="5"/><path fill="${ORO}" d="M24 34 Q22 20 34 22 Q38 12 48 18 Q58 12 64 22 Q72 24 66 34Z"/>`,
        atizador: `<path d="M26 86 L68 22" stroke-width="9" stroke-linecap="round"/><path d="M68 22 L80 26 L76 38" fill="none" stroke-width="7"/><circle cx="24" cy="88" r="8" fill="${ORO}"/>`,
        espada: `<path d="M45 8h10v58H45z M45 8 L50 2 L55 8"/><rect x="28" y="64" width="44" height="9" rx="3" fill="${ORO}"/><rect x="45" y="73" width="10" height="14"/><circle cx="50" cy="91" r="6" fill="${ORO}"/>`,
        luna: `<path d="M64 12 A38 38 0 1 0 64 88 A44 44 0 0 1 64 12Z"/><circle cx="74" cy="30" r="3" fill="${C}"/><circle cx="82" cy="48" r="2" fill="${C}"/>`,
        casco: `<path d="M18 66 Q18 22 50 22 Q82 22 82 66Z"/><rect x="12" y="62" width="76" height="11" rx="4"/><path d="M50 22 V8" stroke-width="7"/><path d="M50 30 V62" fill="none" stroke-width="3"/>`,
        llama: `<path d="M50 8 C72 32 84 52 72 72 C64 88 36 88 28 72 C18 54 32 42 40 28 C42 44 48 48 51 42 C55 32 53 20 50 8Z" fill="${ORO}"/><path d="M50 50 C60 60 60 76 50 80 C40 76 42 62 50 50Z" fill="${C}"/>`,
        roca: `<path d="M18 72 L26 36 L46 20 L72 28 L84 54 L72 80 L38 84Z"/><path d="M46 20 L52 50 L84 54 M52 50 L38 84 M26 36 L52 50" fill="none" stroke-width="2.5"/>`,
        hacha: `<rect x="45" y="12" width="9" height="78" rx="3"/><path d="M54 18 Q90 22 84 58 Q72 46 54 46Z"/><path d="M45 20 Q22 26 24 48 Q34 40 45 40Z"/>`,
        flor: `<g fill="${C}"><circle cx="50" cy="26" r="15"/><circle cx="73" cy="43" r="15"/><circle cx="64" cy="70" r="15"/><circle cx="36" cy="70" r="15"/><circle cx="27" cy="43" r="15"/></g><circle cx="50" cy="50" r="11" fill="${ORO}"/>`,
        nota: `<ellipse cx="34" cy="74" rx="15" ry="11" transform="rotate(-20 34 74)"/><path d="M47 72 V14 Q66 20 74 40" fill="none" stroke-width="7"/><ellipse cx="66" cy="62" rx="10" ry="7" transform="rotate(-20 66 62)" fill="${ORO}"/>`,
        platano: `<path d="M22 22 Q20 76 74 80 Q84 78 80 70 Q38 64 36 20 Q30 14 22 22Z" fill="${ORO}"/><path d="M22 22 L18 14" stroke-width="5"/>`,
        camara: `<rect x="12" y="30" width="76" height="50" rx="7"/><circle cx="50" cy="55" r="16" fill="${O}"/><circle cx="50" cy="55" r="9" fill="#5B8FB0"/><rect x="22" y="20" width="18" height="11" rx="2"/><circle cx="76" cy="40" r="4" fill="${ROJO}"/>`,
        cofre: `<path d="M16 40 Q16 22 50 22 Q84 22 84 40Z"/><rect x="16" y="40" width="68" height="34" rx="3"/><rect x="44" y="36" width="12" height="13" fill="${ORO}"/><path d="M24 74 l-4 12 M36 74 l-2 12 M50 74 v12 M64 74 l2 12 M76 74 l4 12" stroke-width="4"/>`,
        llave: `<circle cx="32" cy="36" r="18"/><circle cx="32" cy="36" r="7" fill="${O}"/><path d="M45 49 L84 88 M68 72 l9 -9 M77 81 l9 -9" stroke-width="8" stroke-linecap="round"/>`,
        escoba: `<path d="M74 10 L42 62" stroke-width="7" stroke-linecap="round"/><path d="M38 56 L16 84 L44 92 L54 64Z" fill="${ORO}"/><path d="M24 82 L44 62 M34 88 L49 66" fill="none" stroke-width="2"/>`,
        guadana: `<path d="M60 92 L46 10" stroke-width="7" stroke-linecap="round"/><path d="M47 16 Q16 10 8 42 Q26 26 50 30Z"/><path d="M50 60 h14" stroke-width="6"/>`,
        baston: `<path d="M50 92 V26" stroke-width="9" stroke-linecap="round"/><path d="M50 26 Q34 22 38 10 Q48 2 58 10 Q64 20 50 26Z" fill="${ORO}"/><circle cx="50" cy="15" r="4" fill="${ROJO}"/>`,
        piramide: `<circle cx="74" cy="26" r="10" fill="${ORO}"/><path d="M48 18 L86 84 L10 84Z"/><path d="M48 18 L56 84" fill="none"/><path d="M30 52h34M20 68h56" fill="none" stroke-width="2"/>`,
        libro: `<path d="M50 28 Q32 16 12 24 V78 Q32 70 50 82 Q68 70 88 78 V24 Q68 16 50 28Z"/><path d="M50 28 V82 M20 36 Q32 32 42 38 M20 48 Q32 44 42 50 M58 38 Q68 32 80 36 M58 50 Q68 44 80 48" fill="none" stroke-width="2.5"/>`,
        tortuga: `<path d="M18 62 Q22 26 52 26 Q82 26 84 62Z"/><path d="M34 62 L40 40 L62 40 L68 62 M51 26 V62" fill="none" stroke-width="2.5"/><circle cx="90" cy="56" r="8"/><path d="M24 62 l-4 12 M42 62 l-2 12 M62 62 l2 12 M78 62 l4 12" stroke-width="7" stroke-linecap="round"/>`,
        estrella: `<path fill="${ORO}" d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38Z"/>`,
        pata: `<ellipse cx="50" cy="66" rx="20" ry="17"/><ellipse cx="24" cy="44" rx="9" ry="12"/><ellipse cx="40" cy="28" rx="9" ry="12"/><ellipse cx="60" cy="28" rx="9" ry="12"/><ellipse cx="76" cy="44" rx="9" ry="12"/>`,
        vela: `<rect x="36" y="38" width="28" height="48" rx="3"/><path d="M50 38 V30" stroke-width="3"/><path fill="${ORO}" d="M50 8 C58 18 60 26 50 32 C40 26 42 18 50 8Z"/><path d="M28 88h44" stroke-width="6"/>`,
        guitarra: `<path d="M58 40 L82 12" stroke-width="8" stroke-linecap="round"/><circle cx="44" cy="62" r="20"/><circle cx="58" cy="46" r="13"/><circle cx="46" cy="60" r="6" fill="${O}"/><path d="M80 10 l6 6" stroke-width="5"/>`,
        corona: `<path d="M14 72 L20 28 L36 50 L50 20 L64 50 L80 28 L86 72Z" fill="${ORO}"/><rect x="14" y="72" width="72" height="12" rx="2" fill="${ORO}"/><circle cx="50" cy="78" r="4" fill="${ROJO}"/><circle cx="30" cy="78" r="3" fill="${ROJO}"/><circle cx="70" cy="78" r="3" fill="${ROJO}"/>`,
        engranaje: `<circle cx="50" cy="50" r="31" fill="none" stroke="${C}" stroke-width="16" stroke-dasharray="11 8.5"/><circle cx="50" cy="50" r="26"/><circle cx="50" cy="50" r="9" fill="${O}"/>`,
        salchicha: `<path d="M12 56 Q50 80 88 56 Q86 72 50 76 Q14 72 12 56Z" fill="${ORO}"/><rect x="16" y="40" width="68" height="18" rx="9" fill="${ROJO}"/><path d="M14 52 Q50 66 86 52" fill="none" stroke="${ORO}" stroke-width="6"/>`,
        pluma: `<path d="M84 10 Q42 18 30 72 L38 74 Q54 38 84 10Z"/><path d="M30 72 L22 90" stroke-width="5" stroke-linecap="round"/><path d="M40 60 Q54 40 74 22" fill="none" stroke-width="2"/>`,
        gato: `<path d="M20 30 L24 8 L42 24 Q50 22 58 24 L76 8 L80 30 Q88 46 80 64 Q70 84 50 84 Q30 84 20 64 Q12 46 20 30Z"/><ellipse cx="38" cy="48" rx="6" ry="8" fill="${ORO}"/><ellipse cx="62" cy="48" rx="6" ry="8" fill="${ORO}"/><path d="M38 44v8M62 44v8" stroke-width="3"/><path d="M46 62 L50 66 L54 62Z" fill="${ROJO}"/>`,
        reloj: `<circle cx="50" cy="52" r="36"/><path d="M50 52 V28 M50 52 L66 62" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="52" r="4" fill="${O}"/><path d="M42 10h16" stroke-width="7"/><path d="M50 12v4" stroke-width="5"/>`,
        balon: `<circle cx="50" cy="50" r="38"/><path fill="${O}" d="M50 36 L63 45 L58 60 L42 60 L37 45Z"/><path d="M50 36 V14 M63 45 L84 38 M58 60 L70 80 M42 60 L30 80 M37 45 L16 38" fill="none" stroke-width="2.5"/>`
    };

    // Retrato cuadrado: imagen propia si existe; si no, sello heráldico con el emblema
    function retrato(p) {
        if (p.imagen) {
            const img = document.createElement('img');
            img.src = p.imagen; img.alt = ''; img.loading = 'lazy';
            img.className = 'retrato';
            return img;
        }
        const c = color(p.saga);
        const wrap = document.createElement('span');
        wrap.className = 'retrato';
        wrap.innerHTML = `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <defs><radialGradient id="g-${p.id}" cx="35%" cy="28%" r="80%">
    <stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/>
  </radialGradient></defs>
  <rect width="100" height="100" fill="${c}"/>
  <g fill="none" stroke="#fff" stroke-opacity=".13" stroke-width="1.2">
    <circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="30"/>
  </g>
  <rect width="100" height="100" fill="url(#g-${p.id})"/>
  <circle cx="50" cy="50" r="33" fill="#000" fill-opacity=".18"/>
  <g transform="translate(20 19) scale(.6)" fill="${C}" stroke="${O}" stroke-width="3.5" stroke-linejoin="round">${EMBLEMAS[p.emblema] || EMBLEMAS.estrella}</g>
  <rect x="4" y="4" width="92" height="92" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" rx="3"/>
</svg>`;
        return wrap;
    }

    // ---------- Estado y filtros ----------
    const rejilla = document.getElementById('rejilla');
    const buscador = document.getElementById('buscador');
    const selLibro = document.getElementById('sel-libro');
    const filtroNivel = document.getElementById('filtro-nivel');
    const resumen = document.getElementById('resumen-libro');
    let nivelActivo = null;

    // Selector de libro, agrupado por saga
    Object.entries(D.sagas).forEach(([clave, s]) => {
        const og = document.createElement('optgroup');
        og.label = s.nombre;
        D.libros.filter(l => l.saga === clave).sort((a, b) => (a.anio || 9999) - (b.anio || 9999)).forEach(l => {
            if (!P.personajes.some(p => papel(p, l.id))) return;
            const o = document.createElement('option');
            o.value = l.id;
            o.textContent = l.titulo + (l.es && l.es !== l.titulo ? ` (${l.es})` : '');
            og.append(o);
        });
        if (og.children.length) selLibro.append(og);
    });

    const botonTodos = boton('Todos', () => { nivelActivo = null; pintar(); });
    const botonesNivel = {};
    Object.entries(P.niveles).forEach(([n, texto]) => {
        botonesNivel[n] = boton(texto, () => { nivelActivo = nivelActivo === n ? null : n; pintar(); });
    });
    function boton(texto, accion) {
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = texto;
        b.addEventListener('click', accion);
        filtroNivel.append(b);
        return b;
    }

    function papel(p, idLibro) {
        if ((p.p || []).includes(idLibro)) return 'p';
        if ((p.s || []).includes(idLibro)) return 's';
        if ((p.a || []).includes(idLibro)) return 'a';
        return null;
    }
    const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    function coincide(p) {
        if (nivelActivo && String(p.importancia) !== nivelActivo) return false;
        const q = normalizar(buscador.value.trim());
        return !q || normalizar(`${p.nombre} ${p.original || ''} ${p.bio} ${nombreSaga(p.saga)}`).includes(q);
    }

    buscador.addEventListener('input', pintar);
    selLibro.addEventListener('change', () => {
        try { history.replaceState(null, '', selLibro.value ? '#libro=' + selLibro.value : location.pathname); } catch (e) { /* file:// */ }
        pintar();
    });

    // ---------- Pintar la rejilla ----------
    function tarjeta(p, rol) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'tarjeta-pj';
        b.style.setProperty('--saga', color(p.saga));
        b.append(retrato(p));
        const pie = document.createElement('span');
        pie.className = 'pj-pie';
        const n = document.createElement('strong'); n.textContent = p.nombre;
        const sub = document.createElement('span'); sub.className = 'pj-sub';
        // si la saga lleva su nombre, mejor decirlo que repetirlo
        sub.textContent = nombreSaga(p.saga) === p.nombre ? 'Protagonista de su saga' : nombreSaga(p.saga);
        pie.append(n, sub);
        b.append(pie);
        if (rol) {
            const r = document.createElement('span');
            r.className = 'pj-rol rol-' + rol;
            r.textContent = P.roles[rol];
            b.append(r);
        }
        b.addEventListener('click', () => abrir(p.id));
        return b;
    }

    let ordenVisible = [];   // para anterior / siguiente en la ficha

    function pintar() {
        botonTodos.setAttribute('aria-pressed', String(!nivelActivo));
        Object.entries(botonesNivel).forEach(([k, b]) => b.setAttribute('aria-pressed', String(nivelActivo === k)));
        rejilla.innerHTML = '';
        ordenVisible = [];
        const idLibro = selLibro.value;
        const grupos = [];

        if (idLibro) {
            const l = libro.get(idLibro);
            resumen.hidden = false;
            resumen.innerHTML = '';
            const t = document.createElement('strong'); t.textContent = l.titulo;
            const a = document.createElement('a'); a.href = `${GUIA}#${l.id}`; a.textContent = 'Ver el resumen del libro →';
            resumen.append('Personajes de ', t, ` (${l.anio || 's. f.'}), por su papel en el libro. `, a);
            ['p', 's', 'a'].forEach(rol => {
                const lista = P.personajes.filter(p => papel(p, idLibro) === rol && coincide(p))
                    .sort((x, y) => x.importancia - y.importancia);
                if (lista.length) grupos.push({ titulo: { p: 'Protagonistas', s: 'Secundarios', a: 'También aparecen' }[rol], lista, rol });
            });
        } else {
            resumen.hidden = true;
            Object.entries(P.niveles).forEach(([n, titulo]) => {
                const lista = P.personajes.filter(p => String(p.importancia) === n && coincide(p));
                if (lista.length) grupos.push({ titulo, lista });
            });
        }

        grupos.forEach(g => {
            const sec = document.createElement('section');
            sec.className = 'grupo-pj';
            const h = document.createElement('h2');
            h.textContent = g.titulo;
            const cuenta = document.createElement('span'); cuenta.textContent = g.lista.length;
            h.append(cuenta);
            const div = document.createElement('div');
            div.className = 'tarjetas-pj';
            g.lista.forEach(p => { div.append(tarjeta(p, g.rol)); ordenVisible.push(p.id); });
            sec.append(h, div);
            rejilla.append(sec);
        });
        if (!grupos.length) {
            const v = document.createElement('p');
            v.className = 'vacio-pj';
            v.textContent = 'Ningún personaje coincide con la búsqueda.';
            rejilla.append(v);
        }
    }

    // ---------- Ficha (diálogo) ----------
    const dlg = document.getElementById('ficha-pj');
    let abierto = null;

    function abrir(id) {
        const p = porId.get(id);
        if (!p) return;
        abierto = id;
        dlg.style.setProperty('--saga', color(p.saga));
        const hueco = document.getElementById('fp-retrato');
        hueco.innerHTML = '';
        hueco.append(retrato(p));
        document.getElementById('fp-saga').textContent = nombreSaga(p.saga) + ' · ' + P.niveles[p.importancia];
        document.getElementById('fp-nombre').textContent = p.nombre;
        const orig = document.getElementById('fp-original');
        orig.textContent = p.original && p.original !== p.nombre ? p.original : '';
        orig.hidden = !orig.textContent;
        document.getElementById('fp-bio').textContent = p.bio;

        const cont = document.getElementById('fp-libros');
        cont.innerHTML = '';
        ['p', 's', 'a'].forEach(rol => {
            const ids = (p[rol] || []).slice().sort((x, y) => ((libro.get(x) || {}).anio || 9999) - ((libro.get(y) || {}).anio || 9999));
            if (!ids.length) return;
            const fila = document.createElement('div');
            fila.className = 'fp-fila';
            const h = document.createElement('h3');
            h.textContent = { p: 'Protagonista en', s: 'Secundario en', a: 'Aparece en' }[rol];
            const ul = document.createElement('ul');
            ul.className = 'fp-chips' + (rol === 'a' && ids.length > 8 ? ' plegado' : '');
            ids.forEach(idL => {
                const l = libro.get(idL);
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `${GUIA}#${idL}`;
                a.textContent = l.titulo;
                a.style.setProperty('--libro', color(l.saga));
                li.append(a);
                ul.append(li);
            });
            fila.append(h, ul);
            if (ul.classList.contains('plegado')) {
                const mas = document.createElement('button');
                mas.type = 'button'; mas.className = 'fp-mas';
                mas.textContent = `Ver los ${ids.length}`;
                mas.addEventListener('click', () => { ul.classList.remove('plegado'); mas.remove(); });
                fila.append(mas);
            }
            cont.append(fila);
        });

        const i = ordenVisible.indexOf(id);
        nav(document.getElementById('fp-anterior'), ordenVisible[i - 1]);
        nav(document.getElementById('fp-siguiente'), ordenVisible[i + 1]);

        if (!dlg.open) dlg.showModal();
        try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// */ }
    }
    function nav(b, id) {
        b.hidden = !id;
        if (!id) return;
        b.querySelector('span').textContent = porId.get(id).nombre;
        b.onclick = () => abrir(id);
    }
    document.getElementById('fp-cerrar').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });   // clic fuera
    dlg.addEventListener('close', () => {
        abierto = null;
        try { history.replaceState(null, '', selLibro.value ? '#libro=' + selLibro.value : location.pathname); } catch (e) { /* file:// */ }
    });
    document.addEventListener('keydown', e => {
        if (!dlg.open) return;
        if (e.key === 'ArrowRight') document.getElementById('fp-siguiente').click();
        if (e.key === 'ArrowLeft') document.getElementById('fp-anterior').click();
    });

    // ---------- Arranque: #vimes abre su ficha; #libro=thud filtra por libro ----------
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash.startsWith('libro=') && libro.has(hash.slice(6))) selLibro.value = hash.slice(6);
    pintar();
    if (porId.has(hash)) abrir(hash);
})();

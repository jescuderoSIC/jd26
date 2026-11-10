// Cronología del Mundodisco: pinta las cuatro secciones a partir de
// js/libros.js (DISCWORLD), js/lugares.js (MUNDODISCO_LUGARES) y js/historia.js (MUNDODISCO_HISTORIA).
(function () {
    const D = window.DISCWORLD;
    const H = window.MUNDODISCO_HISTORIA;
    const L = window.MUNDODISCO_LUGARES;
    const GUIA = 'guia-de-lectura-de-mundodisco.html';
    const MAPA = 'mapa-lugares-de-mundodisco.html';
    const NOVELAS = new Set(['inicio', 'normal', 'juvenil']);
    // «Eric» y «The Last Hero» se publicaron como libros ilustrados, pero cuentan entre las 41 novelas
    const esNovela = l => NOVELAS.has(l.tipo) || l.id === 'eric' || l.id === 'last-hero';
    const libro = new Map(D.libros.map(l => [l.id, l]));
    const color = saga => H.coloresSaga[saga] || '#8A5A2B';

    // Libros leídos: los marca la guía de lectura en este navegador
    let leidos = new Set();
    try { leidos = new Set(JSON.parse(localStorage.getItem('discworld-leidos') || '[]')); } catch (e) { /* sin almacenamiento */ }

    // Lugares en los que aparece cada libro
    const lugaresDe = new Map();
    (L ? L.lugares : []).forEach(lu => lu.libros.forEach(id => {
        if (!lugaresDe.has(id)) lugaresDe.set(id, []);
        lugaresDe.get(id).push(lu);
    }));

    function crear(etiqueta, clase, texto) {
        const n = document.createElement(etiqueta);
        if (clase) n.className = clase;
        if (texto != null) n.textContent = texto;
        return n;
    }
    function enlaceLibro(id, clase) {
        const l = libro.get(id);
        const a = crear('a', clase || 'chip-libro', l ? l.titulo : id);
        a.href = `${GUIA}#${id}`;
        if (l) a.style.setProperty('--saga', color(l.saga));
        return a;
    }

    // ===================== 1. Publicación =====================
    const tl = document.getElementById('tl');
    const filtroSagas = document.getElementById('filtro-sagas');
    const soloNovelas = document.getElementById('solo-novelas');
    const verAutor = document.getElementById('ver-autor');
    let sagaActiva = null;

    const botonesSaga = {};
    const todas = crear('button', null, 'Todas');
    todas.type = 'button';
    todas.addEventListener('click', () => { sagaActiva = null; pintarPublicacion(); });
    filtroSagas.appendChild(todas);
    Object.entries(D.sagas).forEach(([clave, s]) => {
        const b = crear('button', null, s.nombre);
        b.type = 'button';
        const m = crear('span', 'muestra');
        m.style.background = color(clave);
        b.prepend(m);
        b.addEventListener('click', () => { sagaActiva = sagaActiva === clave ? null : clave; pintarPublicacion(); });
        filtroSagas.appendChild(b);
        botonesSaga[clave] = b;
    });
    soloNovelas.addEventListener('change', pintarPublicacion);
    verAutor.addEventListener('change', pintarPublicacion);

    function tarjetaLibro(l) {
        const li = crear('li', 'tl-libro');
        li.style.setProperty('--saga', color(l.saga));
        const det = crear('details', 'tarjeta-tl' + (leidos.has(l.id) ? ' leido' : ''));
        const sum = crear('summary');
        // Sello con la inicial del título (sin el artículo)
        sum.append(crear('span', 'tl-sello', l.titulo.replace(/^(The|A) /, '').charAt(0)));
        const cab = crear('span', 'tl-cab');
        cab.append(crear('span', 'tl-saga', D.sagas[l.saga].nombre + ' · ' + D.tipos[l.tipo].nombre));
        cab.append(crear('strong', 'tl-titulo', l.titulo));
        if (l.es && l.es !== l.titulo) cab.append(crear('span', 'tl-es', l.es));
        sum.append(cab);
        if (leidos.has(l.id)) sum.append(crear('span', 'tl-leido', '✓'));
        det.append(sum);

        const cuerpo = crear('div', 'tl-cuerpo');
        cuerpo.append(crear('p', null, l.resumen));
        const pie = crear('p', 'tl-enlaces');
        const a = crear('a', null, 'Ver en la guía de lectura →');
        a.href = `${GUIA}#${l.id}`;
        pie.append(a);
        (lugaresDe.get(l.id) || []).slice(0, 3).forEach(lu => {
            const m = crear('a', 'tl-lugar', '⌖ ' + (lu.es || lu.nombre));
            m.href = `${MAPA}#${lu.id}`;
            pie.append(m);
        });
        cuerpo.append(pie);
        det.append(cuerpo);
        li.append(det);
        return li;
    }

    function pintarPublicacion() {
        todas.setAttribute('aria-pressed', String(!sagaActiva));
        Object.entries(botonesSaga).forEach(([k, b]) => b.setAttribute('aria-pressed', String(sagaActiva === k)));

        const libros = D.libros.filter(l => l.anio &&
            (!sagaActiva || l.saga === sagaActiva) &&
            (!soloNovelas.checked || esNovela(l)));
        const porAnio = new Map();
        libros.forEach(l => { if (!porAnio.has(l.anio)) porAnio.set(l.anio, []); porAnio.get(l.anio).push(l); });
        const hitos = verAutor.checked ? H.autor : [];
        const anios = [...new Set([...porAnio.keys(), ...hitos.map(h => h.anio)])].sort((a, b) => a - b);

        tl.innerHTML = '';
        let lado = 0;
        anios.forEach(anio => {
            const grupo = crear('li', 'tl-anio');
            const marca = crear('h3', 'tl-marca', String(anio));
            grupo.append(marca);
            const lista = crear('ol', 'tl-items');
            hitos.filter(h => h.anio === anio).forEach(h => {
                const li = crear('li', 'tl-autor');
                li.append(crear('span', 'tl-pluma', '✒'), crear('span', null, h.texto));
                lista.append(li);
            });
            (porAnio.get(anio) || []).forEach(l => lista.append(tarjetaLibro(l)));
            grupo.append(lista);
            grupo.classList.add(lado++ % 2 ? 'derecha' : 'izquierda');
            tl.append(grupo);
        });
        if (!anios.length) tl.append(crear('li', 'tl-vacio', 'No hay libros con ese filtro.'));
    }
    pintarPublicacion();

    // ===================== 2. El pasado =====================
    const listaPasado = document.getElementById('lista-pasado');
    H.pasado.forEach((p, i) => {
        const li = crear('li', 'paso');
        li.style.setProperty('--hondo', String(1 - i / (H.pasado.length - 1)));
        li.append(crear('span', 'paso-era', p.era));
        const caja = crear('div', 'paso-caja');
        caja.append(crear('h3', null, p.titulo), crear('p', null, p.texto));
        if (p.libros.length) {
            const ls = crear('p', 'paso-libros');
            ls.append(crear('span', null, 'Se cuenta en: '));
            p.libros.forEach(id => ls.append(enlaceLibro(id)));
            caja.append(ls);
        }
        li.append(caja);
        listaPasado.append(li);
    });

    // ===================== 3. Inventos =====================
    const via = document.getElementById('via-inventos');
    const rail = crear('ol', 'via-rail');
    H.inventos.forEach(inv => {
        const l = libro.get(inv.libro);
        const li = crear('li', 'parada');
        li.style.setProperty('--saga', color(l.saga));
        li.append(crear('span', 'parada-anio', String(l.anio)));
        li.append(crear('span', 'parada-sello'));
        li.append(crear('h3', null, inv.nombre));
        li.append(crear('p', null, inv.texto));
        li.append(enlaceLibro(inv.libro));
        rail.append(li);
    });
    via.append(rail);

    // ===================== 4. Personajes =====================
    const carriles = document.getElementById('carriles');
    H.personajes.forEach(pj => {
        const fila = crear('section', 'carril');
        fila.style.setProperty('--saga', color(pj.saga));
        const cab = crear('h3', 'carril-nombre', pj.nombre);
        fila.append(cab);
        const ol = crear('ol', 'carril-etapas');
        pj.etapas.forEach(([id, texto], i) => {
            const l = libro.get(id);
            const li = crear('li', 'etapa' + (leidos.has(id) ? ' leido' : ''));
            li.append(crear('span', 'etapa-num', String(i + 1)));
            li.append(crear('p', 'etapa-texto', texto));
            li.append(enlaceLibro(id, 'etapa-libro'));
            if (l && l.anio) li.append(crear('span', 'etapa-anio', String(l.anio)));
            ol.append(li);
        });
        fila.append(ol);
        carriles.append(fila);
    });

    // Resalta en el índice la sección visible
    const enlacesIndice = [...document.querySelectorAll('.indice a')];
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entradas => {
            entradas.forEach(e => {
                if (!e.isIntersecting) return;
                enlacesIndice.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        document.querySelectorAll('.bloque').forEach(b => obs.observe(b));
    }
})();

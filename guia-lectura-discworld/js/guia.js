// Guía interactiva de Mundodisco: dibuja el mapa SVG a partir de window.DISCWORLD
// y muestra la ficha (resumen) del libro seleccionado.
(function () {
    const D = window.DISCWORLD;
    const NS = 'http://www.w3.org/2000/svg';
    const RADIO = 50;
    const CLAVE = 'discworld-leidos';

    const svg = document.getElementById('mapa');
    const porId = new Map(D.libros.map(l => [l.id, l]));

    // ---------- Libros leídos (solo en este navegador) ----------
    let leidos = new Set();
    try { leidos = new Set(JSON.parse(localStorage.getItem(CLAVE) || '[]')); } catch (e) { /* sin almacenamiento */ }
    function guardarLeidos() {
        try { localStorage.setItem(CLAVE, JSON.stringify([...leidos])); } catch (e) { /* sin almacenamiento */ }
    }

    // ---------- Orden dentro de cada saga (por año; sin año, al final) ----------
    const porSaga = {};
    Object.keys(D.sagas).forEach(s => { porSaga[s] = []; });
    D.libros.forEach(l => porSaga[l.saga].push(l));
    Object.values(porSaga).forEach(lista => lista.sort((a, b) => (a.anio || 9999) - (b.anio || 9999) || a.x - b.x));

    // ---------- Vecinos según las conexiones ----------
    const vecinos = new Map(D.libros.map(l => [l.id, []]));
    D.conexiones.forEach(([a, b, tipo]) => {
        vecinos.get(a).push({ id: b, tipo });
        vecinos.get(b).push({ id: a, tipo });
    });

    // ---------- Utilidades SVG ----------
    function el(nombre, atributos, padre) {
        const n = document.createElementNS(NS, nombre);
        for (const k in atributos) n.setAttribute(k, atributos[k]);
        if (padre) padre.appendChild(n);
        return n;
    }

    // Reparte el título en líneas y elige el tamaño de letra más grande que quepa en el sello.
    function ajustarTitulo(texto) {
        const palabras = texto.split(' ');
        let mejor = null;
        for (let ancho = 6; ancho <= 30; ancho++) {
            const lineas = [];
            let actual = '';
            palabras.forEach(p => {
                if (actual && (actual + ' ' + p).length > ancho) { lineas.push(actual); actual = p; }
                else actual = actual ? actual + ' ' + p : p;
            });
            lineas.push(actual);
            const largo = Math.max(...lineas.map(x => x.length));
            const tam = Math.min(19, 84 / (largo * 0.5), 76 / (lineas.length * 1.12));
            const nota = tam - lineas.length * 1.2;   // a igualdad, mejor menos líneas
            if (!mejor || nota > mejor.nota) mejor = { lineas, tam, nota };
        }
        return mejor;
    }

    function curva(a, b, desvio) {
        if (!desvio) return `M${a.x},${a.y} L${b.x},${b.y}`;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        // Punto de control perpendicular a la recta, proporcional a la distancia
        const k = desvio * len / 100;
        const cx = mx + (-dy / len) * k, cy = my + (dx / len) * k;
        return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`;
    }

    // ---------- Dibujo del mapa ----------
    const defs = el('defs', {}, svg);
    defs.innerHTML = `
        <radialGradient id="brillo" cx="35%" cy="30%" r="75%">
            <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
            <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
            <stop offset="1" stop-color="#000" stop-opacity=".22"/>
        </radialGradient>
        <filter id="sombra" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#3b2410" flood-opacity=".35"/>
        </filter>
        <marker id="flecha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#B23A2B"/>
        </marker>`;

    el('rect', { x: 40, y: 440, width: 1620, height: 1270, class: 'pergamino', rx: 18 }, svg);

    const capaLineas = el('g', { class: 'lineas' }, svg);
    const capaRotulos = el('g', { class: 'rotulos' }, svg);
    const capaNodos = el('g', { class: 'nodos' }, svg);

    const lineasPorId = new Map(D.libros.map(l => [l.id, []]));
    D.conexiones.forEach(([a, b, tipo, desvio]) => {
        const p = el('path', { d: curva(porId.get(a), porId.get(b), desvio), class: 'l-' + tipo }, capaLineas);
        p.dataset.a = a; p.dataset.b = b;
        lineasPorId.get(a).push(p);
        lineasPorId.get(b).push(p);
    });

    // Rótulos de saga
    Object.entries(D.sagas).forEach(([clave, s]) => {
        const g = el('g', { class: 'rotulo-saga', 'data-saga': clave }, capaRotulos);
        const palabras = s.linea ? [s.nombre] : partirEnDos(s.nombre);
        const t = el('text', { x: s.x, y: s.y - (palabras.length - 1) * 15, 'text-anchor': s.ancla }, g);
        palabras.forEach((p, i) => {
            const ts = el('tspan', { x: s.x, dy: i ? 32 : 0 }, t);
            ts.textContent = p;
        });
        // Flecha bajo el rótulo, como en la guía original
        const y = s.y + (palabras.length - 1) * 15 + 14;
        if (s.ancla === 'end') el('path', { d: `M${s.x - 150},${y} L${s.x - 5},${y}`, class: 'flecha-saga', 'marker-end': 'url(#flecha)' }, g);
    });

    function partirEnDos(texto) {
        const p = texto.split(' ');
        if (p.length < 2) return [texto];
        // Corta donde las dos mitades queden más equilibradas
        let mejor = 1, dif = Infinity;
        for (let i = 1; i < p.length; i++) {
            const d = Math.abs(p.slice(0, i).join(' ').length - p.slice(i).join(' ').length);
            if (d < dif) { dif = d; mejor = i; }
        }
        return [p.slice(0, mejor).join(' '), p.slice(mejor).join(' ')];
    }

    D.rotulos.forEach(r => {
        const t = el('text', { x: r.x, y: r.y, class: 'rotulo' + (r.pequeno ? ' pequeno' : ''), transform: `rotate(${r.giro} ${r.x} ${r.y})`, 'text-anchor': r.ancla || 'middle' }, capaRotulos);
        t.textContent = r.texto;
    });

    // Nodos (sellos de lacre)
    const nodos = new Map();
    D.libros.forEach(l => {
        const g = el('g', {
            class: 'nodo tipo-' + l.tipo, tabindex: 0, role: 'button',
            transform: `translate(${l.x} ${l.y})`,
            'aria-label': `${l.titulo}${l.es ? ' (' + l.es + ')' : ''}, ${D.tipos[l.tipo].nombre}`
        }, capaNodos);
        g.dataset.id = l.id;
        const cuerpo = el('g', { class: 'cuerpo' }, g);
        // Sello con borde irregular
        el('path', { d: selloIrregular(l.id), fill: D.tipos[l.tipo].color, class: 'sello', filter: 'url(#sombra)' }, cuerpo);
        el('circle', { r: RADIO - 9, class: 'anillo' }, cuerpo);
        el('circle', { r: RADIO, fill: 'url(#brillo)', class: 'brillo' }, cuerpo);

        const { lineas, tam } = ajustarTitulo(l.corto || l.titulo);
        const texto = el('text', { 'text-anchor': 'middle', 'font-size': tam.toFixed(1), class: 'titulo-nodo' }, cuerpo);
        const alto = tam * 1.12;
        lineas.forEach((linea, i) => {
            const ts = el('tspan', { x: 0, y: (i - (lineas.length - 1) / 2) * alto + tam * 0.35 }, texto);
            ts.textContent = linea;
        });

        const marca = el('g', { class: 'marca-leido', transform: `translate(${RADIO * 0.68} ${-RADIO * 0.68})` }, g);
        el('circle', { r: 13 }, marca);
        const v = el('text', { 'text-anchor': 'middle', y: 6 }, marca);
        v.textContent = '✓';

        const titulo = el('title', {}, g);
        titulo.textContent = l.es ? `${l.titulo} — ${l.es}` : l.titulo;

        g.addEventListener('click', () => seleccionar(l.id));
        g.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); seleccionar(l.id); }
        });
        g.addEventListener('mouseenter', () => resaltarVecinos(l.id));
        g.addEventListener('mouseleave', () => resaltarVecinos(seleccionado));
        g.addEventListener('focus', () => resaltarVecinos(l.id));
        g.addEventListener('blur', () => resaltarVecinos(seleccionado));
        nodos.set(l.id, g);
    });

    // Contorno ondulado y estable para cada sello (semilla a partir del id)
    function selloIrregular(semilla) {
        let h = 0;
        for (const c of semilla) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        const azar = () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
        const puntos = 18, pts = [];
        for (let i = 0; i < puntos; i++) {
            const ang = (i / puntos) * Math.PI * 2;
            const r = RADIO + (azar() - 0.5) * 6;
            pts.push([Math.cos(ang) * r, Math.sin(ang) * r]);
        }
        // Curva suave que pasa cerca de los puntos
        let d = '';
        for (let i = 0; i < puntos; i++) {
            const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % puntos];
            const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
            d += i === 0 ? `M${mx.toFixed(1)},${my.toFixed(1)}` : '';
            const [x2, y2] = pts[(i + 2) % puntos];
            d += ` Q${x1.toFixed(1)},${y1.toFixed(1)} ${((x1 + x2) / 2).toFixed(1)},${((y1 + y2) / 2).toFixed(1)}`;
        }
        return d + 'Z';
    }

    // ---------- Filtros ----------
    const filtroSagas = document.getElementById('filtro-sagas');
    const filtroTipos = document.getElementById('filtro-tipos');
    const buscador = document.getElementById('buscador');
    let sagaActiva = null;
    const tiposActivos = new Set(Object.keys(D.tipos));

    const botonTodas = boton(filtroSagas, 'Todas las sagas', () => { sagaActiva = null; aplicarFiltros(); });
    const botonesSaga = {};
    Object.entries(D.sagas).forEach(([clave, s]) => {
        botonesSaga[clave] = boton(filtroSagas, s.nombre, () => {
            sagaActiva = sagaActiva === clave ? null : clave;
            aplicarFiltros();
        });
    });

    const botonesTipo = {};
    Object.entries(D.tipos).forEach(([clave, t]) => {
        const b = boton(filtroTipos, t.nombre, () => {
            if (tiposActivos.has(clave) && tiposActivos.size > 1) tiposActivos.delete(clave);
            else tiposActivos.add(clave);
            aplicarFiltros();
        });
        const muestra = document.createElement('span');
        muestra.className = 'muestra';
        muestra.style.background = t.color;
        b.prepend(muestra);
        botonesTipo[clave] = b;
    });

    function boton(padre, texto, accion) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = texto;
        b.addEventListener('click', accion);
        padre.appendChild(b);
        return b;
    }

    function normalizar(t) {
        return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    buscador.addEventListener('input', aplicarFiltros);

    function coincide(l) {
        const q = normalizar(buscador.value.trim());
        if (sagaActiva && l.saga !== sagaActiva) return false;
        if (!tiposActivos.has(l.tipo)) return false;
        if (!q) return true;
        return normalizar(`${l.titulo} ${l.es || ''} ${l.resumen} ${D.sagas[l.saga].nombre}`).includes(q);
    }

    function aplicarFiltros() {
        const filtrando = sagaActiva || tiposActivos.size < Object.keys(D.tipos).length || buscador.value.trim();
        botonTodas.setAttribute('aria-pressed', String(!sagaActiva));
        Object.entries(botonesSaga).forEach(([k, b]) => b.setAttribute('aria-pressed', String(sagaActiva === k)));
        Object.entries(botonesTipo).forEach(([k, b]) => b.setAttribute('aria-pressed', String(tiposActivos.has(k))));

        const visibles = new Set(D.libros.filter(coincide).map(l => l.id));
        nodos.forEach((g, id) => g.classList.toggle('apagado', !!filtrando && !visibles.has(id)));
        capaLineas.querySelectorAll('path').forEach(p => {
            p.classList.toggle('apagado', !!filtrando && !(visibles.has(p.dataset.a) && visibles.has(p.dataset.b)));
        });
        capaRotulos.querySelectorAll('.rotulo-saga').forEach(r => {
            r.classList.toggle('apagado', !!sagaActiva && r.dataset.saga !== sagaActiva);
        });
        document.querySelectorAll('#listado li').forEach(li => li.hidden = !visibles.has(li.dataset.id));
        document.querySelectorAll('#listado .saga').forEach(s => {
            s.hidden = !s.querySelector('li:not([hidden])');
        });
    }

    // ---------- Resaltado de conexiones ----------
    function resaltarVecinos(id) {
        svg.classList.toggle('enfocando', !!id);
        nodos.forEach(g => g.classList.remove('vecino', 'foco'));
        capaLineas.querySelectorAll('.activa').forEach(p => p.classList.remove('activa'));
        if (!id) return;
        nodos.get(id).classList.add('foco');
        vecinos.get(id).forEach(v => nodos.get(v.id).classList.add('vecino'));
        lineasPorId.get(id).forEach(p => p.classList.add('activa'));
    }

    // ---------- Ficha ----------
    const ficha = document.getElementById('ficha');
    const fichaLibro = document.getElementById('ficha-libro');
    const fichaVacia = document.getElementById('ficha-vacia');
    const casilla = document.getElementById('ficha-leido');
    const anterior = document.getElementById('anterior');
    const siguiente = document.getElementById('siguiente');
    let seleccionado = null;

    function seleccionar(id, { desdeHistoria = false } = {}) {
        const l = porId.get(id);
        if (!l) return;
        seleccionado = id;
        nodos.forEach(g => g.classList.remove('seleccionado'));
        nodos.get(id).classList.add('seleccionado');
        resaltarVecinos(id);

        fichaVacia.hidden = true;
        fichaLibro.hidden = false;
        const tipo = D.tipos[l.tipo];
        document.getElementById('ficha-saga').textContent = D.sagas[l.saga].nombre;
        document.getElementById('ficha-titulo').textContent = l.titulo;
        const es = document.getElementById('ficha-es');
        es.textContent = l.es && l.es !== l.titulo ? `En español: ${l.es}` : '';
        es.hidden = !es.textContent;
        const insignia = document.getElementById('ficha-tipo');
        insignia.textContent = tipo.nombre;
        insignia.style.setProperty('--color-tipo', tipo.color);
        document.getElementById('ficha-anio').textContent = l.anio ? `Publicado en ${l.anio}` : '';
        document.getElementById('ficha-resumen').textContent = l.resumen;
        document.getElementById('ficha-personajes').href = 'quien-es-quien.html#libro=' + l.id;
        casilla.checked = leidos.has(id);

        // Anterior / siguiente dentro de la saga
        const lista = porSaga[l.saga];
        const i = lista.indexOf(l);
        ponerNav(anterior, lista[i - 1]);
        ponerNav(siguiente, lista[i + 1]);

        // Conexiones
        const ul = document.getElementById('ficha-conexiones');
        ul.innerHTML = '';
        vecinos.get(id).forEach(v => {
            const libro = porId.get(v.id);
            const li = document.createElement('li');
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'enlace-libro';
            b.innerHTML = `<span class="muestra"></span>`;
            b.querySelector('.muestra').style.background = D.tipos[libro.tipo].color;
            b.append(libro.titulo);
            const nota = document.createElement('small');
            nota.textContent = v.tipo === 'directa' ? ' · directa' : ' · menor';
            b.append(nota);
            b.addEventListener('click', () => seleccionar(v.id));
            li.appendChild(b);
            ul.appendChild(li);
        });
        document.getElementById('ficha-relacion').hidden = !ul.children.length;

        document.querySelectorAll('#listado li').forEach(li => li.classList.toggle('actual', li.dataset.id === id));
        ficha.classList.add('abierta');
        if (!desdeHistoria) {
            try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// en algunos navegadores */ }
        }
    }

    function ponerNav(b, libro) {
        b.hidden = !libro;
        if (!libro) return;
        b.querySelector('span').textContent = libro.titulo;
        b.onclick = () => seleccionar(libro.id);
    }

    function cerrarFicha() {
        seleccionado = null;
        nodos.forEach(g => g.classList.remove('seleccionado'));
        resaltarVecinos(null);
        fichaLibro.hidden = true;
        fichaVacia.hidden = false;
        ficha.classList.remove('abierta');
        document.querySelectorAll('#listado li.actual').forEach(li => li.classList.remove('actual'));
        try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* nada */ }
    }

    document.getElementById('cerrar').addEventListener('click', cerrarFicha);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && seleccionado) cerrarFicha(); });

    casilla.addEventListener('change', () => {
        if (!seleccionado) return;
        if (casilla.checked) leidos.add(seleccionado); else leidos.delete(seleccionado);
        guardarLeidos();
        pintarLeidos();
    });

    // ---------- Listado por sagas ----------
    const listado = document.getElementById('listado');
    Object.entries(D.sagas).forEach(([clave, s]) => {
        const div = document.createElement('div');
        div.className = 'saga';
        const h = document.createElement('h3');
        h.textContent = s.nombre;
        const ol = document.createElement('ol');
        porSaga[clave].forEach(l => {
            const li = document.createElement('li');
            li.dataset.id = l.id;
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'enlace-libro';
            b.innerHTML = '<span class="muestra"></span>';
            b.querySelector('.muestra').style.background = D.tipos[l.tipo].color;
            b.append(l.titulo);
            if (l.anio) {
                const a = document.createElement('small');
                a.textContent = ' ' + l.anio;
                b.append(a);
            }
            b.addEventListener('click', () => {
                seleccionar(l.id);
                // En pantallas estrechas la ficha queda debajo: la llevamos a la vista
                if (window.matchMedia('(max-width: 980px)').matches) ficha.scrollIntoView({ behavior: 'smooth', block: 'start' });
                else nodos.get(l.id).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            });
            li.appendChild(b);
            ol.appendChild(li);
        });
        div.append(h, ol);
        listado.appendChild(div);
    });

    // ---------- Progreso ----------
    const progreso = document.getElementById('progreso');
    function pintarLeidos() {
        nodos.forEach((g, id) => g.classList.toggle('leido', leidos.has(id)));
        document.querySelectorAll('#listado li').forEach(li => li.classList.toggle('leido', leidos.has(li.dataset.id)));
        const total = D.libros.length;
        const n = D.libros.filter(l => leidos.has(l.id)).length;
        progreso.innerHTML = '';
        const barra = document.createElement('span');
        barra.className = 'barra-progreso';
        barra.innerHTML = '<span></span>';
        barra.firstChild.style.width = (n / total * 100) + '%';
        progreso.append(barra, ` Has leído ${n} de ${total}`);
    }

    pintarLeidos();
    aplicarFiltros();

    // Abrir el libro indicado en la URL (#going-postal)
    const inicial = decodeURIComponent(location.hash.slice(1));
    if (porId.has(inicial)) seleccionar(inicial, { desdeHistoria: true });
})();

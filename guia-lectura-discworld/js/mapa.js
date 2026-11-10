// Mapa interactivo genérico: zoom y desplazamiento sobre una imagen,
// marcadores y ficha de cada lugar. Lo usan el mapa del disco y el de Ankh-Morpork.
// Los datos salen de la variable global indicada en <script data-datos="…">
// (por defecto, window.MUNDODISCO_LUGARES). Si los datos traen `eje`, se dibuja la línea hacia el Eje.
// Usa window.DISCWORLD (js/libros.js) para enlazar con la guía de lectura.
(function () {
    const M = window[(document.currentScript && document.currentScript.dataset.datos) || 'MUNDODISCO_LUGARES'];
    const LIBROS = new Map(((window.DISCWORLD && window.DISCWORLD.libros) || []).map(l => [l.id, l]));
    const GUIA = 'guia-de-lectura-de-mundodisco.html';
    const { ancho: ANCHO, alto: ALTO } = M.imagen;
    const RADIO_DISCO = M.radio || 490; // del Eje al Borde, en píxeles de la imagen
    const ZOOM_MIN = 1, ZOOM_MAX = 6;

    const visor = document.getElementById('visor');
    const plano = document.getElementById('plano');
    const capaMarcadores = document.getElementById('marcadores');
    const porId = new Map(M.lugares.map(l => [l.id, l]));

    // ---------- Zoom y desplazamiento ----------
    let escala = 1, tx = 0, ty = 0;

    function limitar() {
        const w = visor.clientWidth, h = visor.clientHeight;
        tx = Math.min(0, Math.max(w - w * escala, tx));
        ty = Math.min(0, Math.max(h - h * escala, ty));
    }
    function pintar(animar) {
        limitar();
        plano.classList.toggle('animado', !!animar);
        plano.style.transform = `translate(${tx}px, ${ty}px) scale(${escala})`;
        plano.style.setProperty('--s', escala);
        visor.classList.toggle('acercado', escala > 1.01);
        visor.classList.toggle('muy-acercado', escala >= 2.2);
    }
    function zoomEn(px, py, nueva, animar) {
        nueva = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nueva));
        tx = px - (px - tx) * (nueva / escala);
        ty = py - (py - ty) * (nueva / escala);
        escala = nueva;
        pintar(animar);
    }
    function centrarEn(x, y, nueva) {
        const w = visor.clientWidth, h = visor.clientHeight;
        escala = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nueva));
        tx = w / 2 - (x / ANCHO) * w * escala;
        ty = h / 2 - (y / ALTO) * h * escala;
        pintar(true);
    }

    visor.addEventListener('wheel', e => {
        e.preventDefault();
        const r = visor.getBoundingClientRect();
        zoomEn(e.clientX - r.left, e.clientY - r.top, escala * Math.exp(-e.deltaY * 0.0015));
    }, { passive: false });

    // Arrastre con un dedo o ratón; pellizco con dos dedos
    const punteros = new Map();
    let arrastrado = false, inicio = null;

    visor.addEventListener('pointerdown', e => {
        punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
        inicio = { x: e.clientX, y: e.clientY };
        arrastrado = false;
    });
    visor.addEventListener('pointermove', e => {
        if (!punteros.has(e.pointerId)) return;
        const antes = punteros.get(e.pointerId);
        const ahora = { x: e.clientX, y: e.clientY };
        if (Math.hypot(ahora.x - inicio.x, ahora.y - inicio.y) > 5 && !arrastrado) {
            arrastrado = true;
            visor.setPointerCapture(e.pointerId);
        }
        if (punteros.size === 2) {
            const [a, b] = [...punteros.values()];
            const otro = a === antes ? b : a;
            const dAntes = Math.hypot(antes.x - otro.x, antes.y - otro.y);
            const dAhora = Math.hypot(ahora.x - otro.x, ahora.y - otro.y);
            const r = visor.getBoundingClientRect();
            if (dAntes > 0) zoomEn((ahora.x + otro.x) / 2 - r.left, (ahora.y + otro.y) / 2 - r.top, escala * dAhora / dAntes);
        } else if (arrastrado) {
            tx += ahora.x - antes.x;
            ty += ahora.y - antes.y;
            pintar();
        }
        punteros.set(e.pointerId, ahora);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => visor.addEventListener(t, e => punteros.delete(e.pointerId)));
    // Un arrastre no debe contar como clic en un marcador
    visor.addEventListener('click', e => { if (arrastrado) { e.stopPropagation(); e.preventDefault(); } }, true);

    function zoomCentro(factor) { zoomEn(visor.clientWidth / 2, visor.clientHeight / 2, escala * factor, true); }
    document.getElementById('acercar').addEventListener('click', () => zoomCentro(1.6));
    document.getElementById('alejar').addEventListener('click', () => zoomCentro(1 / 1.6));
    document.getElementById('encuadrar').addEventListener('click', () => { escala = 1; tx = ty = 0; pintar(true); });
    window.addEventListener('resize', () => pintar());

    document.getElementById('ver-nombres').addEventListener('change', e => {
        visor.classList.toggle('con-nombres', e.target.checked);
    });

    // ---------- Marcadores ----------
    const marcadores = new Map();
    M.lugares.forEach(l => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `marcador tipo-${l.tipo}` + (l.aprox ? ' aprox' : '');
        b.style.left = (l.x / ANCHO * 100) + '%';
        b.style.top = (l.y / ALTO * 100) + '%';
        b.style.setProperty('--zona', M.zonas[l.zona].color);
        b.setAttribute('aria-label', l.nombre + (l.es && l.es !== l.nombre ? ` (${l.es})` : ''));
        b.innerHTML = '<span class="punto"></span><span class="nombre"></span>';
        b.querySelector('.nombre').textContent = l.es || l.nombre;
        b.addEventListener('click', () => seleccionar(l.id));
        capaMarcadores.appendChild(b);
        marcadores.set(l.id, b);
    });

    // ---------- Línea hacia el Eje ----------
    const ejeMarca = document.getElementById('eje-marca');
    const lineaEje = document.getElementById('linea-eje');
    const lineaBorde = document.getElementById('linea-borde');
    if (M.eje) {
        ejeMarca.setAttribute('cx', M.eje.x);
        ejeMarca.setAttribute('cy', M.eje.y);
    }

    function dibujarEje(l) {
        if (!M.eje) return;
        const capa = document.getElementById('capa-eje');
        capa.classList.toggle('visible', !!l);
        if (!l) return;
        const dx = l.x - M.eje.x, dy = l.y - M.eje.y, d = Math.hypot(dx, dy) || 1;
        lineaEje.setAttribute('x1', l.x); lineaEje.setAttribute('y1', l.y);
        lineaEje.setAttribute('x2', M.eje.x); lineaEje.setAttribute('y2', M.eje.y);
        // Prolonga la recta hasta el Borde
        lineaBorde.setAttribute('x1', l.x); lineaBorde.setAttribute('y1', l.y);
        lineaBorde.setAttribute('x2', M.eje.x + dx / d * RADIO_DISCO);
        lineaBorde.setAttribute('y2', M.eje.y + dy / d * RADIO_DISCO);
    }

    function posicionTexto(l) {
        if (!M.eje) return l.posicion || '';
        const f = Math.hypot(l.x - M.eje.x, l.y - M.eje.y) / RADIO_DISCO;
        if (f < 0.05) return 'En el mismo Eje';
        if (f < 0.3) return 'Muy cerca del Eje';
        if (f < 0.55) return 'A medio camino entre el Eje y el Borde';
        if (f < 0.8) return 'Más cerca del Borde que del Eje';
        return 'Junto al Borde';
    }

    // ---------- Ficha ----------
    const ficha = document.getElementById('ficha');
    const fichaLugar = document.getElementById('ficha-lugar');
    const fichaVacia = document.getElementById('ficha-vacia');
    let seleccionado = null;

    function seleccionar(id, { centrar = false, desdeHistoria = false } = {}) {
        const l = porId.get(id);
        if (!l) return;
        seleccionado = id;
        marcadores.forEach(m => m.classList.remove('seleccionado'));
        marcadores.get(id).classList.add('seleccionado');
        dibujarEje(l);
        if (centrar) centrarEn(l.x, l.y, Math.max(escala, 2.5));

        fichaVacia.hidden = true;
        fichaLugar.hidden = false;
        const zona = M.zonas[l.zona];
        const z = document.getElementById('ficha-zona');
        z.textContent = zona.nombre;
        document.getElementById('ficha-nombre').textContent = l.nombre;
        const es = document.getElementById('ficha-es');
        es.textContent = l.es && l.es !== l.nombre ? l.es : '';
        es.hidden = !es.textContent;
        const tipo = document.getElementById('ficha-tipo');
        tipo.textContent = M.tipos[l.tipo].nombre;
        tipo.style.setProperty('--color-tipo', zona.color);
        tipo.classList.add('insignia-zona');
        document.getElementById('ficha-posicion').textContent = posicionTexto(l);
        document.getElementById('ficha-texto').textContent = l.texto;
        const aviso = document.getElementById('ficha-aprox');
        aviso.textContent = l.nota || 'Posición aproximada: el mapa no lo marca.';
        aviso.hidden = !(l.aprox || l.nota);

        const ul = document.getElementById('lista-libros');
        ul.innerHTML = '';
        l.libros.forEach(idLibro => {
            const libro = LIBROS.get(idLibro);
            if (!libro) return;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'enlace-libro';
            a.href = `${GUIA}#${idLibro}`;
            a.textContent = libro.titulo;
            if (libro.es && libro.es !== libro.titulo) {
                const s = document.createElement('small');
                s.textContent = ' · ' + libro.es;
                a.append(s);
            }
            li.appendChild(a);
            ul.appendChild(li);
        });
        document.getElementById('ficha-libros').hidden = !ul.children.length;

        document.querySelectorAll('#listado li').forEach(li => li.classList.toggle('actual', li.dataset.id === id));
        if (!desdeHistoria) {
            try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// en algunos navegadores */ }
        }
    }

    function cerrarFicha() {
        seleccionado = null;
        marcadores.forEach(m => m.classList.remove('seleccionado'));
        dibujarEje(null);
        fichaLugar.hidden = true;
        fichaVacia.hidden = false;
        document.querySelectorAll('#listado li.actual').forEach(li => li.classList.remove('actual'));
        try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* nada */ }
    }
    document.getElementById('cerrar').addEventListener('click', cerrarFicha);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && seleccionado) cerrarFicha(); });

    // ---------- Filtros ----------
    const buscador = document.getElementById('buscador');
    const filtroZonas = document.getElementById('filtro-zonas');
    const filtroTipos = document.getElementById('filtro-tipos');
    let zonaActiva = null;
    const tiposActivos = new Set(Object.keys(M.tipos));

    function boton(padre, texto, accion) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = texto;
        b.addEventListener('click', accion);
        padre.appendChild(b);
        return b;
    }
    const botonTodas = boton(filtroZonas, M.textoTodas || 'Todas las zonas', () => { zonaActiva = null; aplicarFiltros(); });
    const botonesZona = {};
    Object.entries(M.zonas).forEach(([clave, z]) => {
        const b = boton(filtroZonas, z.nombre, () => {
            zonaActiva = zonaActiva === clave ? null : clave;
            aplicarFiltros();
        });
        const m = document.createElement('span');
        m.className = 'muestra';
        m.style.background = z.color;
        b.prepend(m);
        botonesZona[clave] = b;
    });
    const botonesTipo = {};
    Object.entries(M.tipos).forEach(([clave, t]) => {
        const b = boton(filtroTipos, t.nombre, () => {
            if (tiposActivos.has(clave) && tiposActivos.size > 1) tiposActivos.delete(clave);
            else tiposActivos.add(clave);
            aplicarFiltros();
        });
        const icono = document.createElement('span');
        icono.className = 'icono-tipo';
        icono.textContent = t.icono;
        b.prepend(icono);
        botonesTipo[clave] = b;
    });
    buscador.addEventListener('input', aplicarFiltros);

    const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    function coincide(l) {
        if (zonaActiva && l.zona !== zonaActiva) return false;
        if (!tiposActivos.has(l.tipo)) return false;
        const q = normalizar(buscador.value.trim());
        if (!q) return true;
        const libros = l.libros.map(id => { const b = LIBROS.get(id); return b ? b.titulo + ' ' + (b.es || '') : ''; }).join(' ');
        return normalizar(`${l.nombre} ${l.es || ''} ${l.texto} ${libros}`).includes(q);
    }

    function aplicarFiltros() {
        botonTodas.setAttribute('aria-pressed', String(!zonaActiva));
        Object.entries(botonesZona).forEach(([k, b]) => b.setAttribute('aria-pressed', String(zonaActiva === k)));
        Object.entries(botonesTipo).forEach(([k, b]) => b.setAttribute('aria-pressed', String(tiposActivos.has(k))));
        const visibles = new Set(M.lugares.filter(coincide).map(l => l.id));
        marcadores.forEach((m, id) => { m.hidden = !visibles.has(id); });
        document.querySelectorAll('#listado li').forEach(li => { li.hidden = !visibles.has(li.dataset.id); });
        document.querySelectorAll('#listado .saga').forEach(s => { s.hidden = !s.querySelector('li:not([hidden])'); });
    }

    // ---------- Listado por zonas ----------
    const listado = document.getElementById('listado');
    Object.entries(M.zonas).forEach(([clave, z]) => {
        const div = document.createElement('div');
        div.className = 'saga';
        div.style.setProperty('--zona', z.color);
        const h = document.createElement('h3');
        h.textContent = z.nombre;
        const ul = document.createElement('ul');
        M.lugares.filter(l => l.zona === clave).forEach(l => {
            const li = document.createElement('li');
            li.dataset.id = l.id;
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'enlace-libro';
            const icono = document.createElement('span');
            icono.className = 'icono-tipo';
            icono.textContent = M.tipos[l.tipo].icono;
            icono.style.color = z.color;
            b.append(icono, l.es || l.nombre);
            b.addEventListener('click', () => {
                visor.scrollIntoView({ behavior: 'smooth', block: 'center' });
                seleccionar(l.id, { centrar: true });
            });
            li.appendChild(b);
            ul.appendChild(li);
        });
        div.append(h, ul);
        listado.appendChild(div);
    });

    pintar();
    aplicarFiltros();

    // Abrir el lugar indicado en la URL (#lancre)
    const inicial = decodeURIComponent(location.hash.slice(1));
    if (porId.has(inicial)) seleccionar(inicial, { centrar: true, desdeHistoria: true });
})();

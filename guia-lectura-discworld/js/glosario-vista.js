// Glosario del Mundodisco: pinta los términos de js/glosario.js por orden alfabético,
// con buscador, filtro por categoría, índice de letras y enlace directo (#termino).
(function () {
    const G = window.MUNDODISCO_GLOSARIO;
    const D = window.DISCWORLD;
    const COLORES = (window.MUNDODISCO_HISTORIA || {}).coloresSaga || {};
    const GUIA = 'guia-de-lectura-de-mundodisco.html';
    const libro = new Map(D.libros.map(l => [l.id, l]));

    const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    // Para ordenar y agrupar se ignoran signos y artículos iniciales («¡Uuk!», «El Eje», «La Dama»…)
    const clave = t => normalizar(t).replace(/^[^a-z0-9]+/, '').replace(/^(el|la|los|las) /, '');
    const letra = t => clave(t).charAt(0).toUpperCase();
    const terminos = G.terminos.slice().sort((a, b) => clave(a.termino).localeCompare(clave(b.termino), 'es'));

    const cont = document.getElementById('glosario');
    const buscador = document.getElementById('buscador');
    const filtroCat = document.getElementById('filtro-cat');
    const abecedario = document.getElementById('abecedario');
    const recuento = document.getElementById('recuento');
    let catActiva = null;

    // ---------- Filtros ----------
    function boton(padre, texto, accion) {
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = texto;
        b.addEventListener('click', accion);
        padre.append(b);
        return b;
    }
    const botonTodas = boton(filtroCat, 'Todas', () => { catActiva = null; pintar(); });
    const botonesCat = {};
    Object.entries(G.categorias).forEach(([k, c]) => {
        const b = boton(filtroCat, c.nombre, () => { catActiva = catActiva === k ? null : k; pintar(); });
        const m = document.createElement('span');
        m.className = 'muestra'; m.style.background = c.color;
        b.prepend(m);
        botonesCat[k] = b;
    });
    buscador.addEventListener('input', pintar);

    function coincide(t) {
        if (catActiva && t.cat !== catActiva) return false;
        const q = normalizar(buscador.value.trim());
        return !q || normalizar(`${t.termino} ${t.original || ''} ${t.def}`).includes(q);
    }

    // ---------- Tarjeta de un término ----------
    function entrada(t) {
        const art = document.createElement('article');
        art.className = 'termino';
        art.id = t.id;
        art.style.setProperty('--cat', G.categorias[t.cat].color);

        const cab = document.createElement('header');
        const h = document.createElement('h3');
        const a = document.createElement('a');
        a.href = '#' + t.id; a.textContent = t.termino; a.title = 'Enlace a este término';
        h.append(a);
        cab.append(h);
        if (t.original && t.original !== t.termino) {
            const o = document.createElement('span');
            o.className = 'original'; o.textContent = t.original;
            cab.append(o);
        }
        const c = document.createElement('span');
        c.className = 'cat'; c.textContent = G.categorias[t.cat].nombre;
        cab.append(c);
        art.append(cab);

        const p = document.createElement('p');
        p.className = 'def'; p.textContent = t.def;
        art.append(p);

        const pie = document.createElement('div');
        pie.className = 'termino-pie';
        if (t.libros && t.libros.length) {
            const fila = document.createElement('p');
            fila.className = 'fila-libros';
            fila.append(etiqueta('Aparece en'));
            t.libros.forEach(id => {
                const l = libro.get(id);
                if (!l) return;
                const e = document.createElement('a');
                e.className = 'chip'; e.href = `${GUIA}#${id}`; e.textContent = l.titulo;
                e.style.setProperty('--chip', COLORES[l.saga] || '#8A5A2B');
                fila.append(e);
            });
            pie.append(fila);
        }
        if (t.ver && t.ver.length) {
            const fila = document.createElement('p');
            fila.className = 'fila-ver';
            fila.append(etiqueta('Ver también'));
            t.ver.forEach(([texto, href]) => {
                const e = document.createElement('a');
                e.href = href; e.textContent = texto + ' →';
                fila.append(e);
            });
            pie.append(fila);
        }
        if (pie.children.length) art.append(pie);
        return art;
    }
    function etiqueta(texto) {
        const s = document.createElement('span');
        s.className = 'etiqueta-fila'; s.textContent = texto;
        return s;
    }

    // ---------- Pintar ----------
    function pintar() {
        botonTodas.setAttribute('aria-pressed', String(!catActiva));
        Object.entries(botonesCat).forEach(([k, b]) => b.setAttribute('aria-pressed', String(catActiva === k)));

        const visibles = terminos.filter(coincide);
        cont.innerHTML = '';
        const porLetra = new Map();
        visibles.forEach(t => {
            const L = letra(t.termino);
            if (!porLetra.has(L)) porLetra.set(L, []);
            porLetra.get(L).push(t);
        });
        porLetra.forEach((lista, L) => {
            const sec = document.createElement('section');
            sec.className = 'letra';
            sec.id = 'letra-' + L;
            const h = document.createElement('h2');
            h.textContent = L;
            const rejilla = document.createElement('div');
            rejilla.className = 'terminos';
            lista.forEach(t => rejilla.append(entrada(t)));
            sec.append(h, rejilla);
            cont.append(sec);
        });
        if (!visibles.length) {
            const v = document.createElement('p');
            v.className = 'vacio-glosario';
            v.textContent = 'Ningún término coincide. Prueba con otra palabra.';
            cont.append(v);
        }

        // Índice: todas las letras del alfabeto; activas solo las que tienen términos
        abecedario.innerHTML = '';
        'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').forEach(L => {
            const a = document.createElement(porLetra.has(L) ? 'a' : 'span');
            a.textContent = L;
            if (porLetra.has(L)) a.href = '#letra-' + L;
            abecedario.append(a);
        });
        recuento.textContent = visibles.length === terminos.length
            ? `${terminos.length} términos`
            : `${visibles.length} de ${terminos.length} términos`;
    }

    // ---------- Resaltar un término (enlace directo o al azar) ----------
    function resaltar(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('destacado');
        void el.offsetWidth;
        el.classList.add('destacado');
    }
    document.getElementById('azar').addEventListener('click', () => {
        buscador.value = ''; catActiva = null; pintar();
        const t = terminos[Math.floor(Math.random() * terminos.length)];
        try { history.replaceState(null, '', '#' + t.id); } catch (e) { /* file:// */ }
        resaltar(t.id);
    });
    window.addEventListener('hashchange', () => resaltar(decodeURIComponent(location.hash.slice(1))));

    pintar();
    const inicial = decodeURIComponent(location.hash.slice(1));
    if (inicial && !inicial.startsWith('letra-')) setTimeout(() => resaltar(inicial), 50);
})();

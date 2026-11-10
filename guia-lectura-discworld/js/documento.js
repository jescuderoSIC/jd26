// Muestra un documento Markdown con el estilo de las páginas de Mundodisco.
// El fichero se indica en <article id="documento" data-md="…">.
// fetch() lee el texto como UTF-8, así que los acentos se ven bien
// (abrir el .md directamente en el navegador no siempre lo hace).
(function () {
    const doc = document.getElementById('documento');
    const fichero = doc.dataset.md;
    const indice = document.getElementById('indice-doc');
    const lista = document.getElementById('lista-indice');

    function avisar(texto) {
        doc.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'aviso-doc';
        p.textContent = texto;
        doc.appendChild(p);
    }

    // Identificador legible para los títulos: «2. Terry Pratchett, el autor» → terry-pratchett-el-autor
    function slug(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/^[\d.\s]+/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    fetch(fichero, { cache: 'no-cache' })
        .then(r => {
            if (!r.ok) throw new Error(`No se encontró ${fichero} (${r.status})`);
            return r.text();
        })
        .then(md => {
            doc.innerHTML = DOMPurify.sanitize(marked.parse(md));

            const h1 = doc.querySelector('h1');
            if (h1) document.title = h1.textContent;

            doc.querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });

            // Índice a partir de los títulos de sección (##)
            const usados = new Set();
            doc.querySelectorAll('h2').forEach(h => {
                let id = slug(h.textContent) || 'seccion';
                while (usados.has(id)) id += '-2';
                usados.add(id);
                h.id = id;
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + id;
                a.textContent = h.textContent.replace(/^\d+\.\s*/, '');
                li.appendChild(a);
                lista.appendChild(li);
            });
            indice.hidden = !lista.children.length;

            // Si se llegó con un #seccion, ir a ella ahora que existe
            if (location.hash) {
                const destino = document.getElementById(decodeURIComponent(location.hash.slice(1)));
                if (destino) destino.scrollIntoView();
            }

            // Marca en el índice la sección que se está leyendo
            if ('IntersectionObserver' in window) {
                const enlaces = [...lista.querySelectorAll('a')];
                const obs = new IntersectionObserver(entradas => {
                    entradas.forEach(e => {
                        if (!e.isIntersecting) return;
                        enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + e.target.id));
                    });
                }, { rootMargin: '0px 0px -75% 0px' });
                doc.querySelectorAll('h2').forEach(h => obs.observe(h));
            }
        })
        .catch(err => {
            // Con doble clic (file://) el navegador bloquea fetch: hace falta un servidor local
            avisar(location.protocol === 'file:'
                ? 'Esta página necesita abrirse desde un servidor local (por ejemplo, Live Server o «python -m http.server») para leer el documento.'
                : err.message);
        });
})();

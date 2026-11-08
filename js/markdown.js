// Carga el .md homónimo de la página (pagina.html → markdown/pagina.md) y lo muestra.
// Para usar otro fichero: <article id="documento" data-md="markdown/otro.md">
const documento = document.getElementById('documento');

const pagina = decodeURIComponent(location.pathname.split('/').pop()) || 'index.html';
const fichero = documento.dataset.md || 'markdown/' + pagina.replace(/\.html?$/i, '') + '.md';

function avisar(texto) {
    documento.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'aviso';
    p.textContent = texto;
    documento.appendChild(p);
}

fetch(fichero, { cache: 'no-cache' })
    .then(r => {
        if (!r.ok) throw new Error(`No se encontró ${fichero} (${r.status})`);
        return r.text();
    })
    .then(md => {
        documento.innerHTML = DOMPurify.sanitize(marked.parse(md));

        // El primer título del Markdown da nombre a la pestaña
        const h1 = documento.querySelector('h1');
        if (h1) document.title = h1.textContent;

        // Los enlaces externos se abren en otra pestaña
        documento.querySelectorAll('a[href^="http"]').forEach(a => {
            a.target = '_blank';
            a.rel = 'noopener';
        });

        // Bloques de código: colores con Prism y líneas numeradas.
        // Un bloque sin lenguaje (```) se marca como "none" para que también se numere.
        if (window.Prism && Prism.highlightAllUnder) {
            documento.querySelectorAll('pre > code').forEach(code => {
                if (!/\blanguage-/.test(code.className)) code.classList.add('language-none');
                code.parentElement.classList.add('line-numbers');
            });
            Prism.highlightAllUnder(documento);
        }
    })
    .catch(err => {
        // Abrir el .html con doble clic (file://) bloquea fetch: hace falta un servidor
        avisar(location.protocol === 'file:'
            ? 'Esta página necesita servirse por http para leer el Markdown (por ejemplo: python -m http.server).'
            : err.message);
    });

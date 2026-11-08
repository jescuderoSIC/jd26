// La lista funciona sin JavaScript; esto solo añade la búsqueda y los filtros.
const buscador = document.getElementById('buscador');
const botones = document.querySelectorAll('.filtros button');
const paginas = [...document.querySelectorAll('.pagina')];
const recuento = document.getElementById('recuento');
const vacio = document.getElementById('vacio');
let filtro = 'todas';

// Quita tildes y mayúsculas para que "constitucion" encuentre "Constitución"
const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function aplicar() {
    const q = normalizar(buscador.value.trim());
    let visibles = 0;

    paginas.forEach(p => {
        const texto = normalizar(p.textContent + ' ' + (p.dataset.etiquetas || ''));
        const coincide = (!q || texto.includes(q)) &&
                         (filtro === 'todas' || p.dataset.estado === filtro);
        p.hidden = !coincide;
        if (coincide) visibles++;
    });

    const total = paginas.length;
    recuento.textContent = visibles === total
        ? `${total} páginas`
        : `${visibles} de ${total} páginas`;
    vacio.hidden = visibles > 0;
}

buscador.addEventListener('input', aplicar);

botones.forEach(b => b.addEventListener('click', () => {
    filtro = b.dataset.filtro;
    botones.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    aplicar();
}));

document.getElementById('limpiar').addEventListener('click', () => {
    buscador.value = '';
    filtro = 'todas';
    botones.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.filtro === 'todas')));
    aplicar();
    buscador.focus();
});

aplicar();

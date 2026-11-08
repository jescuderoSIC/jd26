// Dibuja un mapa SVG con los lugares de json/lugares.json.
// La ruta se calcula desde este script (no desde la página), así el bloque
// funciona aunque se incluya en una página de otra carpeta.
// Cada lugar: { id, nombre, pais, lat, lon, historia, etiqueta?: "izquierda" }
const contenedor = document.getElementById('mapa');
const fichero = contenedor.dataset.json || new URL('../json/lugares.json', document.currentScript.src).href;
// Contornos de países (escala 1:50 millones: incluye islas como Mykonos)
const PAISES = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';

const ANCHO = 800, ALTO = 600;
const MARGEN_GRADOS = 5;   // aire alrededor de los lugares al encuadrar

const ficha = document.getElementById('ficha');
const lista = document.getElementById('lugares');

function avisar(texto) {
    contenedor.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'aviso';
    p.textContent = texto;
    contenedor.appendChild(p);
}

Promise.all([
    fetch(fichero, { cache: 'no-cache' }).then(r => {
        if (!r.ok) throw new Error(`No se encontró ${fichero} (${r.status})`);
        return r.json();
    }),
    fetch(PAISES).then(r => {
        if (!r.ok) throw new Error(`No se pudo cargar el mapa base (${r.status})`);
        return r.json();
    })
])
    .then(([datos, mundo]) => dibujar(datos, mundo))
    .catch(err => avisar(location.protocol === 'file:'
        ? 'Esta página necesita servirse por http para leer el JSON (por ejemplo: python -m http.server).'
        : err.message));

function dibujar(datos, mundo) {
    const lugares = datos.lugares || [];
    if (datos.titulo) document.title = datos.titulo;

    const paises = topojson.feature(mundo, mundo.objects.countries).features;

    // Proyección encuadrada en los lugares más un margen
    const lons = lugares.map(l => l.lon), lats = lugares.map(l => l.lat);
    const [oeste, este] = [Math.min(...lons) - MARGEN_GRADOS, Math.max(...lons) + MARGEN_GRADOS];
    const [sur, norte] = [Math.min(...lats) - MARGEN_GRADOS, Math.max(...lats) + MARGEN_GRADOS];
    const caja = { type: 'MultiPoint', coordinates: [[oeste, sur], [este, norte], [oeste, norte], [este, sur]] };
    const proyeccion = d3.geoMercator().fitExtent([[10, 10], [ANCHO - 10, ALTO - 10]], caja);
    const ruta = d3.geoPath(proyeccion);

    // Países que contienen algún lugar: se resaltan
    const conHistoria = new Set(paises
        .filter(p => lugares.some(l => d3.geoContains(p, [l.lon, l.lat])))
        .map(p => p.id));

    contenedor.innerHTML = '';
    const svg = d3.select(contenedor).append('svg')
        .attr('viewBox', `0 0 ${ANCHO} ${ALTO}`)
        .attr('role', 'img')
        .attr('aria-label', `Mapa con ${lugares.length} lugares`);

    const capa = svg.append('g');

    capa.append('g').selectAll('path')
        .data(paises)
        .join('path')
        .attr('class', d => 'pais' + (conHistoria.has(d.id) ? ' con-historia' : ''))
        .attr('d', ruta)
        .append('title').text(d => d.properties.name);

    const posicion = d => proyeccion([d.lon, d.lat]);

    const marcas = capa.append('g').selectAll('g')
        .data(lugares)
        .join('g')
        .attr('class', 'lugar')
        .attr('tabindex', 0)
        .attr('role', 'button')
        .attr('aria-label', d => `${d.nombre}, ${d.pais}`)
        .attr('transform', d => `translate(${posicion(d)})`)
        .on('click', (e, d) => seleccionar(d))
        .on('keydown', (e, d) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); seleccionar(d); }
        });

    marcas.append('circle').attr('r', 6);
    marcas.append('text')
        .attr('dy', '0.35em')
        .attr('x', d => d.etiqueta === 'izquierda' ? -10 : 10)
        .attr('text-anchor', d => d.etiqueta === 'izquierda' ? 'end' : 'start')
        .text(d => d.nombre);

    // Zoom y arrastre: los marcadores y textos mantienen su tamaño en pantalla
    const zoom = d3.zoom()
        .scaleExtent([1, 12])
        .translateExtent([[-ANCHO, -ALTO], [ANCHO * 2, ALTO * 2]])
        .on('zoom', ({ transform }) => {
            capa.attr('transform', transform);
            marcas.attr('transform', d => `translate(${posicion(d)}) scale(${1 / transform.k})`);
        });
    svg.call(zoom);

    document.getElementById('encuadrar').addEventListener('click', () =>
        svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity));

    // Listado bajo el mapa
    lista.innerHTML = '';
    const botones = new Map();
    lugares.forEach(l => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-pressed', 'false');
        const nombre = document.createElement('strong');
        nombre.textContent = l.nombre;
        const pais = document.createElement('span');
        pais.className = 'pais-lista';
        pais.textContent = ' · ' + l.pais;
        b.append(nombre, pais);
        b.addEventListener('click', () => { seleccionar(l); acercar(l); });
        li.appendChild(b);
        lista.appendChild(li);
        botones.set(l.id, b);
    });

    function seleccionar(l) {
        marcas.classed('activo', d => d.id === l.id);
        botones.forEach((b, id) => b.setAttribute('aria-pressed', String(id === l.id)));
        document.getElementById('ficha-nombre').textContent = l.nombre;
        document.getElementById('ficha-pais').textContent = l.pais;
        document.getElementById('ficha-historia').textContent = l.historia || '';
        ficha.hidden = false;
    }

    function acercar(l, k = 4) {
        const [x, y] = posicion(l);
        svg.transition().duration(750).call(zoom.transform,
            d3.zoomIdentity.translate(ANCHO / 2, ALTO / 2).scale(k).translate(-x, -y));
    }
}

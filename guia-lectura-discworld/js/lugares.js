// Lugares del Mundodisco sobre images/Mapa_DiscWorld.png (1000 × 978 píxeles).
// Se guardan en un .js (no en .json) para que la página funcione abriéndola con doble clic.
//
// Cada lugar: { id, nombre, es?, tipo, zona, x, y, aprox?, texto, libros: [ids de js/libros.js] }
// x, y: píxeles sobre la imagen original. aprox: true si el mapa no lo marca y la posición es estimada.

window.MUNDODISCO_LUGARES = {
    imagen: { src: 'images/Mapa_DiscWorld.png', ancho: 1000, alto: 978 },
    eje: { x: 499, y: 487 },   // Cori Celesti: centro del disco

    tipos: {
        ciudad:  { nombre: 'Ciudad',             icono: '●' },
        pais:    { nombre: 'País o región',      icono: '◆' },
        paraje:  { nombre: 'Montaña, valle, bosque', icono: '▲' },
        isla:    { nombre: 'Isla o continente',  icono: '◼' }
    },

    zonas: {
        sto:     { nombre: 'Llanuras de Sto y el Mar Circular', color: '#3F7D3A' },
        eje:     { nombre: 'Montañas del Eje y Überwald',       color: '#8A5A2B' },
        sur:     { nombre: 'Klatch y el sur',                   color: '#C7792A' },
        lejanas: { nombre: 'Tierras lejanas',                   color: '#2F6F8F' }
    },

    lugares: [
        // ===== Llanuras de Sto y el Mar Circular =====
        { id: 'ankh-morpork', nombre: 'Ankh-Morpork', tipo: 'ciudad', zona: 'sto', x: 480, y: 672, aprox: true,
          texto: 'La ciudad más grande del Mundodisco, a orillas del Mar Circular y partida en dos por el río Ankh, tan espeso que se puede caminar sobre él. La gobierna el Patricio, Lord Vetinari, con una tiranía tan eficaz que nadie quiere sustituirla. Aquí transcurre la mayor parte de las novelas de la Guardia, de Moist von Lipwig y de la Universidad Invisible. Este mapa no la marca: la posición es aproximada.',
          libros: ['guards-guards', 'men-at-arms', 'feet-of-clay', 'night-watch', 'the-truth', 'going-postal', 'making-money', 'unseen-academicals', 'soul-music', 'hogfather', 'maskerade'] },
        { id: 'sto-plains', nombre: 'Sto Plains', es: 'Llanuras de Sto', tipo: 'pais', zona: 'sto', x: 485, y: 640,
          texto: 'Llanura fértil de coles y ciudades-estado pequeñas (Sto Lat, Quirm, Sto Helit…) bajo la sombra económica de Ankh-Morpork. El recuadro rojo del mapa marca esta zona: es el «corazón» de la mayoría de las novelas. En Sto Lat reina la princesa Keli de «Mort», y en la costa está Holy Wood, la colina donde nace el cine.',
          libros: ['mort', 'moving-pictures', 'raising-steam'] },
        { id: 'skund', nombre: 'Skund', es: 'Bosque de Skund', tipo: 'paraje', zona: 'sto', x: 527, y: 630,
          texto: 'Bosque cuyo nombre significa, en el idioma local, «tu dedo, idiota»: es lo que respondieron los nativos cuando un explorador señaló el lugar y les preguntó cómo se llamaba. En él hay árboles que hablan y la casita de pan de jengibre que Rincewind y Dosflores visitan.',
          libros: ['light-fantastic'] },
        { id: 'leshp', nombre: 'Leshp', tipo: 'isla', zona: 'sto', x: 483, y: 696,
          texto: 'Isla que emerge de repente en mitad del Mar Circular, entre Ankh-Morpork y Klatch. Ambos países la reclaman y la disputa desemboca en una guerra absurda. Tiene un pasado inquietante y vuelve a hundirse con la misma facilidad con que salió.',
          libros: ['jingo'] },
        { id: 'llamedos', nombre: 'Llamedos', tipo: 'pais', zona: 'sto', x: 400, y: 620,
          texto: 'País lluvioso, parodia de Gales, donde los bardos y los coros de voces graves son una institución (su nombre, leído al revés, es un chiste en inglés). De allí viene Imp y Celyn, el joven arpista que acaba tocando «música con rocas dentro».',
          libros: ['soul-music'] },

        // ===== Montañas del Eje y Überwald =====
        { id: 'cori-celesti', nombre: 'Cori Celesti', tipo: 'paraje', zona: 'eje', x: 499, y: 487,
          texto: 'Pico de diez millas de altura situado justo en el Eje, el centro del disco. En su cima está Dunmanifestin, el palacio de los dioses, donde juegan a las vidas de los mortales. Las líneas concéntricas del mapa están centradas aquí: cuanto más cerca de Cori Celesti, más fría y mágica es la tierra.',
          libros: ['small-gods', 'last-hero'] },
        { id: 'ramtops', nombre: 'Ramtops', es: 'Montañas del Carnero', tipo: 'paraje', zona: 'eje', x: 490, y: 560,
          texto: 'Gran cordillera que rodea el Eje, tan cargada de magia que el tiempo y la realidad se comportan de forma extraña. Hay pueblos de brujas, monasterios como el de los Monjes de la Historia y aldeas como Bad Ass, donde nace Esk. No muy lejos están las colinas calizas de Tiffany Dolorido (the Chalk).',
          libros: ['equal-rites', 'thief-of-time', 'wee-free-men', 'hat-full-of-sky'] },
        { id: 'lancre', nombre: 'Lancre', tipo: 'pais', zona: 'eje', x: 495, y: 596,
          texto: 'Pequeño reino de montaña en las Ramtops, «más vertical que horizontal». Lo protegen, quieran o no sus reyes, Yaya Ceravieja y Tata Ogg. Tiene castillo, un rey bienintencionado (Verence II), elfos a la vuelta de las piedras y una población muy testaruda.',
          libros: ['wyrd-sisters', 'lords-and-ladies', 'carpe-jugulum', 'maskerade', 'shepherds-crown', 'nanny-ogg', 'sea-little-fishes'] },
        { id: 'koom-valley', nombre: 'Koom Valley', es: 'Valle de Koom', tipo: 'paraje', zona: 'eje', x: 484, y: 544,
          texto: 'Escenario de la batalla más famosa entre enanos y trolls, en la que ambos bandos dicen haber sido emboscados por el otro. Siglos después, el recuerdo de Koom sigue encendiendo los ánimos en las calles de Ankh-Morpork.',
          libros: ['thud'] },
        { id: 'uberwald', nombre: 'Überwald', tipo: 'pais', zona: 'eje', x: 603, y: 503,
          texto: 'Inmensa región de bosques oscuros, castillos y nieblas: la Transilvania del Mundodisco. La habitan vampiros, hombres lobo, Igors y enanos, en un equilibrio político siempre a punto de romperse. Es lo más parecido a una tierra salvaje cerca del Eje.',
          libros: ['fifth-elephant', 'carpe-jugulum', 'raising-steam'] },
        { id: 'bonk', nombre: 'Bonk / Schmaltzberg', tipo: 'ciudad', zona: 'eje', x: 560, y: 549,
          texto: 'Ciudad doble de Überwald, centro de las minas de grasa del quinto elefante que, según la leyenda, cayó del lomo de A\'Tuin. Allí se celebra la coronación del Rey Enano a la que Vimes acude como embajador.',
          libros: ['fifth-elephant'] },
        { id: 'borogravia', nombre: 'Borogravia', tipo: 'pais', zona: 'eje', x: 647, y: 610,
          texto: 'País pequeño, pobre y siempre en guerra, gobernado por una duquesa a la que nadie ve y por un dios, Nuggan, que prohíbe cosas cada semana (el chocolate, el color azul, los gatos…). Polly Perks se alista en su ejército.',
          libros: ['monstrous-regiment'] },
        { id: 'zlobenia', nombre: 'Zlobenia', tipo: 'pais', zona: 'eje', x: 640, y: 633,
          texto: 'Vecino y enemigo histórico de Borogravia. La guerra entre ambos países por un río fronterizo es el telón de fondo de «Regimiento monstruoso».',
          libros: ['monstrous-regiment'] },

        // ===== Klatch y el sur =====
        { id: 'klatch', nombre: 'Klatch', tipo: 'pais', zona: 'sur', x: 450, y: 776,
          texto: 'Gran país desértico al otro lado del Mar Circular, inspirado en el mundo árabe y mediterráneo: café fortísimo, desierto, ciencia antigua y una corte refinada. Su capital es Al-Khali. Rival histórico de Ankh-Morpork y frente a ella en la crisis de Leshp.',
          libros: ['jingo', 'soul-music'] },
        { id: 'omnia', nombre: 'Omnia', tipo: 'pais', zona: 'sur', x: 542, y: 752,
          texto: 'Teocracia dedicada al Gran Dios Om, con una Inquisición temible y la convicción oficial de que el mundo es una esfera. En su capital, Kom, el novicio Brutha descubre que su dios es ahora una tortuga.',
          libros: ['small-gods', 'carpe-jugulum'] },
        { id: 'ephebe', nombre: 'Ephebe', es: 'Efebo', tipo: 'pais', zona: 'sur', x: 512, y: 752,
          texto: 'Ciudad-estado inspirada en la Grecia clásica: democracia, tiranos elegidos, baños públicos y filósofos que discuten (y se pelean) por todo. Enemiga de Omnia y vecina de Djelibeybi.',
          libros: ['small-gods', 'pyramids'] },
        { id: 'djelibeybi', nombre: 'Djelibeybi', tipo: 'pais', zona: 'sur', x: 505, y: 764,
          texto: 'El «Reino del Sol», una estrecha franja a orillas del río Djel inspirada en el Antiguo Egipto. Lleva siete mil años sin cambiar nada y construyendo pirámides que, en el Mundodisco, acumulan tiempo de forma peligrosa.',
          libros: ['pyramids'] },
        { id: 'tsort', nombre: 'Tsort', tipo: 'pais', zona: 'sur', x: 492, y: 770,
          texto: 'Antiguo reino vecino y rival de Djelibeybi. Su guerra legendaria contra Ephebe, con un caballo de madera incluido, parodia la guerra de Troya y Rincewind la vive en directo en «Eric».',
          libros: ['eric', 'pyramids'] },
        { id: 'howondaland', nombre: 'Howondaland', tipo: 'pais', zona: 'sur', x: 412, y: 840,
          texto: 'Gran territorio de selvas y sabanas al sur de Klatch, inspirado en el África de las novelas de aventuras coloniales. Aparece sobre todo como lugar lejano de exploradores, cazadores y leyendas.',
          libros: [] },
        { id: 'tezuman', nombre: 'Tezuman', es: 'Imperio Tezumano', tipo: 'pais', zona: 'sur', x: 620, y: 855,
          texto: 'Imperio selvático inspirado en los aztecas, con pirámides escalonadas, sacrificios y un dios llamado Quezovercoatl. Sus súbditos, muy poco entusiastas, son los primeros en recibir a Rincewind y Eric.',
          libros: ['eric'] },

        // ===== Tierras lejanas =====
        { id: 'agatean-empire', nombre: 'Agatean Empire', es: 'Imperio Ágata', tipo: 'pais', zona: 'lejanas', x: 240, y: 275,
          texto: 'Rico imperio del Continente Contrapeso, inspirado en la China y el Japón imperiales, cerrado al exterior por una gran muralla. Allí el oro es tan abundante que sirve de lastre: por eso el continente «equilibra» el disco. Es la patria de Dosflores.',
          libros: ['colour-of-magic', 'interesting-times'] },
        { id: 'hunghung', nombre: 'Hunghung', tipo: 'ciudad', zona: 'lejanas', x: 233, y: 297,
          texto: 'Capital del Imperio Ágata y sede de la Ciudad Prohibida. Escenario de la revolución (muy cortés) y del asalto de la Horda Plateada en «Tiempos interesantes».',
          libros: ['interesting-times'] },
        { id: 'bes-pelargic', nombre: 'Bes Pelargic', tipo: 'ciudad', zona: 'lejanas', x: 226, y: 378,
          texto: 'Puerto principal del Imperio Ágata. De aquí parte Dosflores, el primer turista del Mundodisco, cargado de oro y de una curiosidad infinita.',
          libros: ['colour-of-magic', 'interesting-times'] },
        { id: 'great-wall', nombre: 'Great Wall', es: 'La Gran Muralla', tipo: 'paraje', zona: 'lejanas', x: 381, y: 262,
          texto: 'Muralla que aísla al Imperio Ágata del resto del mundo; más que impedir que entren los bárbaros, sirve para que los súbditos no salgan ni sepan cómo se vive fuera.',
          libros: ['interesting-times'] },
        { id: 'fourecks', nombre: 'Fourecks (XXXX)', es: 'XXXX, el último continente', tipo: 'isla', zona: 'lejanas', x: 713, y: 122,
          texto: 'Continente aislado, seco y extraño, inspirado en Australia: canguros, cerveza, surf y criaturas que matan de mil formas. Se creó aparte del resto del disco y conserva un aire de «sin terminar».',
          libros: ['last-continent'] },
        { id: 'genua', nombre: 'Genua', tipo: 'ciudad', zona: 'lejanas', x: 785, y: 527,
          texto: 'Ciudad inspirada en Nueva Orleans y en los cuentos de hadas, junto a un pantano. Su gobernante obliga a que todo siga el guion de los cuentos, final feliz incluido. Las brujas de Lancre viajan hasta allí.',
          libros: ['witches-abroad'] },
        { id: 'wyrmberg', nombre: 'Wyrmberg', tipo: 'paraje', zona: 'lejanas', x: 322, y: 578,
          texto: 'Montaña al revés —más ancha arriba que abajo— en Hergen, donde viven jinetes que montan dragones imaginarios, reales solo mientras alguien cree en ellos con fuerza.',
          libros: ['colour-of-magic'] },
        { id: 'krull', nombre: 'Krull', tipo: 'isla', zona: 'lejanas', x: 165, y: 858,
          texto: 'Isla situada en el mismo Borde del disco. Sus habitantes recogen lo que cae por la Cascada del Borde con una gran red y sueñan con lanzar una nave para averiguar el sexo de Gran A\'Tuin.',
          libros: ['colour-of-magic'] }
    ]
};

// Datos de la guía de lectura de Mundodisco (basada en la Discworld Reading Order Guide 3.0).
// Se guardan en un .js (no en .json) para que la página funcione también abriéndola con doble clic.
//
// Cada libro: { id, titulo (original), corto (opcional: rótulo del sello), es (título en español, si se conoce), anio, tipo, saga, x, y, resumen }
// x, y: posición del nodo en el mapa (mismas coordenadas que la imagen original).
// tipo: inicio | normal | juvenil | relato | ciencia | ilustrado

window.DISCWORLD = {
    tipos: {
        inicio:   { nombre: 'Novela de inicio',   color: '#E3A21A' },
        normal:   { nombre: 'Novela',             color: '#EFE6A6' },
        juvenil:  { nombre: 'Novela juvenil',     color: '#B565A7' },
        relato:   { nombre: 'Relato corto',       color: '#86B23B' },
        ciencia:  { nombre: 'Libro de ciencia',   color: '#D93A30' },
        ilustrado:{ nombre: 'Libro ilustrado',    color: '#3BB6B0' }
    },

    // Rótulo de cada saga en el mapa: posición y alineación del texto (end = acaba en x).
    sagas: {
        rincewind:  { nombre: 'Rincewind',               x: 335,  y: 660,  ancla: 'end' },
        ciencia:    { nombre: 'La ciencia',              x: 1100, y: 520,  ancla: 'end' },
        industrial: { nombre: 'Revolución industrial',   x: 770,  y: 790,  ancla: 'end' },
        moist:      { nombre: 'Moist von Lipwig',        x: 1150, y: 890,  ancla: 'start', linea: true },
        guardia:    { nombre: 'La Guardia',              x: 335,  y: 985,  ancla: 'end' },
        muerte:     { nombre: 'La Muerte',               x: 335,  y: 1123, ancla: 'end' },
        antiguas:   { nombre: 'Civilizaciones antiguas', x: 335,  y: 1385, ancla: 'end' },
        tiffany:    { nombre: 'Tiffany Dolorido',        x: 990,  y: 1380, ancla: 'end' },
        brujas:     { nombre: 'Las brujas',              x: 335,  y: 1525, ancla: 'end' }
    },

    libros: [
        // ===== Rincewind =====
        { id: 'colour-of-magic', titulo: 'The Colour of Magic', es: 'El color de la magia', anio: 1983, tipo: 'inicio', saga: 'rincewind', x: 395, y: 660,
          resumen: 'Rincewind, un mago fracasado de la Universidad Invisible, recibe el encargo de guiar a Dosflores, el primer turista del Mundodisco, y a su Equipaje andante de madera de peral sabio. Es una sucesión de aventuras que parodia la fantasía heroica de la época; el estilo de Pratchett aún se está formando.' },
        { id: 'light-fantastic', titulo: 'The Light Fantastic', es: 'La luz fantástica', anio: 1986, tipo: 'normal', saga: 'rincewind', x: 520, y: 660,
          resumen: 'Continuación directa del anterior. Una estrella roja amenaza con destruir el Mundodisco y uno de los ocho grandes hechizos está alojado en la cabeza de Rincewind, así que todo el mundo quiere atraparlo. Aparece Cohen el Bárbaro, un héroe octogenario.' },
        { id: 'sourcery', titulo: 'Sourcery', es: 'Rechicero', anio: 1988, tipo: 'normal', saga: 'rincewind', x: 650, y: 660, autor: true,
          resumen: 'Nace un rechicero, el octavo hijo de un octavo hijo de un octavo hijo: una fuente de magia pura capaz de rehacer el mundo. Los magos se lanzan a una guerra de hechiceros y Rincewind, armado con un calcetín lleno de ladrillo, es el único que puede evitar el desastre.' },
        { id: 'eric', titulo: 'Faust Eric', es: 'Eric', anio: 1990, tipo: 'ilustrado', saga: 'rincewind', x: 775, y: 660,
          resumen: 'Eric, un demonólogo adolescente, invoca a un demonio para que le conceda tres deseos… y aparece Rincewind. Parodia de Fausto que los lleva a Tsort (Troya), a una selva maya y al mismísimo Infierno. Edición original ilustrada por Josh Kirby.' },
        { id: 'interesting-times', titulo: 'Interesting Times', es: 'Tiempos interesantes', anio: 1994, tipo: 'normal', saga: 'rincewind', x: 903, y: 660,
          resumen: 'El Imperio Ágata, inspirado en la China imperial, pide «al Gran Mago» y la Universidad envía a Rincewind. Allí lo esperan una revolución muy educada, una conspiración y la Horda Plateada de Cohen, decidida a robar un imperio entero.' },
        { id: 'last-continent', titulo: 'The Last Continent', es: 'El último continente', anio: 1998, tipo: 'normal', saga: 'rincewind', x: 1031, y: 660,
          resumen: 'Rincewind está atrapado en XXXX, un continente que parodia Australia y en el que no llueve. Mientras, los magos de la Universidad buscan una cura para el Bibliotecario y acaban en el pasado remoto del continente. Canguros, cerveza y dioses creadores con poca paciencia.' },
        { id: 'last-hero', titulo: 'The Last Hero', es: 'El último héroe', anio: 2001, tipo: 'ilustrado', saga: 'rincewind', x: 1160, y: 660,
          resumen: 'Cohen y la Horda Plateada escalan a Cori Celesti para devolver el fuego a los dioses… con un explosivo. Si lo consiguen, el mundo entero acabará, así que Rincewind, Zanahoria y Leonardo de Quirm emprenden una misión espacial para impedirlo. Muy ilustrado por Paul Kidby.' },
        { id: 'unseen-academicals', titulo: 'Unseen Academicals', es: 'Académicos invisibles', anio: 2009, tipo: 'normal', saga: 'rincewind', x: 1285, y: 660,
          resumen: 'Para conservar una herencia, la Universidad Invisible debe jugar un partido de fútbol. Una historia sobre el deporte, la moda, el amor y los prejuicios, protagonizada por Nutt, un ser misterioso que trabaja en las velas del sótano. Rincewind es secundario.' },
        { id: 'collegiate-casting-out', titulo: 'A Collegiate Casting-Out of Devilish Devices', corto: 'A Collegiate Casting-Out', anio: 2005, tipo: 'relato', saga: 'rincewind', x: 1413, y: 660,
          resumen: 'Relato breve en el que la Universidad Invisible celebra una reunión para expulsar a una criatura indeseable: la tecnología moderna. Recogido en «A Blink of the Screen».' },
        { id: 'troll-bridge', titulo: 'Troll Bridge', anio: 1992, tipo: 'relato', saga: 'rincewind', x: 775, y: 540,
          resumen: 'Cohen el Bárbaro, ya viejo, va a enfrentarse a un troll bajo un puente para morir como un héroe, pero descubre que el troll tiene sus propios problemas. Un cuento melancólico sobre el final de una época.' },

        // ===== La ciencia =====
        { id: 'science-1', titulo: 'The Science of Discworld', anio: 1999, tipo: 'ciencia', saga: 'ciencia', x: 1160, y: 520,
          resumen: 'Escrito con Ian Stewart y Jack Cohen. Los magos crean por accidente un universo en miniatura —el nuestro, el Proyecto Mundo Redondo— y observan su evolución. Los capítulos de novela se alternan con capítulos de divulgación científica.' },
        { id: 'science-2', titulo: 'The Science of Discworld II: The Globe', corto: 'Science of Discworld II', anio: 2002, tipo: 'ciencia', saga: 'ciencia', x: 1290, y: 520,
          resumen: 'Los elfos se han colado en el Mundo Redondo y los magos deben asegurarse de que Shakespeare llegue a nacer. Divulgación sobre la mente humana, el lenguaje y el poder de las historias.' },
        { id: 'science-3', titulo: "The Science of Discworld III: Darwin's Watch", corto: 'Science of Discworld III', anio: 2005, tipo: 'ciencia', saga: 'ciencia', x: 1420, y: 520,
          resumen: 'En el Mundo Redondo, Darwin ha escrito el libro equivocado. Los magos intentan que «El origen de las especies» se publique. Evolución, tiempo y teología natural.' },
        { id: 'science-4', titulo: 'The Science of Discworld IV: Judgement Day', corto: 'Science of Discworld IV', anio: 2013, tipo: 'ciencia', saga: 'ciencia', x: 1548, y: 520,
          resumen: 'Un juicio en Ankh-Morpork decide quién es el dueño del Mundo Redondo. Ciencia, religión y filosofía frente a frente.' },

        // ===== Revolución industrial / Moist =====
        { id: 'moving-pictures', titulo: 'Moving Pictures', es: 'Imágenes en acción', anio: 1990, tipo: 'inicio', saga: 'industrial', x: 830, y: 790,
          resumen: 'Los alquimistas inventan el cine y nace Holy Wood, una fiebre que atrapa a todo el Mundodisco. Pero las imágenes en movimiento atraen a criaturas de las Dimensiones Mazmorra. Parodia del Hollywood clásico.' },
        { id: 'the-truth', titulo: 'The Truth', es: 'La verdad', anio: 2000, tipo: 'normal', saga: 'industrial', x: 975, y: 790,
          resumen: 'William de Worde funda por casualidad el primer periódico de Ankh-Morpork, justo cuando alguien intenta derrocar al Patricio. Una novela sobre la prensa, la verdad y lo que la gente quiere leer.' },
        { id: 'monstrous-regiment', titulo: 'Monstrous Regiment', es: 'Regimiento monstruoso', anio: 2003, tipo: 'normal', saga: 'industrial', x: 1103, y: 790,
          resumen: 'Polly se corta el pelo y se alista en el ejército de Borogravia para buscar a su hermano. Pronto descubre que no es la única recluta con secretos. Sátira sobre la guerra, el nacionalismo y los roles de género.' },
        { id: 'going-postal', titulo: 'Going Postal', es: 'Cartas en el asunto', anio: 2004, tipo: 'normal', saga: 'moist', x: 1232, y: 790,
          resumen: 'Moist von Lipwig, estafador profesional, recibe una segunda oportunidad tras su ahorcamiento: dirigir la ruinosa Oficina de Correos. Para salvarla tendrá que competir con el poderoso monopolio de los clacks. Muy buen punto de entrada.' },
        { id: 'making-money', titulo: 'Making Money', es: 'Dinero a mansalva', anio: 2007, tipo: 'normal', saga: 'moist', x: 1358, y: 790,
          resumen: 'Vetinari pone a Moist al frente del Banco Real y de la Ceca. El nuevo presidente del banco es un perro, la familia rival quiere recuperar el control y el oro quizá no sea tan necesario como todos creen.' },
        { id: 'raising-steam', titulo: 'Raising Steam', es: 'A todo vapor', anio: 2013, tipo: 'normal', saga: 'moist', x: 1485, y: 790,
          resumen: 'Llega el ferrocarril y Moist debe convertirlo en realidad mientras los extremistas enanos sabotean el progreso. Reúne a muchos personajes de la serie.' },
        { id: 'mrs-bradshaw', titulo: "Mrs Bradshaw's Handbook", anio: 2014, tipo: 'ilustrado', saga: 'moist', x: 1563, y: 905,
          resumen: 'Guía ilustrada para viajar en el nuevo ferrocarril de Ankh-Morpork y Sto Lat: estaciones, costumbres y curiosidades locales. Complemento de «Raising Steam».' },

        // ===== La Guardia =====
        { id: 'guards-guards', titulo: 'Guards! Guards!', es: '¡Guardias! ¿Guardias?', anio: 1989, tipo: 'inicio', saga: 'guardia', x: 393, y: 985,
          resumen: 'Una sociedad secreta invoca un dragón para colocar en el trono a un rey títere, y solo la desprestigiada Guardia Nocturna puede detenerlo: el alcohólico capitán Vimes, Colon, Nobby y el recluta Zanahoria, un humano criado por enanos. Uno de los mejores puntos de partida.' },
        { id: 'men-at-arms', titulo: 'Men at Arms', es: 'Hombres de armas', anio: 1993, tipo: 'normal', saga: 'guardia', x: 523, y: 985,
          resumen: 'Vimes está a punto de casarse y retirarse cuando aparece un arma nueva y letal, el «gonne». La Guardia, ahora con reclutas troll, enana y una mujer lobo, investiga una serie de asesinatos relacionados con la sucesión al trono.' },
        { id: 'feet-of-clay', titulo: 'Feet of Clay', es: 'Pies de barro', anio: 1996, tipo: 'normal', saga: 'guardia', x: 650, y: 985,
          resumen: 'Alguien está envenenando al Patricio y aparecen ancianos asesinados. Las pistas señalan a los gólems, criaturas de arcilla sin voluntad. Una novela policiaca sobre la libertad y la identidad.' },
        { id: 'jingo', titulo: 'Jingo', es: 'Voto a bríos', anio: 1997, tipo: 'normal', saga: 'guardia', x: 776, y: 985,
          resumen: 'Emerge del mar una isla disputada entre Ankh-Morpork y Klatch y ambas ciudades se encaminan a la guerra. Vimes intenta detener un conflicto que nadie quiere admitir que es absurdo. Sátira del patrioterismo.' },
        { id: 'fifth-elephant', titulo: 'The Fifth Elephant', es: 'El quinto elefante', anio: 1999, tipo: 'normal', saga: 'guardia', x: 903, y: 985,
          resumen: 'Vimes viaja como embajador a Überwald para la coronación del rey enano y se ve envuelto en el robo de la Piedra de Scone, intrigas políticas y una cacería de hombres lobo. Angua y Zanahoria tienen su propia trama.' },
        { id: 'night-watch', titulo: 'Night Watch', es: 'Ronda de noche', anio: 2002, tipo: 'normal', saga: 'guardia', x: 1031, y: 985,
          resumen: 'Un accidente mágico manda a Vimes treinta años atrás, a la víspera de una revolución, donde debe ocupar el lugar del sargento que le enseñó el oficio. Considerada por muchos la mejor novela de la serie.' },
        { id: 'thud', titulo: 'Thud!', es: '¡Zas!', anio: 2005, tipo: 'normal', saga: 'guardia', x: 1157, y: 985,
          resumen: 'Se acerca el aniversario de la batalla del Valle de Koom y la tensión entre enanos y trolls estalla con un asesinato. Vimes investiga mientras procura llegar a casa cada día a las seis para leerle a su hijo «¿Dónde está mi vaca?».' },
        { id: 'snuff', titulo: 'Snuff', anio: 2011, tipo: 'normal', saga: 'guardia', x: 1287, y: 985,
          resumen: 'Vimes se va de vacaciones al campo, obligado por su esposa, y descubre un crimen contra los goblins, una especie a la que nadie considera persona. Aunque está fuera de su jurisdicción, no puede dejar de ser policía.' },
        { id: 'theatre-of-cruelty', titulo: 'Theatre of Cruelty', anio: 1993, tipo: 'relato', saga: 'guardia', x: 460, y: 880,
          resumen: 'Relato breve: la Guardia investiga un asesinato en un teatro de marionetas. Una parodia de la novela negra con Vimes, Zanahoria y Angua.' },
        { id: 'wheres-my-cow', titulo: "Where's My Cow?", anio: 2005, tipo: 'ilustrado', saga: 'guardia', x: 1090, y: 1110,
          resumen: 'El cuento infantil que Vimes lee a su hijo en «¡Zas!». Vimes acaba reescribiéndolo con los ruidos y personajes de Ankh-Morpork. Ilustrado por Melvyn Grant.' },
        { id: 'minutes-scouts', titulo: 'Minutes of the Meeting to Form the Proposed Ankh-Morpork Federation of Scouts', corto: 'Federation of Scouts', tipo: 'relato', saga: 'guardia', x: 1222, y: 1115,
          resumen: 'Relato breve en forma de acta: los ciudadanos de Ankh-Morpork intentan fundar una organización de exploradores, con resultados caóticos. Recogido en «A Blink of the Screen».' },
        { id: 'world-of-poo', titulo: 'The World of Poo', anio: 2012, tipo: 'ilustrado', saga: 'guardia', x: 1347, y: 1115,
          resumen: 'El libro que el joven Sam Vimes adora en «Snuff»: un niño de visita en Ankh-Morpork descubre todo lo que se puede saber sobre la caca. Libro ilustrado.' },

        // ===== La Muerte =====
        { id: 'mort', titulo: 'Mort', es: 'Mort', anio: 1987, tipo: 'inicio', saga: 'muerte', x: 393, y: 1123,
          resumen: 'La Muerte toma como aprendiz a Mort, un chico desgarbado. Cuando Mort se niega a llevarse el alma de una princesa, la realidad empieza a resquebrajarse. Primera novela en que la Muerte es protagonista y gran punto de partida.' },
        { id: 'reaper-man', titulo: 'Reaper Man', es: 'Segador', anio: 1991, tipo: 'normal', saga: 'muerte', x: 522, y: 1123,
          resumen: 'Los Auditores jubilan a la Muerte, que se va a trabajar como jornalero en una granja. Sin Muerte, la fuerza vital se acumula y los muertos no descansan, como el mago Windle Poons, que asiste a su propio funeral.' },
        { id: 'soul-music', titulo: 'Soul Music', es: 'Soul Music', anio: 1994, tipo: 'normal', saga: 'muerte', x: 650, y: 1123,
          resumen: 'Llega la «música con rocas dentro» y arrasa en Ankh-Morpork. Mientras la Muerte se toma unas vacaciones, su nieta Susan debe ocupar su puesto. Homenaje al rock and roll.' },
        { id: 'hogfather', titulo: 'Hogfather', es: 'Papá Puerco', anio: 1996, tipo: 'normal', saga: 'muerte', x: 776, y: 1123,
          resumen: 'Papá Puerco, el Papá Noel del Mundodisco, ha desaparecido y la Muerte se pone la barba para repartir regalos. Susan investiga una conspiración de los Auditores. Reflexión sobre por qué necesitamos creer en pequeñas mentiras.' },
        { id: 'thief-of-time', titulo: 'Thief of Time', es: 'Ladrón del tiempo', anio: 2001, tipo: 'normal', saga: 'muerte', x: 903, y: 1123,
          resumen: 'Un relojero construye un reloj perfecto que puede detener el tiempo. Los Monjes de la Historia envían a un aprendiz y a su maestro barrendero a impedirlo, y Susan vuelve a intervenir. Conecta con los Monjes de la Historia de «Ronda de noche».' },

        // ===== Civilizaciones antiguas =====
        { id: 'pyramids', titulo: 'Pyramids', es: 'Pirámides', anio: 1989, tipo: 'inicio', saga: 'antiguas', x: 393, y: 1385,
          resumen: 'Teppic, heredero de un pequeño reino que parodia el Antiguo Egipto, se forma como asesino en Ankh-Morpork. Al volver como faraón, descubre que la construcción de una pirámide colosal está doblando la realidad. Novela independiente.' },
        { id: 'small-gods', titulo: 'Small Gods', es: 'Dioses menores', anio: 1992, tipo: 'normal', saga: 'antiguas', x: 522, y: 1385,
          resumen: 'El gran dios Om se manifiesta como una tortuga y descubre que solo un novicio, Brutha, cree de verdad en él. Una reflexión sobre la fe, la religión organizada y la filosofía. Independiente y de las mejores.' },
        { id: 'death-and-what-comes-next', titulo: 'Death and What Comes Next', anio: 2002, tipo: 'relato', saga: 'antiguas', x: 458, y: 1265,
          resumen: 'Relato breve: la Muerte viene a buscar a un filósofo que intenta escaparse con argumentos de física cuántica. La Muerte tiene respuesta para todo.' },

        // ===== Tiffany Dolorido =====
        { id: 'wee-free-men', titulo: 'The Wee Free Men', es: 'Los pequeños hombres libres', anio: 2003, tipo: 'juvenil', saga: 'tiffany', x: 1050, y: 1380,
          resumen: 'Tiffany Dolorido, una niña de nueve años de las tierras de pasto, armada con una sartén, se enfrenta a la Reina de las Hadas para rescatar a su hermano. La ayudan los Nac Mac Feegle, pequeños hombres azules y pendencieros.' },
        { id: 'hat-full-of-sky', titulo: 'A Hat Full of Sky', es: 'Un sombrero de cielo', anio: 2004, tipo: 'juvenil', saga: 'tiffany', x: 1177, y: 1380,
          resumen: 'Tiffany, con once años, empieza su aprendizaje de bruja en las montañas. Una criatura incorpórea, el hiver, la persigue para poseerla. Conoce a Yaya Ceravieja.' },
        { id: 'wintersmith', titulo: 'Wintersmith', anio: 2006, tipo: 'juvenil', saga: 'tiffany', x: 1305, y: 1380,
          resumen: 'Tiffany se mete en la Danza Oscura entre estaciones y el espíritu del Invierno se enamora de ella. Si no lo arregla, el invierno no terminará nunca.' },
        { id: 'i-shall-wear-midnight', titulo: 'I Shall Wear Midnight', es: 'Me vestiré de medianoche', anio: 2010, tipo: 'juvenil', saga: 'tiffany', x: 1430, y: 1380,
          resumen: 'Tiffany, ya bruja de su comarca, se enfrenta a la desconfianza de la gente y a un espíritu antiguo que aviva el odio hacia las brujas. Su viaje la lleva a Ankh-Morpork.' },
        { id: 'shepherds-crown', titulo: "The Shepherd's Crown", es: 'La corona del pastor', anio: 2015, tipo: 'juvenil', saga: 'tiffany', x: 1565, y: 1380,
          resumen: 'Última novela de Pratchett. Ha muerto una figura clave entre las brujas y Tiffany debe asumir una gran responsabilidad cuando los elfos aprovechan la debilidad del mundo para invadirlo.' },
        { id: 'amazing-maurice', titulo: 'The Amazing Maurice and his Educated Rodents', corto: 'The Amazing Maurice', es: 'El asombroso Mauricio y sus roedores sabios', anio: 2001, tipo: 'juvenil', saga: 'tiffany', x: 982, y: 1260,
          resumen: 'Un gato parlante, un chico flautista y una banda de ratas inteligentes timan a los pueblos con el truco del flautista de Hamelín, hasta que en un pueblo encuentran algo mucho más oscuro. Novela juvenil independiente.' },

        // ===== Las brujas =====
        { id: 'equal-rites', titulo: 'Equal Rites', es: 'Ritos iguales', anio: 1987, tipo: 'inicio', saga: 'brujas', x: 393, y: 1525,
          resumen: 'Un mago moribundo pasa su poder a un recién nacido… que resulta ser una niña, Eskarina. Yaya Ceravieja la lleva a la Universidad Invisible, donde no admiten mujeres. Primera aparición de Yaya.' },
        { id: 'wyrd-sisters', titulo: 'Wyrd Sisters', es: 'Brujerías', anio: 1988, tipo: 'normal', saga: 'brujas', x: 522, y: 1525,
          resumen: 'Yaya Ceravieja, Tata Ogg y Magrat forman un aquelarre en Lancre. Un rey es asesinado y su heredero escondido entre cómicos. Parodia de Macbeth y Hamlet; buen punto de partida para las brujas.' },
        { id: 'witches-abroad', titulo: 'Witches Abroad', es: 'Brujas de viaje', anio: 1991, tipo: 'normal', saga: 'brujas', x: 648, y: 1525,
          resumen: 'Magrat hereda una varita de hada madrina y las tres brujas viajan a Genua para impedir que una joven se case con un príncipe. Una hada madrina obsesionada con que todo siga el guion de los cuentos les sale al paso.' },
        { id: 'lords-and-ladies', titulo: 'Lords and Ladies', es: 'Lores y damas', anio: 1992, tipo: 'normal', saga: 'brujas', x: 778, y: 1525,
          resumen: 'Magrat va a casarse con el rey Verence en pleno solsticio, cuando la frontera con el reino de los elfos se debilita. Los elfos no son nada adorables. Yaya se enfrenta a su pasado.' },
        { id: 'maskerade', titulo: 'Maskerade', es: 'Mascarada', anio: 1995, tipo: 'normal', saga: 'brujas', x: 905, y: 1525,
          resumen: 'Yaya y Tata Ogg viajan a la Ópera de Ankh-Morpork para reclutar a Agnes Nitt, una joven con una voz prodigiosa. Allí un fantasma enmascarado mata a la gente. Parodia de El fantasma de la ópera.' },
        { id: 'carpe-jugulum', titulo: 'Carpe Jugulum', es: 'Carpe Jugulum', anio: 1998, tipo: 'normal', saga: 'brujas', x: 1030, y: 1525,
          resumen: 'El rey de Lancre invita a una familia de vampiros modernos, que no temen ni al ajo ni al sol, al bautizo de su hija. Las brujas tendrán que defender el reino mientras Yaya duda de sí misma.' },
        { id: 'nanny-ogg', titulo: "Nanny Ogg's Cookbook", anio: 1999, tipo: 'ilustrado', saga: 'brujas', x: 838, y: 1640,
          resumen: 'Recetario ilustrado de Tata Ogg, con platos de Lancre, consejos de etiqueta y la sabiduría popular, algo picante, de la bruja más alegre del Mundodisco.' },
        { id: 'sea-little-fishes', titulo: 'The Sea and Little Fishes', anio: 1998, tipo: 'relato', saga: 'brujas', x: 975, y: 1640,
          resumen: 'Relato breve: las demás brujas le piden a Yaya Ceravieja que no participe en las pruebas de brujería, porque siempre gana. Yaya decide ser amable, y eso asusta a todo el mundo.' }
    ],

    // Conexiones: [origen, destino, tipo] — tipo 'directa' (línea continua) o 'menor' (punteada)
    // curva (opcional): desplaza el punto de control de la curva en píxeles.
    conexiones: [
        ['colour-of-magic', 'light-fantastic', 'directa'],
        ['light-fantastic', 'sourcery', 'directa'],
        ['sourcery', 'eric', 'directa'],
        ['eric', 'interesting-times', 'directa'],
        ['interesting-times', 'last-continent', 'directa'],
        ['last-continent', 'last-hero', 'directa'],
        ['last-hero', 'unseen-academicals', 'directa'],
        ['unseen-academicals', 'collegiate-casting-out', 'menor'],
        ['sourcery', 'troll-bridge', 'menor', -40],
        ['troll-bridge', 'interesting-times', 'menor', -40],
        ['eric', 'moving-pictures', 'menor', -40],
        ['interesting-times', 'moving-pictures', 'menor', 30],
        ['last-continent', 'science-1', 'menor', -40],
        ['science-1', 'science-2', 'directa'],
        ['science-2', 'science-3', 'directa'],
        ['science-3', 'science-4', 'directa'],

        ['moving-pictures', 'the-truth', 'menor'],
        ['unseen-academicals', 'the-truth', 'menor', 40],
        ['the-truth', 'monstrous-regiment', 'menor'],
        ['monstrous-regiment', 'going-postal', 'directa'],
        ['going-postal', 'making-money', 'directa'],
        ['making-money', 'raising-steam', 'directa'],
        ['raising-steam', 'mrs-bradshaw', 'directa'],
        ['the-truth', 'fifth-elephant', 'menor', 40],
        ['the-truth', 'thud', 'menor', -40],
        ['monstrous-regiment', 'thud', 'menor', 30],

        ['guards-guards', 'men-at-arms', 'directa'],
        ['men-at-arms', 'feet-of-clay', 'directa'],
        ['feet-of-clay', 'jingo', 'directa'],
        ['jingo', 'fifth-elephant', 'directa'],
        ['fifth-elephant', 'night-watch', 'directa'],
        ['night-watch', 'thud', 'directa'],
        ['thud', 'snuff', 'directa'],
        ['guards-guards', 'theatre-of-cruelty', 'menor'],
        ['theatre-of-cruelty', 'men-at-arms', 'menor'],
        ['thud', 'wheres-my-cow', 'directa'],
        ['thud', 'minutes-scouts', 'menor'],
        ['snuff', 'minutes-scouts', 'menor'],
        ['snuff', 'world-of-poo', 'directa'],

        ['mort', 'reaper-man', 'directa'],
        ['reaper-man', 'soul-music', 'directa'],
        ['soul-music', 'hogfather', 'directa'],
        ['hogfather', 'thief-of-time', 'directa'],
        ['thief-of-time', 'night-watch', 'menor', 30],

        ['pyramids', 'small-gods', 'menor'],
        ['pyramids', 'death-and-what-comes-next', 'menor'],
        ['death-and-what-comes-next', 'small-gods', 'menor'],
        ['small-gods', 'thief-of-time', 'menor', 40],

        ['amazing-maurice', 'wee-free-men', 'menor'],
        ['wee-free-men', 'hat-full-of-sky', 'directa'],
        ['hat-full-of-sky', 'wintersmith', 'directa'],
        ['wintersmith', 'i-shall-wear-midnight', 'directa'],
        ['i-shall-wear-midnight', 'shepherds-crown', 'directa'],
        ['carpe-jugulum', 'wee-free-men', 'menor', -30],

        ['equal-rites', 'wyrd-sisters', 'menor'],
        ['wyrd-sisters', 'witches-abroad', 'directa'],
        ['witches-abroad', 'lords-and-ladies', 'directa'],
        ['lords-and-ladies', 'maskerade', 'directa'],
        ['maskerade', 'carpe-jugulum', 'directa'],
        ['maskerade', 'nanny-ogg', 'directa'],
        ['maskerade', 'sea-little-fishes', 'menor']
    ],

    // Rótulos de rutas (texto sobre el mapa)
    rotulos: [
        { texto: 'Monjes de la Historia', x: 700, y: 1250, giro: -22 },
        { texto: 'Empieza aquí, según el autor ↘', x: 625, y: 592, giro: 0, pequeno: true, ancla: 'end' }
    ]
};

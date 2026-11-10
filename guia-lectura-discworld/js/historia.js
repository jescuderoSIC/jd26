// Datos de la cronología del Mundodisco (timeline-de-mundodisco.html).
// Los libros se citan por su id de js/libros.js.
// Pratchett nunca fijó fechas internas exactas: todo lo "interno" es relativo y aproximado.

window.MUNDODISCO_HISTORIA = {
    // Colores por saga (los mismos nombres de saga que js/libros.js)
    coloresSaga: {
        rincewind: '#C9962A', ciencia: '#D93A30', industrial: '#C7792A', moist: '#A0522D',
        guardia: '#2F6F8F', muerte: '#5B5F7E', antiguas: '#8A5A2B', tiffany: '#B565A7', brujas: '#3F7D3A'
    },

    // Hitos de la vida del autor, intercalados en la línea de publicación
    autor: [
        { anio: 1948, texto: 'Nace Terry Pratchett en Beaconsfield (Inglaterra).' },
        { anio: 1971, texto: 'Publica su primera novela, «The Carpet People», fuera del Mundodisco.' },
        { anio: 2007, texto: 'Anuncia que padece una forma temprana de alzhéimer. Sigue escribiendo, dictando sus libros.' },
        { anio: 2009, texto: 'Es nombrado caballero (Sir Terry) por sus servicios a la literatura.' },
        { anio: 2015, texto: 'Muere el 12 de marzo. «The Shepherd\'s Crown» se publica después, ese mismo año.' }
    ],

    // El pasado del disco: de lo más remoto a lo más cercano
    pasado: [
        { era: 'Al principio', titulo: 'La creación del universo', libros: ['eric'],
          texto: 'Rincewind y Eric viajan hasta el mismísimo comienzo de todo y asisten al trabajo del Creador, que no parece tener muy claro el diseño.' },
        { era: 'Hace muchos milenios', titulo: 'Un continente hecho a mano', libros: ['last-continent'],
          texto: 'Los magos de la Universidad caen en el pasado remoto de XXXX y ven a un dios creador terminando el continente… a su manera.' },
        { era: 'Hace siete mil años', titulo: 'Nace el reino de Djelibeybi', libros: ['pyramids'],
          texto: 'Desde entonces el Reino del Sol no ha cambiado nada: los mismos rituales, los mismos faraones momificados y cada vez más pirámides.' },
        { era: 'Hace siglos', titulo: 'La batalla del Valle de Koom', libros: ['thud'],
          texto: 'Enanos y trolls se enfrentan en una batalla legendaria en la que cada bando asegura que el otro le tendió una emboscada. El rencor dura hasta hoy.' },
        { era: 'Hace mucho tiempo', titulo: 'Brutha y el dios tortuga', libros: ['small-gods'],
          texto: 'En Omnia, un novicio y su dios convertido en tortuga cambian para siempre la religión del país. Sus consecuencias se notan aún en «Carpe Jugulum».' },
        { era: 'Hace unos treinta años', titulo: 'La revolución del 25 de mayo', libros: ['night-watch'],
          texto: 'Barricadas en Ankh-Morpork y un joven Sam Vimes aprendiendo el oficio. Vimes vuelve a vivirla cuando un accidente lo lanza al pasado.' },
        { era: 'Una y otra vez', titulo: 'El tiempo se rompe (y se arregla)', libros: ['thief-of-time'],
          texto: 'Los Monjes de la Historia vigilan que la historia ocurra como debe y, cuando se rompe, la remiendan. Por eso la cronología del disco es un poco elástica.' },
        { era: 'El presente', titulo: 'Las novelas', libros: [],
          texto: 'La mayoría de los libros ocurren en un «presente» que avanza: cada novela de la Guardia o de Moist sucede unos años después de la anterior.' }
    ],

    // Inventos y cambios: el Mundodisco vive su propia revolución industrial
    inventos: [
        { libro: 'colour-of-magic', nombre: 'El iconógrafo', texto: 'Una cámara con un diablillo dentro que pinta muy deprisa lo que ve.' },
        { libro: 'moving-pictures', nombre: 'El cine', texto: 'Los alquimistas inventan las imágenes en movimiento y nace Holy Wood.' },
        { libro: 'men-at-arms', nombre: 'El «gonne»', texto: 'La primera arma de fuego: un invento tan peligroso que nadie debería tenerlo.' },
        { libro: 'soul-music', nombre: 'Música con rocas dentro', texto: 'Llega el rock and roll. En la Universidad empieza a funcionar Hex, un ordenador de hormigas.' },
        { libro: 'fifth-elephant', nombre: 'Los clacks', texto: 'Torres de semáforos que transmiten mensajes a través del continente: el telégrafo del disco.' },
        { libro: 'the-truth', nombre: 'La imprenta y la prensa', texto: 'Tipos móviles y el primer periódico de Ankh-Morpork.' },
        { libro: 'going-postal', nombre: 'Los sellos de correos', texto: 'Moist resucita el correo e inventa el sello para competir con los clacks.' },
        { libro: 'making-money', nombre: 'El papel moneda', texto: 'Dinero que no se respalda con oro, sino con la confianza en la ciudad.' },
        { libro: 'unseen-academicals', nombre: 'El fútbol con reglas', texto: 'El juego callejero se convierte en deporte organizado.' },
        { libro: 'raising-steam', nombre: 'El ferrocarril', texto: 'La locomotora de vapor llega para cambiarlo todo.' }
    ],

    // Vidas de los personajes, libro a libro (orden de lectura de su saga)
    personajes: [
        { nombre: 'Sam Vimes', saga: 'guardia', etapas: [
            ['guards-guards', 'Capitán de la Guardia Nocturna, borracho y desengañado'],
            ['men-at-arms', 'Se casa con Lady Sybil y acaba al mando de la Guardia'],
            ['feet-of-clay', 'Sir Samuel Vimes, comandante'],
            ['jingo', 'Nombrado duque de Ankh'],
            ['fifth-elephant', 'Embajador en Überwald'],
            ['night-watch', 'Nace su hijo; él revive su juventud'],
            ['thud', 'Lee a su hijo cada tarde a las seis'],
            ['snuff', 'De vacaciones, pero sin dejar de ser policía']
        ] },
        { nombre: 'Tiffany Dolorido', saga: 'tiffany', etapas: [
            ['wee-free-men', '9 años: se enfrenta a la Reina de las Hadas con una sartén'],
            ['hat-full-of-sky', '11 años: aprendiz de bruja en las montañas'],
            ['wintersmith', '13 años: el Invierno se enamora de ella'],
            ['i-shall-wear-midnight', '16 años: bruja de su comarca'],
            ['shepherds-crown', 'Asume la mayor responsabilidad de su vida']
        ] },
        { nombre: 'Rincewind', saga: 'rincewind', etapas: [
            ['colour-of-magic', 'Mago fracasado y guía del primer turista'],
            ['light-fantastic', 'Huye con un hechizo atrapado en la cabeza'],
            ['sourcery', 'Salva el mundo armado con un calcetín'],
            ['eric', 'Demonio invocado por error'],
            ['interesting-times', 'Enviado al Imperio Ágata'],
            ['last-continent', 'Perdido en XXXX'],
            ['last-hero', 'Viaje al borde del mundo'],
            ['unseen-academicals', 'Profesor de Geografía Cruel e Inusual']
        ] },
        { nombre: 'Las brujas de Lancre', saga: 'brujas', etapas: [
            ['equal-rites', 'Primera aparición de Yaya Ceravieja'],
            ['wyrd-sisters', 'Se forma el aquelarre: Yaya, Tata y Magrat'],
            ['witches-abroad', 'Viaje a Genua'],
            ['lords-and-ladies', 'Magrat se casa con el rey Verence'],
            ['maskerade', 'Agnes Nitt ocupa el lugar de Magrat'],
            ['carpe-jugulum', 'Bautizo de la hija de Magrat']
        ] },
        { nombre: 'La familia de la Muerte', saga: 'muerte', etapas: [
            ['mort', 'Mort, aprendiz de la Muerte, conoce a Ysabell'],
            ['reaper-man', 'La Muerte, jubilada a la fuerza'],
            ['soul-music', 'Susan, hija de Mort e Ysabell, descubre su herencia'],
            ['hogfather', 'Susan, ahora institutriz'],
            ['thief-of-time', 'Susan, maestra de escuela']
        ] },
        { nombre: 'Moist von Lipwig', saga: 'moist', etapas: [
            ['going-postal', 'Estafador: elige entre la horca y Correos'],
            ['making-money', 'Al frente del Banco Real'],
            ['raising-steam', 'Impulsa el ferrocarril']
        ] }
    ]
};

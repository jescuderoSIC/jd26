# TO-DO · Guía de Mundodisco

Páginas que faltan para entender el Mundodisco por completo y tareas de mantenimiento de las que ya existen.
Las páginas están ordenadas por lo mucho que ayudarían a alguien que empieza.

## Páginas nuevas

### Prioridad alta

- [ ] **¿Por dónde empiezo? (recomendador)** · `por-donde-empiezo.html`
  Un test de 4 o 5 preguntas (¿te gusta la novela negra?, ¿prefieres la sátira política o la fantasía?, ¿buscas algo para adolescentes?…) que recomiende un libro de entrada y explique por qué. Es la duda número uno de cualquier lector nuevo y la guía de lectura no la resuelve por sí sola.

- [x] **Ankh-Morpork, la ciudad** · `ankh-morpork.html` — *hecho (11 nov 2026): plano interactivo con 14 barrios y 18 lugares sobre `images/AM_Map_Barrios_web.jpg`*
  Media serie transcurre en esta ciudad. Debería incluir sus barrios, el río Ankh, la Universidad Invisible, el Palacio del Patricio y el Tambor Remendado; los **gremios** (Asesinos, Ladrones, Mendigos, Bufones, Alquimistas, Costureras…) y cómo funciona el crimen «con licencia»; y cómo ha cambiado la ciudad de *The Colour of Magic* a *Raising Steam*. Podría ser otro mapa interactivo con el mismo motor que el de lugares.

- [x] **Glosario del Mundodisco** · `glosario.html` — *hecho (11 nov 2026): 64 términos en 6 categorías*
  Términos que el lector encuentra sin explicación: octarina, narrativium, cabezología (*headology*), clacks, Dimensiones Mazmorra, Auditores, Espacio-B (*L-Space*), «hacia el Eje», Gran A'Tuin, iconógrafo, golem, Igor, etc. Debería tener un buscador y enlaces a los libros donde aparece cada término.

- [ ] **Especies y pueblos** · `especies.html`
  Enanos, trolls, gólems, vampiros (y la Liga de la Templanza), hombres lobo, Igors, goblins, Nac Mac Feegle, elfos, zombis, dragones de pantano… Para cada uno: cómo son, qué conflictos tienen y en qué libros importan. La convivencia entre especies es uno de los grandes temas de la serie.

### Prioridad media

- [ ] **Dioses, religión y creencia** · `dioses.html`
  El panteón de Dunmanifestin (Ío el Ciego, Offler, Destino, la Dama, Anoia…), por qué en el Mundodisco los dioses existen solo mientras alguien cree en ellos, y los personajes antropomórficos que nacen de la fe (Papá Puerco, el Hada de los Dientes, la Muerte…).

- [ ] **La Universidad Invisible** · `universidad-invisible.html`
  El claustro (Archicanciller, Tesorero, Decano, Conferenciante en Runas Recientes, Ponder Stibbons…), la Biblioteca y el Espacio-B, Hex, los rituales y las rivalidades entre magos. Es el contrapunto cómico de muchas sagas.

- [ ] **Citas célebres** · `citas.html`
  Una colección de frases de Pratchett con buscador y filtro por libro o personaje, y la frase original en inglés al lado de la traducción. Ideal también para compartir.

- [ ] **Relaciones entre personajes** · `relaciones.html`
  Un grafo interactivo (familias, alianzas, rivalidades: Vimes y Vetinari, Yaya y Tata, Mort, Ysabell y Susan…). Puede reutilizar los datos de `js/personajes.js`.

- [ ] **Parodias y referencias** · `referencias.html`
  Qué parodia cada libro (Macbeth y Hamlet en *Wyrd Sisters*, *El fantasma de la ópera* en *Maskerade*, Hollywood en *Moving Pictures*, Australia en *The Last Continent*…). Ayuda mucho a disfrutar los chistes que se pierden con la traducción.

### Prioridad baja

- [ ] **Adaptaciones** · `adaptaciones.html`
  Películas para televisión, series de animación, videojuegos, juegos de mesa, teatro y audiolibros, con una valoración de cuáles merecen la pena.

- [ ] **Ediciones en español** · `ediciones.html`
  Título español verificado de cada libro, editorial, traductor y disponibilidad actual. Varios títulos de la guía están puestos de memoria y conviene comprobarlos.

- [ ] **Mi biblioteca / estadísticas de lectura** · `mi-progreso.html`
  A partir de los libros marcados como leídos en la guía: porcentaje por saga, siguiente libro recomendado y logros («has completado la Guardia»).

- [ ] **Cuestionario** · `quiz.html`
  Preguntas de opción múltiple por libro o por saga, para comprobar lo leído. Podría alimentarse de `sabemos-de-mundodisco-conocimiento.md`.

- [ ] **Terry Pratchett** · `autor.html`
  Su vida, su obra fuera del Mundodisco (*Good Omens* con Neil Gaiman, *The Long Earth*, *Nation*…), su lucha contra el alzhéimer y su legado (GNU Terry Pratchett).

## Mantenimiento de lo que ya existe

- [ ] **Verificar los títulos en español** de `js/libros.js` y `js/personajes.js` y añadir los que faltan (*Wintersmith*, *Snuff*, relatos y libros ilustrados).
- [ ] **Comprobar los datos dudosos:** el año de *A Collegiate Casting-Out of Devilish Devices*, el del relato de los Scouts y en qué novelas aparece realmente la Muerte.
- [ ] **Situar Ankh-Morpork con precisión** en el mapa de lugares (ahora es una posición aproximada) y añadir más lugares (Sto Lat, Quirm, la Caliza, Holy Wood, Al-Khali…).
- [ ] **Retratos reales** para Quién es quién: dejar imágenes cuadradas en `images/personajes/` y rellenar el campo `imagen`.
- [ ] **Más personajes** en Quién es quién: Ponder Stibbons, el Tesorero, Albert, Ysabell, la Muerte de las Ratas, Greebo, Reg Shoe, Otto Chriek, Glenda, Dorfl…
- [ ] **Optimizar `images/Mapa_DiscWorld.png`** (2 MB): convertirlo a WebP o JPG para que el mapa cargue antes en el móvil.
- [ ] **Enlaces cruzados que faltan:** desde la ficha de un lugar a los personajes que viven allí, y desde Quién es quién a la cronología de cada personaje.
- [ ] **Imágenes de los enlaces iniciales:** usar «Volver a leer los datos» en cada uno para traer su imagen de vista previa.
- [ ] **Plano de Ankh-Morpork:** el plano es ilustrativo y sin rótulos; si aparece el plano oficial (*The Streets of Ankh-Morpork*), recolocar barrios y edificios. Los barrios sin nombre en la serie llevan nombres descriptivos.

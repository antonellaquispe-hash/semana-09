# React revisado por pruebas — la IA escribe, el verificador decide

## Desarrollo del laboratorio S11 — Comunicación entre componentes

**Alumno:** Michael Montgomery Rosell  
**Título del desarrollo:** Estado compartido, hooks propios y próximos estrenos

La cartelera de la Semana 11 amplía el proyecto S10. `App` conserva los identificadores de favoritas porque los necesitan tanto la cabecera como las tarjetas; a la cabecera le entrega únicamente `favoriteCount`, mientras que cada tarjeta recibe el estado de su película y una función para comunicar el clic. `App` procesa ese evento y muestra el aviso emergente. Así, `MovieCard` no conoce ni controla cómo se presentan los avisos.

El texto inmediato del buscador vive en `App` y se comparte con el buscador del banner. El término aplicado al listado también vive allí, porque lo consumen `MovieList` y el botón «Limpiar filtro» del banner. Ambos controles llaman a la misma operación para limpiar el texto y el filtro; el hook `useDebounce` aplica el retardo a la búsqueda y también desacopla el identificador de recarga en `usePremieres`.

La utilidad `adaptMovie` traduce los nombres del formato de datos externo (`name`, `poster_path`, `overview`, `vote_average`) al modelo de la tarjeta (`title`, `image`, `synopsis`, `rating`). La cartelera existente y los estrenos simulados atraviesan el adaptador. `useWindowSize` escucha cambios del viewport y permite elegir una, dos, tres o cuatro columnas. `usePremieres` administra carga, respuesta y error; `MovieSkeleton` informa la carga, `PremiereCarousel` presenta los estrenos y el estado de error ofrece reintento. Para revisar la vista de error, se puede abrir la aplicación con `?premieresError=1`.

### Árbol de componentes y estado

```text
App
├── Header (links, favoriteCount)
├── Hero (searchText, onSearch, onSearchTextChange, onClearSearch)
│   └── MovieSearch (texto inmediato; useDebounce para aplicar búsqueda)
├── MovieList (películas, filtro aplicado, favoritas)
│   └── MovieCard (estado de favorita y evento de clic)
├── PremiereSection
│   ├── usePremieres → MovieSkeleton | mensaje de error | PremiereCarousel
│   └── PremiereCarousel (índice del elemento visible)
├── Footer
└── Toast (aviso controlado por App)
```

El contador no debe vivir en `Header`: las acciones que cambian favoritas ocurren en las tarjetas, hermanas de la cabecera. Mantener el estado en el ancestro común `App` permite que ambos lados se actualicen a partir de una sola fuente. La cabecera recibe solo el número, no la lista de películas favoritas.

### Observaciones y casos de comprobación

| Caso | Comportamiento esperado |
|---|---|
| Agregar o quitar una favorita | Cambian el botón de la tarjeta, el contador de la cabecera y el aviso emergente; la lista persiste en `localStorage` |
| Escribir y limpiar una búsqueda | El campo y el listado se sincronizan; el retardo lo gestiona `useDebounce` |
| Limpiar desde el banner | Se vacían el campo y el término aplicado, y reaparecen todas las películas |
| Redimensionar la ventana | La cartelera cambia entre una y cuatro columnas según el ancho |
| Cargar estrenos | Se muestra el esqueleto y luego el carrusel de tres títulos |
| Provocar un error | `?premieresError=1` muestra el mensaje y la acción para reintentar |

La biblioteca de interfaz Bootstrap 5.3.3 aporta las utilidades visuales `placeholder` y `placeholder-glow` a los esqueletos; el carrusel conserva los controles y el estado en React para que su navegación sea accesible y predecible. Para ejecutar el proyecto: `npm install`, `npm run dev`; para revisar las suites disponibles: `npm test`; para generar producción: `npm run build`.

### Conclusiones de la Semana 11

Elevar el estado al ancestro compartido permite que cabecera, buscador, banner y tarjetas permanezcan sincronizados sin compartir más datos de los necesarios. Los hooks concentran temporizadores, cambios de tamaño y estados asíncronos fuera de los componentes visuales. El adaptador mantiene una frontera clara entre el formato que entrega un servicio y el modelo estable que presenta la aplicación.

## Desarrollo del laboratorio S10 — Componentes y eventos

**Alumno:** Michael Montgomery Rosell  
**Título del desarrollo:** Búsqueda de películas y favoritos con estado y eventos

La cartelera de la Semana 9 se amplió con un botón reutilizable, búsqueda controlada con retardo y favoritos persistentes. El componente `Button` recibe su contenido por `children` y una variante visual por props. `MovieSearch` mantiene el texto inmediato del campo en su estado y comunica el término al padre tras 350 ms; el formulario permite aplicar la búsqueda sin esperar ese retardo. `MovieList` filtra por título y sinopsis, y muestra una acción para limpiar cuando no encuentra coincidencias.

`App` guarda los identificadores favoritos con `useState` porque su valor afecta a varias tarjetas y al contador general. La función `toggleFavorite` se pasa a `MovieList` y luego a cada `MovieCard`, de modo que el hijo comunica el clic al padre sin modificar directamente el estado ajeno. Un efecto sincroniza la lista con `localStorage` y la recupera cuando vuelve a cargarse la página. El texto de entrada permanece en `MovieSearch`, ya que solo controla ese campo; el término aplicado vive en `App`, donde se comparte con la cartelera.

El botón se reutiliza en la búsqueda, las tarjetas y el estado vacío con distintas variantes. `MovieCard` indica si la película está guardada y ofrece una acción accesible para agregarla o quitarla. En modo de desarrollo, la consola registra el término aplicado después del retardo para distinguirlo de cada pulsación.

### Evidencia y casos de prueba de la Semana 10

| Caso | Resultado | Evidencia |
|---|---|---|
| Variantes del botón | El contenido cambia por `children` y la presentación por `variant` | Prueba automatizada aprobada |
| Búsqueda controlada | El campo refleja cada letra y notifica después de 350 ms | Prueba con temporizador simulado aprobada |
| Filtro de títulos y estado vacío | La cartelera muestra coincidencias o el aviso con opción para limpiar | Prueba automatizada aprobada |
| Favoritos y comunicación hijo a padre | El clic cambia `aria-pressed` y actualiza el contador | Prueba automatizada aprobada |
| Persistencia de favoritos | Al volver a montar la aplicación se recupera la película guardada | Prueba automatizada aprobada |
| Pruebas del duelo S09 | Se mantienen las tareas de componentes anteriores | 43 pruebas aprobadas |
| Suite completa S09 y S10 | Datos, componentes y eventos de la cartelera | 51 pruebas aprobadas en 10 archivos |
| Compilación de producción | Vite genera los archivos en `dist/` | `npm run build` aprobado |

La captura del estado vacío solicitada por la guía debe añadirse desde el navegador local (`http://localhost:5173/`) luego de buscar un título que no exista. La prueba automatizada confirma el mensaje y la acción para limpiar.

El documento resuelto se incluye en `entregables/GLAB-S10-MMONTGOMERY-2026-02-resuelto.docx`.

### Estructura añadida en S10

```text
src/
├── components/
│   ├── Button.jsx
│   ├── MovieSearch.jsx
│   └── components.test.jsx
├── duel/team/
│   ├── AgentMessage.jsx
│   ├── Hero.jsx
│   ├── MovieCard.jsx
│   └── MovieList.jsx
├── App.jsx
└── styles/index.css
```

### Conclusiones de la Semana 10

Separar el estado de la entrada del estado de filtrado permite que el campo responda de inmediato mientras la cartelera espera el retardo antes de actualizarse. El botón compartido evita duplicar marcado y estilos en cada acción, y sus variantes hacen que el mismo componente sirva para búsquedas, favoritos y limpieza de filtros. El ejercicio también mostró la comunicación en ambos sentidos de React: el padre entrega estado y funciones a los hijos, y las tarjetas notifican sus eventos a `App` por medio de la función recibida. Guardar solamente los identificadores de las películas mantiene el almacenamiento pequeño y permite restaurar los favoritos tras una recarga.

## Desarrollo del laboratorio S09 — Cartelera Cine Tecsup

**Alumno:** Michael Montgomery Rosell  
**Título del desarrollo:** Cartelera de cine con componentes funcionales y props

### Evidencia del desarrollo

**Código principal:** `src/App.jsx` compone las partes de la página y entrega los datos mediante props:

```jsx
<Header name="Cine Tecsup" links={links} />
<Hero movie={featuredMovie} />
<MovieList movies={movies} />
<Footer contact={contact} />
```

`MovieList` recorre el arreglo y utiliza el identificador de cada película como clave:

```jsx
<ul className="movie-list">
  {movies.map((movie) => (
    <li key={movie.id}>
      <MovieCard movie={movie} />
    </li>
  ))}
</ul>
```

**Explicación:** `App` lee los datos compartidos de `src/data/movies.js`. `Hero`, `MovieList` y `Footer` reciben solo la información que necesitan. Cada `MovieCard` presenta afiche, título, clasificación, valoración, sinopsis y horarios. `Synopsis` interpola la sinopsis como texto para que HTML de terceros no se interprete como marcado ejecutable.

**Casos de prueba considerados:**

| Caso | Resultado esperado | Estado |
|---|---|---|
| Cargar la cartelera | Aparecen ocho tarjetas con sus datos | Compilación correcta; comprobación visual pendiente |
| Película sin horarios | Se lee «Sin funciones hoy» | Incluido para la película 5; comprobación visual pendiente |
| Ir a Cartelera, Próximamente o Contacto | La navegación llega a la sección correspondiente | Enlaces y destinos implementados |
| Abrir contacto | Teléfono y correo usan `tel:` y `mailto:` | Implementado |
| Mostrar sinopsis con etiquetas HTML | Las etiquetas se muestran como texto y no se ejecutan | Renderizado seguro en JSX; comprobación visual pendiente |
| Compilar para producción | Vite genera los archivos de `dist/` sin errores | Correcto: `npm run build` |

**Capturas solicitadas por la guía:** la captura del resultado en el navegador y la captura de la estructura abierta en el editor aún están pendientes. El servidor local está disponible en `http://localhost:5173/`.

**Estructura del proyecto:**

```text
semana-09/
├── public/posters/          # Afiches de las ocho películas
├── src/
│   ├── data/movies.js       # Cartelera, navegación y contacto
│   ├── duel/team/           # Componentes funcionales del laboratorio
│   ├── duel/tests/          # Pruebas automatizadas del repositorio
│   ├── styles/index.css     # Estilos adaptables
│   ├── App.jsx              # Composición de la interfaz
│   └── main.jsx             # Punto de entrada de React
└── README.md                # Evidencia y explicación
```

La aplicación presenta la cartelera completa de ocho películas. `App.jsx` toma los datos de `src/data/movies.js` y pasa por props la película destacada, la lista y los datos de contacto. Los componentes funcionales están organizados por responsabilidad en `src/duel/team/`: `Header`, `Hero`, `MovieList`, `MovieCard`, `Showtimes`, `Synopsis` y `Footer`. Las tarjetas muestran afiche, título, clasificación, valoración, sinopsis y horarios; la película sin funciones informa «Sin funciones hoy».

La sinopsis se renderiza como texto JSX, nunca como HTML. Esto evita que etiquetas o manejadores incrustados en contenido de terceros se ejecuten. La lista usa `movie.id` como clave estable. Los estilos están en `src/styles/index.css` y son adaptables a pantallas pequeñas. Las imágenes de muestra están en `public/posters/`.

### Ejecución

Requisitos: Node.js 20 o superior. En PowerShell, desde la carpeta del repositorio:

```powershell
npm install
npm run dev
```

Vite muestra la dirección local en la terminal. Para generar la versión de producción: `npm run build`.

### Observaciones de errores JSX habituales

Estos son los mensajes que React suele mostrar al reproducir deliberadamente cada error en desarrollo (el texto exacto puede variar según la versión):

1. Escribir `class` en JSX: `Warning: Invalid DOM property 'class'. Did you mean 'className'?`
2. Devolver dos elementos hermanos sin envolver: `Adjacent JSX elements must be wrapped in an enclosing tag.`
3. Omitir `key` en elementos creados con `map`: `Each child in a list should have a unique "key" prop.`

Los errores se describen aquí como observaciones del laboratorio; la aplicación entregada ya usa `className`, un fragmento como raíz cuando hace falta y claves para los elementos de la cartelera.

### Casos revisados en la interfaz

- Se muestran las ocho películas y cada tarjeta presenta sus datos.
- La película 5 cubre el caso de lista de horarios vacía.
- Los enlaces de navegación llevan a cartelera, próximos estrenos y contacto.
- Los enlaces de correo y teléfono usan `mailto:` y `tel:`.
- La sinopsis de prueba contiene etiquetas HTML; la interfaz debe mostrarla como texto y no ejecutar su contenido.

### Conclusiones

La composición de componentes mantiene cada parte de la interfaz acotada y facilita reutilizar la tarjeta y la lista. Las props conectan los datos con sus vistas sin duplicar la cartelera en cada componente. Las claves identifican de forma estable cada película, y tratar la sinopsis como texto protege la página de HTML no confiable.

Repositorio del laboratorio **extra de la semana 9** de Desarrollo de Aplicaciones Empresariales (DAE).
Complementa el laboratorio oficial de la cartelera de cine (Vite, JSX, componentes, props y listas con `map`):
aquí escribes **ocho componentes pequeños** de esa cartelera contra **pruebas automáticas**, ves cómo una IA
resuelve las mismas ocho tareas (y falla de seis maneras distintas) y llevas una copia de sus respuestas
**de rojo a verde**.

La guía del laboratorio (con su rúbrica) está en el campus virtual; aquí está el código.

> El bloque de pruebas del duelo S09 se enfoca en componentes y props; el desarrollo S10 de esta misma carpeta incorpora `useState`, eventos y persistencia.

## Puesta en marcha

Necesitas **Node 20 o superior** (`node --version`). En PowerShell, dentro de la carpeta del proyecto:

```powershell
npm install
npm run dev        # abre http://localhost:5173 (usa «localhost», no 127.0.0.1)
```

La pantalla actual compone la cartelera completa con encabezado, banner, buscador, tarjetas, favoritos y pie de página. Los componentes de la Semana 9 permanecen en `src/duel/team/`; los componentes nuevos de la Semana 10 están en `src/components/`.

## Parte 1 — Leer el verificador

Las pruebas son el oráculo: deciden si un componente está bien. Están en `src/duel/tests/`, una por tarea
(`T1-header.test.jsx` … `T8-agentmessage.test.jsx`). Léelas antes de escribir nada: dicen qué rol, qué nombre
accesible y qué texto se espera, y qué avisos de React no se aceptan. Los datos fijos están en `src/data/movies.js`.

```powershell
npm run duel       # verifica los componentes de src/duel/team/
```

## Parte 2 — Escribir los ocho componentes

Los componentes de `src/duel/team/` ya están implementados y se pueden revisar con `npm run duel`. La tabla resume las props que recibe cada uno.

| Tarea | Componente | Props |
|---|---|---|
| 1 | `Header` | `name`, `links` |
| 2 | `Footer` | `contact` |
| 3 | `MovieCard` | `movie` |
| 4 | `Showtimes` | `times` |
| 5 | `MovieList` | `movies` |
| 6 | `Synopsis` | `text` |
| 7 | `Hero` | `movie` |
| 8 | `AgentMessage` | `author`, `text` |

## Parte 3 — El duelo con la IA

```powershell
npm run duel:ai    # las respuestas de una IA (src/duel/ai/): algunas pruebas fallan
```

Lee cada fallo: el nombre de la prueba dice qué se esperaba y el mensaje, qué ocurrió. Clasifica los seis fallos
(el de la tarea 1 y el de la 8 no son fallos: la IA los hizo bien).

## Parte 4 — Arreglar la copia de la IA

```powershell
npm run fixed:init   # copia src/duel/ai/ a src/duel/fixed/ (no pisa lo que ya tengas)
npm run duel:fixed   # rojo
```

Edita **solo** los archivos de `src/duel/fixed/` (nunca los de `ai/`) hasta que `npm run duel:fixed` pase entero, y
explica cada arreglo. Para empezar de cero: `npm run fixed:init -- --force`.

## Parte 5 — Datos de terceros

En `src/data/movies.js` la sinopsis de la primera película es HTML escrito por un tercero, y en `src/App.jsx` hay un
mensaje de un agente de IA con otra etiqueta `<img onerror>`. En esta parte cambias a propósito tu `Synopsis` a
`dangerouslySetInnerHTML`, ves en la consola del navegador (`window.__xss`) que el código se ejecutó, y lo
vuelves a dejar bien. La guía tiene los pasos.

## Qué hace cada script

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite con la cartelera armada con **tus** componentes (`src/duel/team/`) |
| `npm run build` | Compila la aplicación a `dist/` (comprueba que todo importa bien; no ejecuta las pruebas) |
| `npm test` | Todas las pruebas del proyecto: los datos (siempre verdes) y el duelo con **tus** componentes |
| `npm run duel` | El duelo con `src/duel/team/` (lo tuyo) |
| `npm run duel:ai` | El duelo con `src/duel/ai/` (las respuestas de la IA, de solo lectura) |
| `npm run duel:fixed` | El duelo con `src/duel/fixed/` (tu copia arreglada de la IA) |
| `npm run fixed:init` | Crea `src/duel/fixed/` copiando `ai/` |
| `npm run duel:solutions` | Solo docente: el duelo con las soluciones. Sin `teacher/` avisa de que no está disponible |

Las pruebas se ejecutan en jsdom (un navegador simulado) con Vitest y Testing Library. Cada modo (`team`, `ai`,
`fixed`, `solutions`) es un *modo de Vite*: lo elige el archivo `.env.<modo>`, que define `VITE_DUEL_SOURCE`.

## Estructura

| Ruta | Para qué |
|---|---|
| `src/duel/team/` | **Tuyo (Partes 1 y 2):** los ocho componentes sin escribir |
| `src/duel/ai/` | Las ocho respuestas de la IA. No las edites |
| `src/duel/fixed/` | **Tuyo (Parte 4):** la copia de `ai/` que arreglas (la crea `fixed:init`) |
| `src/duel/tests/` | Las pruebas, una por tarea: el verificador |
| `src/duel/support.js` | Elige el origen de los componentes y espía los avisos de la consola |
| `src/data/movies.js` | Los datos fijos: ocho películas, una sin funciones y una con sinopsis hostil |
| `src/App.jsx` | La cartelera armada con los componentes |
| `vite.config.js`, `.env.*` | Modos de Vite y configuración de Vitest |

## Convenciones del curso

Código, nombres y comentarios en inglés; explicaciones y entregables en español.

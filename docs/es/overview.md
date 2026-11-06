# Plan del proyecto

Este widget muestra un plan del proyecto en forma de **línea temporal** —por ejemplo, el calendario
del lanzamiento de un vehículo, con ferias, arranques de producción en serie (SOP) y
hitos del proyecto a lo largo de varios años. Sustituye a la diapositiva de PowerPoint
que hasta ahora se mantenía para este tipo de planes y se incluía como imagen: el plan
aparece directamente en la página, se puede modificar en cualquier momento y los lectores
pueden explorarlo por sí mismos, filtrarlo y descargarlo como hoja de cálculo de Excel.

Todo el plan se gestiona en el **editor de planes**, que aparece automáticamente al abrir la
configuración.

## En qué consiste un plan

- **Título** — opcional; aparece encima del plan y da nombre al archivo de Excel
  .
- **Niveles**: filas horizontales una debajo de otra, por ejemplo, «Ferias»,
  «Lanzamientos / SOP» y «Hitos del proyecto». A la izquierda aparece el título de cada uno.
- **Categorías**: asignan un color a las entradas y aparecen como leyenda
  encima del plan, por ejemplo, «MY26 TG Assist» en violeta.
- **Entradas** de tres tipos:
  - **Hito** — una fecha concreta, representada como un símbolo (rombos,
    triángulos, cuadrados o círculos) con el título debajo.
  - **Periodo** — una barra desde el inicio hasta el final, con una
    punta de flecha al final que indica «en curso».
  - **Fecha límite**: una fecha válida para todos los niveles, como una nueva
    normativa. Aparece como una línea vertical discontinua que atraviesa todo el
    plan, con el título debajo.
- **Series**: los hitos y los periodos del mismo nivel con el mismo
  nombre de serie aparecen en una misma línea. Si un periodo forma parte de ella,
  los hitos se sitúan en su barra; en caso contrario, una estrecha
  barra une el primero con el último.
- **Dependencias** — Líneas discontinuas con una flecha que van del predecesor al
  sucesor, por ejemplo, de «C4S» al SOP correspondiente.
- **Provisional** — una entrada cuya fecha aún no está fijada.
  Aparece solo como contorno o con un relleno claro y un borde discontinuo.

## Lo que ven los lectores

De arriba abajo:

1. **Título** (si se ha establecido) y **«Fecha: …»** — la fecha de la última
   modificación del plan, en el formato de fecha del idioma de la página.
2. **Barra de herramientas** — Búsqueda, **Filtros**, Zoom (**−**, **+**, **Mostrar todo
  **), el conmutador **Línea de tiempo | Lista**, **Exportar**,
   **Pantalla completa** y **Ayuda**.
3. **Leyenda** — las categorías con su color. Al hacer clic se oculta o se
   vuelve a mostrar una categoría.
4. **El plan** — a la izquierda, los títulos de los niveles; a la derecha, la línea de tiempo con las
   entradas; debajo del último nivel, los títulos de las fechas clave. La flecha situada junto al
   título pliega una capa; **Plegar todo**, situado encima de los títulos, pliega
   todas a la vez y, a continuación, las vuelve a desplegar.
5. **Resumen**: una franja estrecha que abarca todo el periodo. Un marco
   indica qué sección se está viendo en ese momento.

Además:

- El **zoom** se puede ajustar de forma continua: mediante los botones **−** y **+**, manteniendo pulsada
  la tecla Ctrl (Mac: ⌘) y la rueda del ratón, o con dos dedos en el trackpad y
  la pantalla táctil. El eje cambia de años a trimestres y meses, hasta
  semanas naturales y días concretos.
- Para **desplazarse**, arrastra con el ratón, utiliza la tecla Mayús y la rueda del ratón,
  desliza horizontalmente o arrastra el marco en la vista general.
- Al **hacer clic en una entrada** se abren sus detalles: tipo y fecha,
  categoría, nivel, serie, descripción, así como predecesor y sucesor.
- Los **filtros** y la **búsqueda** solo se aplican a tu propia visita; no se guarda ni
  se comparte nada con otros.
- **Lista** muestra las mismas entradas en forma de tabla, ordenadas por fecha: la
  opción más cómoda para lectores de pantalla, pantallas estrechas y para imprimir.
- **Exportar** descarga las entradas como un archivo de Excel, siempre que la
  opción de exportación esté activada en la configuración.
- Una línea oscura **«Hoy»** marca el día de hoy, siempre que esté
  activada y el día se encuentre en la sección visible.
- Se puede manejar sin ratón: la tecla Tab se desplaza por el plan, las
  teclas de flecha cambian entre las entradas, la tecla Intro abre los detalles,
  **+** y **−** amplían o reducen la vista, y **0** muestra todo.
- En pantallas estrechas (menos de 768 píxeles de ancho), el plan comienza en la
  **Lista** — en forma de tarjetas en lugar de tabla, ya que la línea de tiempo no ocupa
  ancho allí; el botón de cambio del menú **Más** lleva a la línea de tiempo en cualquier momento.
  Del mismo modo, los filtros y los detalles se abren como una pestaña desde el borde inferior, y
  **Lista** y **Exportar** se encuentran en el menú **Más**.
- **Pantalla completa** muestra el plan en toda la pantalla, con el mismo
  modo de uso; solo se desplaza el propio plano; el eje y la vista general permanecen fijos.
  **Esc** o **Salir de pantalla completa** te devuelve a la página. Cuando el navegador no
  permite una pantalla completa real (como Safari en el iPhone), el plano se extiende por
  toda la página.
- **Ayuda** explica a los lectores directamente en la página qué significan los símbolos
  (pestaña **Leyenda**, con las categorías de este plano) y cómo manejar el
  plano con el ratón, el trackpad, la pantalla táctil y el teclado (pestaña **Manejo**).
  Desde el mapa, la tecla **?** también abre la ayuda. En el editor de mapas
  no existe este botón.
- **Sin entradas, el widget no muestra nada**: ni un marco vacío ni
  ningún mensaje de error.

## Lo que verá en el editor del CMS

El editor de planes incluye una **vista previa** en la parte superior: la misma línea de tiempo que en
la página, con zoom, pero sin filtros, lista ni exportación. Al hacer clic en una
entrada de la vista previa, esta se selecciona para su edición. Para comprobar cómo ven los lectores el plan
con todos los filtros y la opción de exportación, consulta la vista previa de la página.

# Plan del proyecto

Este widget muestra un plan de proyecto como un **calendario** — como la hoja de ruta
un lanzamiento de vehículos con ferias comerciales, series de arranques (SOPs) y
hitos del proyecto a lo largo de varios años. Sustituye a la diapositiva de PowerPoint, 
que hasta ahora se ha mantenido para dichos planes e integrado como imagen: El Plan
está directamente en la página, puede cambiarse en cualquier momento, y los lectores
puedes explorarlo tú mismo, filtrarlo y descargarlo como una hoja de cálculo de Excel. 

El plan completo se mantiene en el **Editor de Plan**, que se muestra cuando el
Configuración por sí sola. 

## En qué consiste un plan

- **Encabezado** — opcional; se sitúa por encima del plano y da el archivo Excel
  su nombre. 
- **Niveles** — caminos horizontales entre sí, por ejemplo "Mediendo", 
  "Lanzamientos / SOPs" y "Hitos del Proyecto". A la izquierda está su título. 
- **Categorías** — dan color a las entradas y aparecen como leyenda
  por encima del plan, por ejemplo "MY26 TG Assist" en púrpura. 
- **Entradas** en tres tipos: 
  - **Hito** — una única fecha, mostrada como símbolo (rombo, 
    triángulo, cuadrado o círculo) con el título abajo. 
  - **Punto** — una barra de principio a fin, con un
    Punta de flecha al final para "sigue corriendo". 
  - **Fecha límite** — una fecha que se aplica a todos los niveles, como uno nuevo
    reglamento. Aparece como una línea vertical discontinua a través de todo
    Plan, con el título abajo. 
- **Series** — Hitos y periodos del mismo nivel con el mismo nivel
  Los nombres de las series están en una línea común. Si incluye un periodo de tiempo, 
  los hitos se sitúan sobre su viga; por lo demás, un estrecho
  Haz lo primero con el último. 
- **Dependencias** — líneas discontinuas con flecha desde el predecesor del
  sucesor, por ejemplo, de "C4S" del SOP asociado. 
- **Preliminar** — una entrada cuya fecha aún no se ha determinado. Ella
  aparece solo como un contorno o relleno brillantemente con un borde discontinuo. 

## Lo que ven los lectores

De arriba a abajo: 

1. **Encabezado** (si se ha establecido) y **"Estado: ..."** — la fecha del último
   Cambia el plano, en el formato de fecha del idioma de la página. 
2. **Barra de herramientas** — Buscar, **Filtrar**, Zoom (**−**, **+**, **Todos
   mostrar**), el interruptor **Línea de tiempo | Lista**, **Export**, 
   **Pantalla completa** y **Ayuda**. 
3. **Leyenda** — categorías con su color. Con solo clic se muestra un
   Categoría apagada o activada. 
4. **El plan** — a la izquierda los títulos de las capas, a la derecha la línea temporal con la
   entradas, debajo del último nivel los títulos de las fechas clave. La flecha en el
   El título se colapsa una capa; **Colapsa todo** sobre los títulos colapsa
   Todo de golpe y luego vuelve a abrir. 
5. **Visión general** — una franja estrecha a lo largo de todo el periodo. Un marco
   muestra qué sección se está viendo actualmente. 

Además: 

- **Zoom** es infinitamente variable: mediante los botones **−** y **+**, con el
  tecla Ctrl (Mac: ⌘) y la rueda del ratón o con dos dedos en el trackpad y
  pantalla táctil. El eje cambia de años a trimestres y de meses a
  a semanas y días individuales del calendario. 
- **Mover** se realiza arrastrando con el ratón, con Shift y la rueda del ratón, 
  borrando horizontalmente o arrastrando el fotograma en la vista general. 
- Un **clic en una entrada** abre sus detalles: tipo y fecha, 
  Categoría, nivel, serie, descripción, así como predecesores y sucesores. 
- **Filtros** y **Buscar** solo se aplican a tu propia visita; guardado o
  nada se transmite a otros. 
- **List** muestra las mismas entradas que una tabla, ordenadas por fecha — la
  Una forma más cómoda para lectores de pantalla, pantallas estrechas y para la impresión. 
- **Export** descarga las entradas como un archivo Excel, siempre que el
  Exportar está activado en Configuración. 
- Una línea oscura **"Today"** marca hoy, si es que
  está activada y la etiqueta está en la sección visible. 
- La operación también funciona sin ratón: Tab salta al plan, el
  Las flechas cambian entre entradas, Enter abre los detalles, 
  **+** y **−** Zoom, **0** lo muestra todo. 
- En pantallas estrechas (menos de 768 píxeles de ancho), filtros y
  Los detalles están disponibles en una hoja desde abajo, y **List** y **Export**
  en el menú **Más**. 
- **Pantalla completa** muestra el plano en toda la pantalla, con el mismo
  funcionamiento; solo los propios rollos, eje y visión general permanecen en pie. 
  **Esc** o **Salir de pantalla completa** vuelve a la página. Donde el navegador no lo hace
  pantalla completa real (como Safari en el iPhone), superposiciones del plan
  toda la página. 
- **Ayuda** explica a los lectores directamente en la página qué personajes son los personajes
  (pestaña de leyenda, con las categorías de este plan) y cómo usar el
  Plan operaba con ratón, trackpad, táctil y teclado (pestaña **Operación**). 
  Desde el plano, la tecla **?** también abre la ayuda. En el editor de planos,
  No tiene el botón. 
- **Sin entradas, el widget no muestra nada** — no hay fotograma vacío y
  No hay mensaje de error. 

## Lo que ves en el editor CMS

El editor de planos incluye una **vista previa** en la parte superior: la misma línea temporal que en
de la página, con zoom, pero sin filtros, lista y exporta. Haz clic en un
La entrada en la vista previa lo selecciona para editarlo. Cómo utilizan los lectores el plan
Con todos los filtros y la exportación, revisa en la vista previa de la página.
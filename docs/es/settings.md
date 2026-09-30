# Escenarios

El diálogo de configuración del widget tiene tres campos. "Plan" se muestra en el
editor de planos, que se muestra al abrir la configuración; 
El campo de texto detrás es la versión técnica preliminar y no debe hacerse a mano.
puede ser editado. Los dos campos restantes están directamente en el diálogo. El
El encabezado del plano no es un campo del diálogo, sino que se muestra en el editor de planos
(véase más abajo). 

| Atributo | Etiqueta en el diálogo | Descripción |
| --- | --- | --- |
| 'plan' | Plan | Encabezado, niveles, categorías, entradas y la vista inicial. Mantenidos en el editor de planos. Por defecto: vacío. |
| 'mostrar-hoy' | Línea Mostrar Hoy | Una línea vertical oscura con "Hoy" en el eje marca hoy, si está en la sección visible. Por defecto: activado. |
| 'permitir-exportar' | Ofrecer exportación en Excel | Muestra a los lectores el botón **Exportar**, que usan para descargar las entradas como una hoja de cálculo de Excel. Por defecto: activado. |

## El editor de planes

El editor de planes consta del campo **Encabezado**, la **Vista previa** y
tres pestañas. En la esquina superior derecha está cuántas entradas tiene el mapa, para el
Ejemplo de "42 / 300 entradas". 

### Rumbo

| Campo | Descripción |
| --- | --- |
| Encabezado | En la parte superior del editor de planos. Se sitúa sobre el plano y da nombre al archivo de Excel. Opcional: Dejar en blanco si la página ya tiene un encabezado adecuado; el archivo se llamará entonces 'Projektplan_JJJJ-MM-TT.xlsx'. |

### Vista rápida

| Elemento de control | Descripción |
| --- | --- |
| Vista previa | La misma línea de tiempo que en la página, con zoom, sin filtros ni exportación. Al hacer clic en una entrada se selecciona en la pestaña "Entradas". Puede colapsarse. |
| Esta sección como vista inicial | Guarda la sección visible de la vista previa, hasta el mes, como vista cuando carga la página. |
| Eliminar la vista de inicio | Elimina la vista principal; el widget muestra de nuevo todo el plan al cargar. |
| Empieza con Plan de Ejemplo | Solo cuando el plan esté vacío: llena el editor con un encabezado, tres niveles, siete categorías y entradas de ejemplo. |

### Pestaña "Entradas" 

A la izquierda está la lista de todas las entradas, ordenadas por fecha y mediante **Entradas
navegar** buscable; encima de eso, bajo **Añadir**, un botón para
**Hito**, **Punto** y **Fecha límite**. A la derecha, la forma de la
Entrada seleccionada: 

| Campo | Aplica a | Descripción |
| --- | --- | --- |
| Tipo | Todos | Hito, periodo o fecha límite. Si cambias a la fecha límite, el nivel se omite. |
| Título | Todos | Obligatorio. Escrito en la entrada y en los detalles. |
| Descripción | Todos | Opcional, multilínea. Aparece solo en los detalles y en la exportación de Excel. |
| Nivel | Hito, Periodo | El nivel en el que se encuentra la entrada. |
| Categoría | Todos | Determina el color. "Sin categoría" aparece en gris. |
| Fecha | Hito, fecha límite | La fecha. |
| Inicio, fin | Punto | Primer y último día; ambos pertenecen a la época. |
| Símbolo | Hito | Rombo (por defecto), triángulo, cuadrado o círculo. |
| Flecha al final | Punto | La barra termina en una punta de flecha — "sigue corriendo". |
| Serie | Hito, Periodo | Las entradas del mismo nivel con el mismo nombre de serie están en una línea. El campo sugiere la serie de este nivel. |
| Provisional | todos | La fecha aún no se ha fijado; la entrada aparece como un contorno o con un borde discontinuo. |
| Depende de | Hito, Punto | Los predecesores de la entrada; en la página como una línea discontinua con una flecha. |
| Duplicado | Todos | Crea una copia de la entrada. |
| Eliminar | Todos | Elimina la entrada y cualquier dependencia que apunte a ella. |

### Pestaña de capas 

| Elemento de control | Descripción |
| --- | --- |
| Nueva capa | Crea una nueva capa. |
| Nombre | El nombre de la capa, a la izquierda de su órbita. Al lado está cuántas entradas contiene. |
| Flechas arriba/abajo | Ordenar en la página y en exportar en Excel. |
| Eliminar | Elimina la capa. Si contiene entradas, el editor pregunta si deben moverse a otra capa (selecciona **Capa Destino**) o si también deben eliminarse. |

### Pestaña "Categorías" 

| Elemento de control | Descripción |
| --- | --- |
| Nueva categoría | Crear una nueva categoría. |
| Nombre | El nombre en la leyenda y en los detalles. |
| Color | Uno de los doce campos de color. |
| Valor hexadecimal | Un color personalizado en formato '#RRGGBB', por ejemplo '#E40045'. |
| Flechas arriba/abajo | Orden de la leyenda. |
| Eliminar | Elimina la categoría; sus entradas pasan a ser "sin categoría". La consulta da su número. |

## Fronteras

- Un plan tiene un máximo de **300 entradas**, **20 niveles** y
  **24 categorías**. Más allá de eso, el editor ya no acepta nada. 
- Las citas son **días enteros** sin tiempo. La vista inicial es
  **Mensual**. 
- El texto nunca está en el color de la categoría — permanecen colores brillantes como el amarillo
  de lo contrario, ilegible en blanco. El color solo se lleva el símbolo, barra y
  punto de leyenda; la escritura en el bar es en blanco o negro, dependiendo de qué
  es más fácil de leer. 
- **Sin entradas, el widget no muestra nada** — ni un fotograma vacío ni
  Un mensaje. 

## Dependencias entre entornos

- **Línea Mostrar hoy** solo funciona si hoy está en visible
  extracto. En el caso de un plan que sea completamente pasado o
  por lo tanto, la línea solo puede verse después de haber sido trasladada. 
- El **encabezado** también determina el nombre del archivo Excel; sin
  Solo sirve como titular. 
- **Encabezado** y **Vista de inicio** están configurados en el editor de planos, no en el
  diálogo; ambos forman parte del plan.
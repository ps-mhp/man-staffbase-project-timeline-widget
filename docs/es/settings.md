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

El editor de planos ocupa toda la pantalla. En la parte superior está la barra de cabecera, debajo de ella
la **Vista previa** y tres pestañas. Entre Vista previa y pestañas, y entre
La lista de inscripciones y el formulario tienen cada uno una manija de tirada con la que la altura de la
y cambiar el ancho de la lista (ratón o teclas de flecha, 
El doble clic restaura el valor predeterminado; el navegador recuerda los tamaños). 

### Cabeza

| Elemento de control | Descripción |
| --- | --- |
| Encabezado | Se sitúa por encima del plano y da nombre al archivo Excel. Opcional: Deja en blanco si la página ya tiene un encabezado adecuado; el archivo se llama entonces 'Projektplan_JJJJ-MM-TT.xlsx'. |
| "42 / 300 entradas" | Cuántas entradas tiene el plano, medidas respecto al límite superior. |
| "Cambios no guardados" | Aparece tan pronto como el plan en el editor difiere del guardado. |
| Cancelar | Cierra el editor; en caso de cambios no guardados, pregunta de antemano si deben descartarse. |
| Aplicar | Escribe el plan en la configuración y cierra el editor. Se guarda junto con la página. |

### Vista rápida

| Elemento de control | Descripción |
| --- | --- |
| Vista previa | La misma línea de tiempo que en la página, con zoom, sin filtro ni exportación. Al hacer clic en una entrada se selecciona en la pestaña "Entradas" y aparece en la lista. Al hacer clic en **Vista previa** se colapsa; desplegada tiene la última altura dibujada. |
| Esta sección como vista inicial | Guarda la sección visible de la vista previa, hasta el mes, como vista cuando carga la página. |
| Eliminar la vista de inicio | Elimina la vista principal; el widget muestra de nuevo todo el plan al cargar. |
| Empieza con Plantilla | Solo si el plan está vacío: muestra las plantillas para elegir ("Hoja de ruta del producto", "Reprogramación"). Al hacer clic en una tarjeta, el editor se llena con ella; **Devolver** devuelve sin cambios. |
| Empieza vacío | Solo si el plano está vacío: crea una capa "Nivel 1". |

### Pestaña "Entradas" 

A la izquierda está la lista de entradas, ordenadas por fecha. Encima están
**Explora las entradas** y debajo de ellas un interruptor para el tipo — 
**Hitos**, **Puntos**, **Plazos**, cada uno con número (si está activo
search: hits); el botón **+** junto a él crea una entrada de este tipo, 
y la búsqueda funciona dentro de la especie. 
Al pasar el cursor sobre una línea, aparece una papelera de reciclaje a la derecha para su eliminación (con
Consulta). 

A la derecha, la forma de la entrada seleccionada; encima de ella está su título y
los botones **Duplicar** y **Eliminar**, debajo de los cuales están las pestañas de **General** 
(Tipo, título, descripción), **clasificación** (nivel, categoría, serie), 
**Fecha** (fecha o inicio y fin, para la flecha del punto al final, provisional)
**Dependencias** y **Contenido** (página enlazada o entrada de noticias). A
el punto rojo en la pestaña muestra una entrada inválida; para fechas clave
**Dependencias** eliminadas: 

| Campo | Aplica a | Descripción |
| --- | --- | --- |
| Tipo | Todos | Hito, periodo o fecha límite. Si cambias a la fecha límite, el nivel se omite. |
| Título | Todos | Obligatorio. Escrito en la entrada y en los detalles. |
| Descripción | Todos | Opcional, multilínea. Aparece solo en los detalles y en la exportación de Excel. |
| Nivel | Hito, Periodo | El nivel en el que se encuentra la entrada. **Nueva capa ...** crea uno (nombre) y lo asigna inmediatamente. |
| Categoría | todos | Determina el color y para hitos la forma. "Sin categoría" aparece en gris, los hitos aparecen como diamante. **Nueva categoría ...** crea uno (nombre, color y forma) y lo asigna inmediatamente. |
| Fecha | Hito, fecha límite | La fecha. |
| Inicio, fin | Punto | Primer y último día; ambos pertenecen a la época. |
| Flecha al final | Punto | La barra termina en una punta de flecha — "sigue corriendo". |
| Serie | Hito, Periodo | Las entradas del mismo nivel con el mismo nombre de serie están en una línea. El campo amplía la serie de este nivel con el número de sus entradas; un nuevo nombre mecanografiado se toma mediante ""..." crear como una nueva serie", **Ninguna serie** elimina la entrada. |
| Provisional | todos | La fecha aún no se ha fijado; la entrada aparece como un contorno o con un borde discontinuo. |
| Depende de | Hito, Punto | Los predecesores de la entrada; en la página como una línea discontinua con una flecha. |
| Enlace | todos | **Ninguno**, **Página** o **Artículo de noticias**. Un cambio rompe un enlace existente. En la página, la inscripción de la entrada se subraya, y un clic abre el contenido en una ventana sobre el plano. |
| Página | Todos | La página de Staffbase de la lista de páginas (las 100 editadas más recientemente). **Nueva página ...** la crea en el editor de Staffbase, que superpone el editor de planos; tras crearla, se enlaza. |
| Canal, Publicación | todos | Primero el canal de noticias (con su tipo: artículo, mensaje corto, imagen de publicación), luego la publicación. Los borradores son seleccionables y marcados con "(borrador)" — los lectores solo los ven después de publicarlos. **Nueva publicación ...** crea una en el canal seleccionado; tras guardar, se enlaza. **Abrir en una nueva pestaña** muestra el contenido enlazado. |
| Adjuntos | Todos | Hasta diez archivos o imágenes de la biblioteca multimedia, cada uno con pie de foto opcional (de lo contrario, el nombre del archivo). **Añadir archivo o imagen ...** abre la biblioteca; **↑**/**↓** organizar, **×** eliminado. Los archivos adjuntos permanecen detrás del inicio de sesión. En la página, están junto al contenido enlazado o en los detalles, en la exportación de Excel en la columna "Adjuntos". |
| Duplicado | Todos | Crea una copia de la entrada. |
| Eliminar | todos | Solicita y luego elimina la entrada y todas las dependencias que apuntan a ella; la consulta nombra las entradas dependientes. |

### Pestaña de capas 

| Elemento de control | Descripción |
| --- | --- |
| Nueva capa | En la esquina superior derecha de la pestaña. Crea una nueva capa. |
| Nombre | El nombre de la capa, a la izquierda de su órbita. Debe ser único. Al lado está cuántas entradas contiene. |
| Flechas arriba/abajo | Ordenar en la página y en exportar en Excel. |
| Eliminar | Elimina la capa. Si contiene entradas, el editor pregunta si deben moverse a otra capa (selecciona **Capa Destino**) o si también deben eliminarse. |

### Pestaña "Categorías" 

| Elemento de control | Descripción |
| --- | --- |
| Nueva categoría | Arriba a la derecha de la pestaña. Crea una nueva categoría. |
| Campo de color | Delante del nombre; muestra el color. Un clic expande los doce colores y el campo **Valor hexadecimal**; Esc o un clic junto a él se cierra. |
| Valor hexadecimal | Un color personalizado en formato '#RRGGBB', por ejemplo '#E40045'. |
| Botón de Forma | Junto al campo de color; muestra la forma con la que aparecen los hitos de la categoría. Un clic abre las ocho formas: rombo, triángulo, triángulo con la punta hacia abajo, cuadrado, círculo, hexágono, estrella o cruz. Las flechas cambian la forma. |
| Nombre | El nombre en la leyenda y en los detalles. Debe ser único. Al lado está cuántas entradas está asignada la categoría. |
| Flechas arriba/abajo | Orden de la leyenda. |
| Eliminar | Elimina la categoría; sus entradas pasan a ser "sin categoría". La consulta da su número. |

## Fronteras

- Un plan tiene un máximo de **300 entradas**, **20 niveles** y
  **24 categorías**. Más allá de eso, el editor ya no acepta nada. 
- Las citas son **días enteros** sin tiempo. La vista inicial es
  **Mensual**. 
- El texto nunca está en el color de la categoría — permanecen colores brillantes como el amarillo
  de lo contrario, ilegible en blanco. El color solo se lleva por la forma, las barras y
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
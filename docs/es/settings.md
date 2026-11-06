# Ajustes

El cuadro de diálogo de configuración del widget contiene tres campos. «Plan» se
edita en el editor de planes, que aparece automáticamente al abrir los ajustes;
el campo de texto que hay detrás es el borrador técnico y no debe modificarse
manualmente. Los otros dos campos se encuentran directamente en el cuadro de diálogo. El
título del plan no es un campo del cuadro de diálogo, sino que se gestiona en el editor de planes
(véase más abajo).

| Atributo | Etiqueta en el cuadro de diálogo | Descripción |
| --- | --- | --- |
| `plan` | Plan | Encabezado, niveles, categorías, entradas y la vista inicial. Se edita en el editor de planos. Por defecto: vacío. |
| `show-today` | Mostrar línea de «Hoy» | Una línea vertical oscura con la palabra «Hoy» en el eje marca el día de hoy, siempre que se encuentre dentro de la sección visible. Valor predeterminado: activado. |
| `allow-export` | Ofrecer exportación a Excel | Muestra a los lectores el botón **Exportar**, mediante el cual pueden descargar las entradas como una hoja de cálculo de Excel. Por defecto: activado. |

## El editor de planes

El editor de planes ocupa toda la pantalla. En la parte superior se encuentra la barra de encabezado; debajo,
la **vista previa** y tres pestañas. Entre la vista previa y las pestañas, así como entre
la lista de entradas y el formulario, hay un control de arrastre con el que se puede ajustar la altura de la
vista previa y el ancho de la lista (con el ratón o las teclas de flecha;
al hacer doble clic se restablecen los valores predeterminados; el navegador recuerda los tamaños).

### Barra de título

| Elemento de control | Descripción |
| --- | --- |
| Título | Se encuentra encima del plan y da nombre al archivo de Excel. Opcional: déjalo en blanco si la página ya tiene un título adecuado; en ese caso, el archivo se llamará `Plan_del_proyecto_AAAA-MM-DD.xlsx`. |
| «42 / 300 entradas» | Número de entradas que contiene el plan, medido en relación con el límite máximo. |
| «Cambios no guardados» | Aparece en cuanto el plan del editor difiere del guardado. |
| Cancelar | Cierra el editor; si hay cambios no guardados, pregunta previamente si se deben descartar. |
| Aplicar | Guarda el plan en la configuración y cierra el editor. Se guarda junto con la página. |

### Vista previa

| Elemento de control | Descripción |
| --- | --- |
| Vista previa | La misma línea de tiempo que en la página, con zoom, sin filtros ni exportación. Al hacer clic en una entrada, esta se selecciona en la pestaña «Entradas» y se muestra en la lista. Al hacer clic en **Vista previa**, se pliega; cuando se despliega, vuelve a mostrar la altura a la que se había ajustado por última vez. |
| Esta sección como vista inicial | Guarda la sección visible de la vista previa, con precisión mensual, como vista inicial al cargar la página. |
| Eliminar vista inicial | Borra la vista inicial; al cargarse, el widget vuelve a mostrar el plan completo. |
| Empezar con una plantilla | Solo si el plan está vacío: muestra las plantillas para elegir («Hoja de ruta del producto», «Aplazamiento de fecha»). Al hacer clic en una tarjeta, esta se muestra en el editor; **Atrás** permite volver sin guardar cambios. |
| Empezar desde cero | Solo si el plan está vacío: crea una capa denominada «Capa 1». |

### Pestaña «Entradas»

A la izquierda, la lista de entradas, ordenadas por fecha. Encima aparece
**Buscar entradas** y, debajo, un selector para el tipo:
**Hitos**, **Periodos**, **Fechas clave**, cada uno con su número (si la
búsqueda: resultados); el botón **+** situado junto a cada uno crea una entrada de ese tipo,
y la búsqueda se realiza dentro de ese tipo.
Al pasar el cursor por encima de una línea, aparece a la derecha una papelera para borrarla (con
confirmación).

A la derecha, el formulario de la entrada seleccionada; encima aparecen su título y
los botones **Duplicar** y **Eliminar**, y debajo las pestañas **General**
(tipo, título, descripción), **Clasificación** (nivel, categoría, serie),
**Fecha** (fecha o inicio y fin; en el caso de un periodo, una flecha al final; provisional)
**Dependencias** y **Contenido** (página vinculada o noticia). Un
punto rojo en la pestaña indica que hay un dato no válido en ella; en el caso de las fechas clave,
no se aplica **Dependencias**:

| Campo | Se aplica a | Descripción |
| --- | --- | --- |
| Tipo | todos | Hito, periodo o fecha clave. Al cambiar a fecha clave, se omite el nivel. |
| Título | todos | Obligatorio. Aparece en la entrada y en los detalles. |
| Descripción | todos | Opcional, de varias líneas. Solo aparece en los detalles y en la exportación a Excel. |
| Nivel | Hito, periodo | El nivel en el que se encuentra la entrada. **Nuevo nivel…** crea uno (nombre) y lo asigna inmediatamente. |
| Categoría | todas | Determina el color y, en el caso de los hitos, la forma. «Sin categoría» aparece en gris; los hitos, como un rombo. **Nueva categoría…** crea una (nombre, color y forma) y la asigna inmediatamente. |
| Fecha | Hito, fecha de referencia | La fecha. |
| Inicio, Fin | Periodo | Primer y último día; ambos forman parte del periodo. |
| Flecha al final | Periodo | La barra termina en una punta de flecha — «continúa». |
| Serie | Hito, periodo | Las entradas del mismo nivel con el mismo nombre de serie aparecen en una misma línea. El campo despliega las series de este nivel con el número de entradas que tienen; si se escribe un nuevo nombre, se aplica como nueva serie mediante «Crear nueva serie como „…“»; **Sin serie** elimina la entrada. |
| Provisional | todas | La fecha aún no está fijada; la entrada aparece como un contorno o con un borde discontinuo. |
| Depende de | Hito, periodo | Los predecesores de la entrada; en la página aparecen como una línea discontinua con una flecha. |
| Enlace | todos | **Ninguno**, **página** o **noticia**. Un cambio anula un enlace existente. En la página, el título de la entrada aparece entonces subrayado, y al hacer clic se abre el contenido en una ventana sobre el plan. |
| Página | todas | La página de Staffbase de la lista de páginas (las 100 últimas editadas). **Nueva página…** la crea en el editor de Staffbase, que se superpone al editor del mapa; una vez creada, queda enlazada. |
| Canal, publicación | todas | Primero el canal de noticias (con su tipo: artículo, noticia breve, publicación con imagen) y, a continuación, la publicación. Se pueden seleccionar borradores, que se marcan con «(borrador)»; los lectores solo los ven tras su publicación. **Nueva publicación…** crea una en el canal seleccionado; una vez guardada, queda vinculada. **Abrir en una nueva pestaña** muestra el contenido vinculado. |
| Archivos adjuntos | todos | Hasta diez archivos o imágenes de la biblioteca multimedia, cada uno con un título opcional (de lo contrario, se muestra el nombre del archivo). **Añadir archivo o imagen…** abre la biblioteca; **↑**/**↓** ordena, **×** elimina. Los archivos adjuntos se conservan tras iniciar sesión. En la página aparecen junto al contenido vinculado o en los detalles; en la exportación a Excel, en la columna «Archivos adjuntos». |
| Duplicar | todos | Crea una copia de la entrada. |
| Eliminar | todo | Pide confirmación y, a continuación, elimina la entrada y todas las dependencias que apuntan a ella; la ventana de confirmación indica las entradas dependientes. |

### Pestaña «Niveles»

| Elemento de control | Descripción |
| --- | --- |
| Nueva capa | Arriba a la derecha de la pestaña. Crea una nueva capa. |
| Nombre | El nombre de la capa, a la izquierda de su pista. Debe ser único. Junto a él se indica cuántas entradas contiene. |
| Flechas hacia arriba / hacia abajo | Orden en la página y en la exportación a Excel. |
| Eliminar | Elimina el nivel. Si contiene entradas, el editor pregunta si estas deben trasladarse a otro nivel (selección de **nivel de destino**) o si deben eliminarse también. |

### Pestaña «Categorías»

| Elemento de control | Descripción |
| --- | --- |
| Nueva categoría | Arriba a la derecha de la pestaña. Crea una nueva categoría. |
| Casilla de color | Delante del nombre; muestra el color. Al hacer clic se despliegan los doce colores y el campo **Valor hexadecimal**; se cierra con Esc o haciendo clic junto a él. |
| Valor hexadecimal | Un color personalizado en el formato `#RRGGBB`, por ejemplo, `#E40045`. |
| Botón de forma | Junto al campo de color; muestra la forma con la que aparecen los hitos de la categoría. Al hacer clic se despliegan las ocho formas: rombo, triángulo, triángulo con la punta hacia abajo, cuadrado, círculo, hexágono, estrella o cruz. Las teclas de flecha cambian la forma. |
| Nombre | El nombre que aparece en la leyenda y en los detalles. Debe ser único. Junto a él se indica a cuántas entradas está asignada la categoría. |
| Flechas arriba/abajo | Orden de la leyenda. |
| Eliminar | Elimina la categoría; sus entradas pasan a estar «sin categoría». La ventana de confirmación indica su número. |

## Límites

- Un plano puede contener como máximo **300 entradas**, **20 niveles** y
  **24 categorías**. El editor no acepta nada más allá de estos límites.
- Las citas son **días completos** sin hora. La vista inicial es
  **por mes**.
- El texto nunca aparece en el color de la categoría; de lo contrario, los colores claros, como el amarillo,
  resultarían ilegibles sobre fondo blanco. El color solo se aplica a la forma, la barra y
  el punto de leyenda; la fuente de la barra es negra o blanca, según lo que
  resulte más legible.
- **Sin entradas, el widget no muestra nada**, ni un marco vacío ni
  un mensaje.

## Dependencias entre los ajustes

- **Mostrar la línea de hoy** solo funciona si el día de hoy se encuentra en la
  sección visible. Por lo tanto, en un plan que se sitúe íntegramente en el pasado o
  en el futuro, la línea solo se verá tras desplazarlo.
- El **encabezado** también determina el nombre del archivo de Excel; si no
  se activa la exportación, solo actúa como encabezado.
- El **encabezado** y la **vista inicial** se configuran en el editor de planes, no en el
  cuadro de diálogo; ambos forman parte del plan.

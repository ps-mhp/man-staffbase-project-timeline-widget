# Ajustes

El cuadro de diálogo de configuración de Staffbase solo incluye el campo «Plan». Este se
gestiona en el editor de planes, que aparece automáticamente al abrir los ajustes;
el campo de texto que hay detrás es la versión técnica sin formato y no debe modificarse
manualmente. Los antiguos campos **Mostrar línea de hoy** y
**Ofrecer exportación a Excel** están ocultos en el cuadro de diálogo y se encuentran en el
editor de planes, en **Configuración**; sus valores se encuentran en el plan. Un bloque en
el que nunca se hayan reubicado en el editor conserva lo que mostraba anteriormente. Asimismo, el
encabezado del plan no es un campo del cuadro de diálogo, sino que se gestiona en el editor de planes
.

| Atributo | Etiqueta | Descripción |
| --- | --- | --- |
| `plan` | Plan | Encabezado, niveles, categorías, entradas, vista inicial y los botones para la línea de hoy y la exportación. Se gestiona en el editor de planes. Por defecto: vacío. |
| `show-today` | Mostrar línea de «Hoy» | Solo se utiliza como alternativa para los planes que no incluyen este botón. En el editor, como **Mostrar línea de «Hoy»** en **Configuración**: Una línea vertical oscura con la palabra «Hoy» en el eje marca el día de hoy, siempre que se encuentre dentro de la sección visible. Por defecto: activado. |
| `allow-export` | Ofrecer exportación a Excel | Solo como alternativa, igual que arriba. En el editor, como **Ofrecer exportación a Excel**: muestra a los lectores el botón **Exportar**, mediante el cual pueden descargar las entradas como una hoja de cálculo de Excel. Por defecto: activado. |

## El editor de planes

El editor de planes ocupa toda la pantalla. En la parte superior se encuentra el encabezado del
marco común; debajo, a la izquierda, las **entradas**; en el centro, el
formulario de la entrada seleccionada; y a la derecha, el panel **Plan**.

### Encabezado

| Elemento de control | Descripción |
| --- | --- |
| Editor · Ordenador · Tableta · Móvil | **Editor** muestra el formulario. Las vistas para dispositivos muestran, en su lugar, el plan a lo ancho del dispositivo —la misma vista que en la página, con zoom, sin filtros ni exportación—; al hacer clic en una entrada, esta queda seleccionada. |
| Estado | «3 entradas modificadas · niveles» — lo que difiere del último estado guardado. Una entrada a la que le falte un nivel impide guardar los cambios. |
| Deshacer / Rehacer | Deshace o restaura los cambios paso a paso (⌘/Ctrl Z, ⇧⌘/Ctrl Z). |
| Ayuda | Explica el funcionamiento (F1). |
| Cancelar | Cierra el editor; si hay cambios no guardados, pregunta previamente si se desean descartar. |
| Aceptar | Guarda el plan en la configuración (⌘/Ctrl S); **Aceptar y cerrar** también con ⌘/Ctrl ↵. Se guarda junto con la página. |

### Barra lateral «Entradas»

A la izquierda, la lista de entradas, ordenadas por fecha, con el número («12 de
300»). **Nuevo** crea un **hito**, un **período** o una **fecha clave**;
sin nivel, solo es posible la fecha clave. Debajo se encuentran **Buscar entradas** y
la selección del tipo (**Todos los tipos**, **Hitos**, **Periodos**,
**Fechas límite**, cada uno con su número; si la búsqueda está activa: resultados).

### Formulario de la entrada

Encima del formulario aparece «Entrada 4 de 12», el tipo y los botones **Duplicar
entrada** y **Eliminar entrada**; debajo, las pestañas **General**
(Tipo, Título, Descripción, Provisional), **Clasificación** (nivel, categoría,
serie), **Fecha** (fecha o inicio y fin; en el caso de un periodo, una flecha al final),
**Dependencias** y **Contenido** (página vinculada o noticia,
archivos adjuntos). «(Error)» detrás de una pestaña indica que hay una entrada no válida en ella;
en el caso de las fechas clave, no aparece **Dependencias**:

| Campo | Se aplica a | Descripción |
| --- | --- | --- |
| Tipo | todos | Hito, periodo o fecha clave. Al cambiar a fecha clave, se omite el nivel. Sin nivel, una fecha clave sigue siendo lo que es. |
| Título | todos | Obligatorio. Aparece en la entrada y en los detalles. |
| Descripción | todos | Opcional, varias líneas. Solo aparece en los detalles y en la exportación a Excel. |
| Provisional | todos | La fecha aún no está fijada; la entrada aparece como contorno o con borde discontinuo. |
| Nivel | Hito, periodo | El nivel en el que se encuentra la entrada. **Nuevo nivel…** crea uno (nombre) y lo asigna inmediatamente. |
| Categoría | todas | Determina el color y, en el caso de los hitos, la forma. «Sin categoría» aparece en gris; los hitos, en forma de rombo. **Nueva categoría…** crea una (nombre, color y forma) y la asigna inmediatamente. |
| Serie | Hito, periodo | Las entradas del mismo nivel con el mismo nombre de serie aparecen en una misma línea. El campo despliega las series de este nivel con el número de entradas que tienen; un nuevo nombre escrito se aplica mediante «Crear una nueva serie con “...”», mientras que **Sin serie** elimina la entrada. |
| Fecha | Hito, fecha de referencia | La fecha. |
| Inicio, Fin | Periodo | Primer y último día; ambos forman parte del periodo. |
| Flecha al final | Periodo | La barra termina en una punta de flecha — «continúa». |
| Depende de | Hito, periodo | Los predecesores de la entrada; se muestran en la página como una línea discontinua con una flecha. |
| Enlace | todos | **Ninguno**, **Página** o **Noticia**. Un cambio anula un enlace existente. En la página, el título de la entrada aparece entonces subrayado, y al hacer clic se abre el contenido en una ventana sobre el plan. |
| Página | todas | La página de Staffbase de la lista de páginas (las 100 últimas editadas). **Nueva página…** la crea en el editor de Staffbase, que se superpone al editor del mapa; una vez creada, queda enlazada. |
| Canal, entrada | todas | Primero el canal de noticias (con su tipo: artículo, noticia breve, entrada con imagen), luego la entrada. Se pueden seleccionar borradores, que se marcan con «(borrador)»; los lectores solo los ven tras su publicación. **Nueva publicación…** crea una en el canal seleccionado; una vez guardada, queda vinculada. **Abrir en una pestaña nueva** muestra el contenido vinculado. |
| Archivos adjuntos | todos | Hasta diez archivos o imágenes de la biblioteca multimedia, cada uno con una descripción opcional (en su defecto, el nombre del archivo). **Añadir archivo o imagen…** abre la biblioteca; las flechas ordenan, la cruz elimina. Los archivos adjuntos se conservan tras iniciar sesión. En la página aparecen junto al contenido vinculado o en los detalles; en la exportación a Excel, en la columna «Archivos adjuntos». |
| Duplicar entrada | todos | Crea una copia de la entrada. |
| Eliminar entrada | todas | Pide confirmación y, a continuación, elimina la entrada y todas las dependencias que apuntan a ella; la ventana de confirmación indica las entradas dependientes. |

### Panel «Plan»: Ajustes

| Elemento de control | Descripción |
| --- | --- |
| Título del plan | Aparece encima del plan y da nombre al archivo de Excel. Opcional: déjalo en blanco si la página ya tiene un encabezado adecuado; en ese caso, el archivo se llamará `Plan_del_proyecto_AAAA-MM-DD.xlsx`. |
| Mostrar línea de hoy | Botón, véase más arriba. Mientras no se haya pulsado nunca en el editor, se indica que el bloque mantiene su configuración anterior. |
| Ofrecer exportación a Excel | Botón, véase más arriba; lo mismo. |
| Aplicar esta sección | Guarda la sección visible de la vista previa (vista de escritorio, tableta o móvil), con precisión mensual, como vista al cargar la página. Desactivado si no se ha especificado ninguna sección. |
| Eliminar vista inicial | Borra la vista inicial; al cargarse, el widget vuelve a mostrar el plan completo. |
| Empezar con plantilla | Solo si el plan está vacío, en el centro: muestra las plantillas entre las que elegir («Hoja de ruta del producto», «Aplazamiento de fecha»). Al hacer clic en una tarjeta, esta se muestra en el editor; **Atrás** vuelve sin realizar cambios. Esto no está disponible en un plan con entradas, ya que la plantilla las sustituiría. |
| Empezar en blanco | Solo si el plan está vacío: crea una capa denominada «Capa 1». |

### Panel «Plan»: Niveles

| Elemento de control | Descripción |
| --- | --- |
| Nuevo nivel | Crea un nuevo nivel. |
| Nombre | El nombre de la capa, a la izquierda de su pista. Debe ser único. Debajo se indica cuántas entradas contiene. |
| Flechas hacia arriba / hacia abajo | Orden en la página y en la exportación a Excel. |
| Eliminar | Elimina la capa. Si contiene entradas, el editor pregunta si estas deben trasladarse a otra capa (selección de **capa de destino**) o si deben eliminarse también. |

### Panel «Plano»: Categorías

| Elemento de control | Descripción |
| --- | --- |
| Nueva categoría | Crea una nueva categoría. |
| Casilla de color | Situada delante del nombre; muestra el color. Al hacer clic se despliegan los doce colores y el campo **Valor hexadecimal**; se cierra con Esc o haciendo clic junto a él. |
| Valor hexadecimal | Un color personalizado en el formato `#RRGGBB`, por ejemplo, `#E40045`. |
| Botón de forma | Junto al campo de color; muestra la forma con la que aparecerán los hitos de la categoría. Al hacer clic se despliegan las ocho formas: rombo, triángulo, triángulo con la punta hacia abajo, cuadrado, círculo, hexágono, estrella o cruz. Las teclas de flecha cambian la forma. |
| Nombre | El nombre que aparece en la leyenda y en los detalles. Debe ser único. Debajo se indica a cuántas entradas está asignada la categoría. |
| Flechas arriba/abajo | Orden en la leyenda. |
| Eliminar | Elimina la categoría; sus entradas pasan a estar «sin categoría». La ventana emergente indica su número. |

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
  sección visible. En el caso de un plan que se sitúe íntegramente en el pasado o
  en el futuro, Por eso, la línea solo se ve después de desplazarla.
- El **encabezado** también determina el nombre del archivo de Excel; si
  no se ha activado la exportación, solo actúa como encabezado.
- El **título del plan**, la **vista inicial**, la **línea de hoy** y la **exportación** se configuran en el
  editor de planes, no en el cuadro de diálogo; todos forman parte del plan.

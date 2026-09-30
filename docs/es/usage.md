# Paso a paso

## Crea el plan

1. Colocar el widget **Plan de Proyecto** en la página, preferiblemente en una
   columna ancha: Una línea de tiempo necesita espacio en el ancho. En una
   Columna estrecha, sigue operando, pero muestra menos a la vez. 
2. Abre la configuración del widget. El editor de planos se abre desde
   él mismo. 
3. Un nuevo plan comienza con una capa de "Nivel 1". ¿Prefieres
   una plantilla terminada, sigue la sección "Usando el
   Plan de ejemplo". 
4. En la parte superior del editor de planos, bajo **Encabezado**, añade opcionalmente un título
   para el plano. Se sitúa por encima del plano y da al archivo Excel su
   Nombres. 
5. Crea las capas en la pestaña **Capas** — véase "Mantener capas". 
6. En la pestaña **Categorías**, crea las categorías con sus colores — 
   véase "Mantenimiento de categorías". 
7. En la pestaña **Entradas**, establece los hitos, periodos de tiempo y plazos
   — véase las siguientes secciones. 
8. Haz clic en **Aplicar**. 
9. En el diálogo, marque los botones **Línea Mostrar Hoy** y
   **Ofrecer exportación de Excel**; ambos están prehabilitados. 
10. Guarda la página y previsualiza el resultado. 

## Empieza con el plan de muestra

1. Abrir la configuración de un widget cuyo plan sigue vacío. 
2. En el Editor de Planes, haz clic en **Iniciar con Plan de Muestra**. El Editor
   está lleno con el título "Sales Truck Launch", tres niveles, siete
   Categorías y participaciones basadas en el modelo del Plan de Lanzamiento de Camiones de Venta. 
3. Personaliza el titular, las capas, las categorías y las entradas para que se ajusten a tu proyecto
   O borra lo que no necesites. 
4. Haz clic en **Aplicar** y guarda la página. 

## Mantener capas

1. En el Editor de Planos, abre la pestaña **Capas**. 
2. Para crear una capa, haz clic en **Nueva Capa** e introduce
   Poned su nombre. 
3. Para renombrar una capa, cambia su nombre directamente en la lista. 
   Junto a cada nombre está cuántas entradas contiene la capa. 
4. Para cambiar el orden, mueve la capa con las flechas
   arriba o abajo. El orden aquí es el orden en el
   página y en la exportación de Excel. 
5. Para eliminar una capa, haz clic en **Eliminar**. ¿Sigue conteniendo"
   el editor pregunta si se mueven a otra capa
   — que seleccionas bajo **Target Level** — o si también se eliminan
   . Confirma con **Eliminar** o rompe con **Cancelar** 
   . 

## Mantener categorías

1. En el editor de planos, abre la pestaña **Categorías**. 
2. Para crear una categoría, haz clic en **Nueva categoría** y
   Introduce su nombre. 
3. En **Color**, selecciona una de las doce muestras de color o introduce
   **Valor hexagonal** introduce su propio color, por ejemplo '#E40045'. 
4. Para cambiar el orden de la leyenda, mover la categoría
   con las flechas apuntando hacia arriba o hacia abajo. 
5. Para eliminar una categoría, haz clic en **Eliminar**. Tus participaciones
   se conservan y se convierten en "sin categoría" (gris); la consulta menciona, 
   Cuántas entradas afecta esto. 

## Crea un hito

1. En el editor de planos, abre la pestaña **Entradas**. 
2. En **Añadir**, haz clic en **Hito**. El nuevo
   La entrada se llama "Nuevo Hito", está en medio de la vista previa y en
   del primer nivel; a la derecha aparece su forma. 
3. Introduce el **título** y, opcionalmente, una **descripción**. El
   La descripción aparece en los detalles, se mantienen los saltos de línea. 
4. Selecciona el **nivel** y la **categoría** — o "Sin categoría". 
5. Introduce la **fecha**. 
6. Bajo **Símbolo**, selecciona Diamante, Triángulo, Cuadrado o Círculo. 
7. Fijar **Tentativo** si la fecha aún no está fijada. 
8. Haz clic en **Aplicar** cuando todas las inscripciones estén listas. 

## Crear un periodo de tiempo

1. En la pestaña **Entradas**, bajo **Añadir**, haz clic
   **Punto**. La nueva entrada se llamará "Nuevo Periodo". 
2. Introduce **Título**, opcional **Descripción**, **Nivel** y
   **Categoría**. 
3. Introduce **Inicio** y **Fin**. Ambos días pertenecen al periodo. 
4. Pon **flecha al final** si el periodo ha pasado el final
   continúa. 
5. Establecer **Tentativo** si el inicio o el final aún no están fijos. 

Un hito puede cambiarse a un periodo de tiempo en cualquier momento bajo **Arte**
y viceversa. 

## Crea una fecha límite

1. En la pestaña **Entradas**, bajo **Añadir**, haz clic
   **Fecha límite**. 
2. Introduce **Título**, opcional **Descripción**, **Categoría** y
   **Fecha**. Aquí no hay nivel: Una fecha límite se aplica a la
   Todo el plan y recorre todos los niveles. 

Si un hito o periodo bajo **Art** se convierte en la fecha límite, no se aplica.
nivelado. 

## Combinan las entradas en una serie

1. En la pestaña **Entradas**, selecciona la primera entrada de la serie. 
2. Introduce un nombre bajo **Series**, por ejemplo "TG Assist MY26". 
3. Seleccionar la siguiente entrada de la misma capa e introducir bajo
   **Series** es exactamente el mismo nombre. El campo sugiere la serie que
   ya existe en este nivel. 
4. Repite el paso 3 para todas las entradas de la serie. 

Las series solo se aplican en un nivel. Busca idénticas
Ortografía: "TG Assist MY26" y "TG-Assist MY26" son dos cosas diferentes
serie. 

## Establecer una dependencia

1. En la pestaña **Entradas**, selecciona la entrada que ha sido creada por otra persona
   (el sucesor). 
2. En **Depende de**, encuentra y selecciona el predecesor. Múltiples
   Los predecesores son posibles. 
3. En la página, una línea punteada con una flecha conecta ahora el
   Predecesor con sucesor. 

Las dependencias solo existen entre hitos y periodos de tiempo, no para
plazos. Si una entrada se elimina, también desaparecerá de todas
Dependencias. 

## Duplicar y eliminar entradas

1. Seleccione la entrada en la pestaña **Entradas**. 
2. **Duplicar** crea una copia, que luego ajustas. 
3. **Eliminar** elimina la entrada y todas las dependencias que están en ella
   show. 

## Configura la vista principal

Sin vista inicial, el widget muestra todo el plan al cargar. ¿Debería hacerlo
En su lugar, muestra un extracto concreto, por ejemplo, los dos años siguientes: 

1. Ampliar y panear la **Vista previa** en el Editor de Planes hasta que
   puede verse en la sección deseada. 
2. Haz clic en **Esta sección como vista principal**. Guardando
   Al mes. 
3. Para mostrar el plan completo de nuevo, haz clic en **Iniciar vista
   Eliminar**. 
4. **Solicita**, guarda, revisa la vista previa de la página. 

Los lectores pueden hacer zoom en cualquier momento desde la vista principal o
**Mostrar todo** Consulta el plan completo. 

## Cambio después

1. Abrir de nuevo la configuración del widget. El Editor de Planes mostrará el
   Plan guardado. 
2. Selecciona la entrada en la lista de la pestaña **Entradas** o por
   Haz clic en la vista previa y modifica su formato. 
3. Haz clic en **Aplicar** y guarda la página. La fecha
   después de que "Estado:" se establezca al día del cambio. 

Haz clic en **Cancelar** para descartar todos los cambios desde la última vez que abriste la
Editores de plan. 

## Descarga el plan como una hoja de Excel (como lector)

1. Filtra y amplia el plano para que puedas ver lo que necesitas. 
2. Haz clic en **Exportar** en la barra de herramientas. En el estrecho
   el botón está en el menú **Más**. 
3. Elige el ámbito: 
   - **Vista actual** — solo las entradas en la sección visible que
     cumplir con todos los filtros activos; si la búsqueda está activa, solo los resultados. 
   - **Plan completo** — todas las entradas, sin filtros ni secciones. 

   Detrás de cada elección está el número de entradas que contiene. 
4. Haz clic en **Descargar Excel**. El archivo se llama como el
   Dirección del plan con la fecha de hoy, sin dirección
   'Projektplan_JJJJ-MM-TT.xlsx'. 

El archivo contiene la hoja **Planificación** con una línea por cada entrada (nivel, 
Tipo, título, categoría, inicio, fin, serie, preliminar, predecesor, 
descripción) y la hoja **Info** con título, estado, fecha de exportación, alcance y
Los filtros activos. 

## Cuando algo no funciona

1. **El widget no muestra nada en la página.** El plan aún no tiene uno.
   Entrada. Abre Configuración y establece al menos una
   Hito, periodo temporal o fecha límite. 
2. **El editor de planos no se abre.** Bajo **Plan** solo hay uno
   Cuadro de texto. Cierra y vuelve a abrir la configuración. Cambiar
   No cambies el contenido del campo de texto a mano — es lo técnico
   Versión aproximada del plan. 
3. **En la parte superior del editor de planos, dice que las entradas no se podían leer.** 
   Consulta las preguntas frecuentes de este informe. 
4. **Los lectores no encuentran el botón "Exportar".** Comprueba si
   **Ofrece exportación de Excel** activada.
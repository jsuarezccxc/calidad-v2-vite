## Recordatorio

- El nombre del **BRANCH** debe cumplir con las convenciones establecidas 
por ejemplo: **#NumeroDelIssueRedmine/nombre-modulo-descripcion**

- La descripción del **COMMIT** debe ser concisa y especificar la funcionalidad del modulo en la que se esta trabajando
**por ejemplo: ******
	- git commit -m "Filtro busqueda  por nombre agregada en el modulo X”
	- git commit -m "Arreglo falla en el login"

## Redmine
No. Issue | Path | Description
--- | --- | --- |
<a target='_blank' href='http://redmine.ccxc.co/issues/#'>#issue </a> | <a href='http://localhost:3000/example-page'>http://localhost:3000/example-page  | example: lore ipsum 

## Pull Request Backend
Esta sección será de uso indispensable al momento de generar un Pull Request a la rama de **calidad-hotfix** o **calidad-nombredelmodulo**, ya que le permitiran conocer al funcionario del equipo de calidad cuales serán los Pull Request de Backend que debe mergear para realizar las pruebas correctamente.
No. PR | Path PR | Titulo PR
--- | --- | --- |
	
## Parametros de aceptacion
Agregar una **X** en la casilla en donde se verifica el cumplimiento de cada uno de las pautas para desarrollo de front, en caso de que no aplique simplemente agrege un **N/A** en la casilla

| | Si | No
--- | --- | --- |
| 1.- Antes de subir un PR verificar si se realizo un `git pull origin develop --rebase `| | | 
| 2.- Los botones **[Atrás] [Siguiente]** de diggi pymes deben estar en la posición adecuada en cuanto al figma (parte inferior derecha)  |||
| 3.- El boton** [Siguiente]:** Dirige al usuario a la pantalla siguiente en cuanto a la tabla de operaciones (orden de pantallas) |||
| 4.- Cada elemento del **Markup**  concuerda con el diseño establecido en figma ? **(dimensiones, pixeles, posiciones, layouts) **   |||
| 5.- El boton **[Atrás]** dirige al usuario a la pantalla anterior en cuanto a la tabla de operaciones o historial de navegación ?   |  |  |
| 6.- Verificar que los inputs a excepcion de los de tipo **password** no presenten autocompletado |  |   |
| 7.- Verificar en el navegador en **modo incognito** que no exista alguna inconsistencia de lo desarrollado |  |   |
| 8.- Si el modulo desarrollado presenta cálculos, carga de datos, guardado de datos, validación de datos, verificar su correcto funcionamiento |  |  |
| 9.- Si la pantalla desarrollada presenta alguna tabla verificar que solo deben mostrarse 15 filas para luego aplicarle paginacion | | |
| 10.- Verificar en version mobile que los inputs cubran el ancho de pantalla y su correcto funcionamiento |  |   |
| 11.- Verificar el uso de la funcionalidad **getRouteName** para que el **titulo** y los **breadcumbs** del modulo coincidan con el elemento seleccionado en la **tabla de operaciones** |  | |
| 12.- Verificar que el layout no presente cambios en las tablas al momento de mostrar o no informacion  | | |
| 13.- Verificar que no se este utilizando **Magic Numbers** para arreglos ejemplo: **valueUser[0]** en caso del **0** se debe utilizar una constante o destructurar por ejemplo:    <br /> - `const username = valueUser[0]`<br /> - `const { username } = valueUser[0]` | | |
| 14.- Validar que el botón de siguiente cuente con el objeto de **name** y **moduleName**, para validar si la pantalla siguiente tiene o no acceso de acuerdo a la membresía  | | |
| 15.- Verificar que no existan **warnings** ni **errors** al momento de compilar  | | |

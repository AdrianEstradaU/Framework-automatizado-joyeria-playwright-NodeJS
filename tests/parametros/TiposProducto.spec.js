const { test, expect } = require('@playwright/test');
const { TiposProductoPage } = require('../../pages/TiposProductoPage.js');
const { tiposProductoData } = require('../../data/TiposProductoData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Módulo: Tipos de Producto', () => {
  let tiposProducto;

  test.beforeEach(async ({ page }) => {
    tiposProducto = new TiposProductoPage(page);
    await page.goto('/');
    logger.info('Página principal cargada correctamente.');
    logger.info('Accediendo al módulo Tipos de Producto...');
    await tiposProducto.abrirModulo();
    logger.info('Módulo Tipos de Producto abierto exitosamente.');
  });

  test('AE-TC-39. Crear tipo de producto válido @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-39: Crear tipo de producto válido ');

    await tiposProducto.crear(tiposProductoData.valid.nombre, tiposProductoData.valid.descripcion);
    logger.info(`Datos ingresados: nombre="${tiposProductoData.valid.nombre}", descripción="${tiposProductoData.valid.descripcion}".`);

    const toast = await tiposProducto.validarToast('El proceso se ha realizado exitosamente');
    expect(toast).toBeTruthy();
    logger.info('Mensaje de éxito validado correctamente.');
    await tiposProducto.seleccionarFila(tiposProductoData.valid.nombre); 
    logger.info(`Fila seleccionada: ${tiposProductoData.valid.nombre}`);
     await tiposProducto.btnEliminar.click(); logger.info('Botón eliminar presionado, confirmando eliminación...'); 
     await tiposProducto.confirmarEliminacion(); expect(await tiposProducto.validarToast()).toBeTruthy();
      logger.info('Mensaje de eliminación exitoso validado.'); 
    });
    

  test('AE-TC-40. Intentar crear tipo de producto con campos vacíos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-40: Intentar crear tipo de producto con campos vacíos ');

    const filasAntes = await tiposProducto.tabla.locator('tr').count();
    logger.info(`Filas iniciales en tabla: ${filasAntes}`);

    await tiposProducto.crear(tiposProductoData.invalid.nombre, tiposProductoData.invalid.descripcion);
    logger.info('Intento de creación con campos vacíos realizado.');

    const errorNombre = tiposProducto.page.locator('#joy_tipo_producto\\[nombre_tipo_producto\\]-error');
    await expect(errorNombre).toHaveText('Este campo es obligatorio');
    logger.info('Mensaje de validación de campo obligatorio mostrado correctamente.');

    const filasDespues = await tiposProducto.tabla.locator('tr').count();
    expect(filasDespues).toBe(filasAntes);
    logger.info('Validación completada: no se creó ningún registro nuevo.');
  });

test('AE-TC-41. Editar tipo de producto existente con datos válidos @Regression @positive', async () => {
  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('major');
  logger.info('AE-TC-41: Editar tipo de producto existente con datos válidos');

  const nombreOriginal = `EDIT-${Date.now()}`;
  const descripcionOriginal = 'Producto temporal';
  const nombreEditado = `${nombreOriginal}-MOD`;
  const descripcionEditada = 'Tipo de producto modificado';

  try {
   
    await tiposProducto.crear(nombreOriginal, descripcionOriginal);
    expect(await tiposProducto.validarToast()).toBeTruthy();
    logger.info(`Registro temporal creado: ${nombreOriginal}`);

  
    await tiposProducto.editar(nombreOriginal, nombreEditado, descripcionEditada);
    expect(await tiposProducto.validarToast()).toBeTruthy();
    logger.info(`Registro editado: ${nombreEditado}`);

   
    await tiposProducto.btnActualizar.click();
    const filaEditada = tiposProducto.tabla.locator(`tr:has-text("${nombreEditado}")`);
    await filaEditada.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Fila editada visible en la tabla.');

    
    const filas = await tiposProducto.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEditado))).toBeTruthy();
    logger.info('Validación exitosa: el nombre editado se refleja en la tabla.');

  } finally {
  
    try {
      await tiposProducto.btnActualizar.click();

      const filaTeardown = tiposProducto.tabla.locator(`tr:has-text("${nombreEditado}")`);
      if ((await filaTeardown.count()) > 0) {
        await filaTeardown.scrollIntoViewIfNeeded();
        await filaTeardown.click();
        await tiposProducto.btnEliminar.click();
        await tiposProducto.confirmarEliminacion();
        logger.info(`Registro ${nombreEditado} eliminado correctamente en teardown.`);
      } else {
        logger.info(`Registro ${nombreEditado} no encontrado para eliminar.`);
      }
    } catch (error) {
      logger.error(`Error eliminando registro ${nombreEditado} en teardown: ${error}`);
    }
  }
});


  test('AE-TC-42. Eliminar tipo de producto existente @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-42: Eliminar tipo de producto existente ');

    const nombreEliminar = `DEL-${Date.now()}`;
    const descripcionEliminar = 'Tipo de producto temporal';
    await tiposProducto.crear(nombreEliminar, descripcionEliminar);
    expect(await tiposProducto.validarToast()).toBeTruthy();
    logger.info(`Registro temporal creado para eliminación: ${nombreEliminar}`);

    await tiposProducto.seleccionarFila(nombreEliminar);
    logger.info(`Fila seleccionada: ${nombreEliminar}`);

    await tiposProducto.btnEliminar.click();
    logger.info('Botón eliminar presionado, confirmando eliminación...');
    await tiposProducto.confirmarEliminacion();

    expect(await tiposProducto.validarToast()).toBeTruthy();
    logger.info('Mensaje de eliminación exitoso validado.');

    await tiposProducto.btnActualizar.click();
    const filas = await tiposProducto.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEliminar))).toBeFalsy();
    logger.info('Validación exitosa: el registro fue eliminado de la tabla.');
  });

  test('AE-TC-43. Validar límite de 64 caracteres en nombre de tipo de producto @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-43: Validar límite de 64 caracteres en nombre de tipo de producto ');

    await tiposProducto.crear(tiposProductoData.limites.nombreLargo, tiposProductoData.valid.descripcion);
    logger.info(`Longitud del nombre ingresado: ${tiposProductoData.limites.nombreLargo.length}`);

    const toast = await tiposProducto.validarToast('El formato JSON solicitado ha fallado.');
    expect(toast).toBeTruthy();
    logger.info('Validación completada: sistema no permite nombres mayores a 64 caracteres.');
  });

  test('AE-TC-44. Validar límite en descripción de tipo de producto @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-44: Validar límite de caracteres en descripción de tipo de producto ');

    const descripcionLarga = tiposProductoData.limites.descripcionLarga;
    await tiposProducto.click(tiposProducto.btnCrear);
    logger.info('Formulario de creación abierto.');

    await tiposProducto.fill(tiposProducto.inputNombre, 'TEST-LIMITE');
    await tiposProducto.fill(tiposProducto.textareaDescripcion, descripcionLarga);
    logger.info(`Descripción ingresada de longitud: ${descripcionLarga.length}`);

    const valor = await tiposProducto.textareaDescripcion.inputValue();
    expect(valor.length).toBeGreaterThan(0);
    logger.info('Validación completada: el campo descripción acepta texto largo.');
  });

  test('AE-TC-45. Buscar tipo de producto en la tabla @Smoke @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-45: Buscar tipo de producto en la tabla ');

    const buscador = tiposProducto.page.locator('input[type="search"]');
    await buscador.fill(tiposProductoData.busqueda.termino);
    logger.info(`Término de búsqueda ingresado: "${tiposProductoData.busqueda.termino}"`);

    const filasVisibles = tiposProducto.tabla.locator('tr');
    const cantidad = await filasVisibles.count();
    logger.info(`Resultados encontrados: ${cantidad}`);
    expect(cantidad).toBeGreaterThan(0);
    logger.info('Validación exitosa: resultados de búsqueda visibles.');
  });

  test('AE-TC-46. Cancelar eliminación de tipo de producto @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-46: Cancelar eliminación de tipo de producto ');

    const primerFila = tiposProducto.tabla.locator('tr').first();
    await primerFila.click();
    logger.info('Primera fila seleccionada.');

    await tiposProducto.btnEliminar.click();
    logger.info('Se presionó el botón eliminar, cancelando acción...');
    await tiposProducto.cancelarEliminacion();

    await expect(tiposProducto.tabla).toBeVisible();
    logger.info('Validación completada: la tabla permanece visible tras cancelar eliminación.');
  });

  test('AE-TC-47. Seleccionar registro de tipo de producto en la tabla @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-47: Seleccionar registro de tipo de producto en la tabla');

    const primerFila = tiposProducto.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();
    logger.info(`Registro seleccionado: ${primerNombre}`);

    await tiposProducto.seleccionarFila(primerNombre);
    const seleccionadas = tiposProducto.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
    logger.info('Validación completada: selección única confirmada.');
  });

  test('AE-TC-48. Verificar que el botón actualizar refresca la tabla de tipos de producto @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('major');
    logger.info(' AE-TC-48: Verificar que el botón actualizar refresca la tabla ');

    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro temporal para refrescar';
    await tiposProducto.crear(nombreRegistro, descripcionRegistro);
    expect(await tiposProducto.validarToast()).toBeTruthy();
    logger.info(`Registro temporal creado: ${nombreRegistro}`);

    await tiposProducto.seleccionarFila(nombreRegistro);
    await tiposProducto.btnEliminar.click();
    await tiposProducto.confirmarEliminacion();
    expect(await tiposProducto.validarToast()).toBeTruthy();
    logger.info('Registro eliminado correctamente.');

    await tiposProducto.btnActualizar.click();

    await tiposProducto.page.waitForFunction(
  (tablaSelector, nombreRegistro) => {
    const filas = Array.from(document.querySelectorAll(`${tablaSelector} tr`));
    return !filas.some(f => f.textContent.includes(nombreRegistro));
  },
  tiposProducto.tabla.selector,
  nombreRegistro,
  { timeout: 5000 } // espera hasta 5 segundos
);
const filas = await tiposProducto.tabla.locator('tr').allTextContents();
expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();
logger.info('Validación completada: la tabla se refresca correctamente.');
  });
});

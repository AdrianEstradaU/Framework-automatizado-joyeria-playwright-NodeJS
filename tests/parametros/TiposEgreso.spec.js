const { test, expect } = require('@playwright/test');
const { TiposEgresoPage } = require('../../pages/TiposEgresoPage.js');
const { tiposEgresoData } = require('../../data/TiposEgresoData.js');
const logger = require('../../utils/loggers.js');
const { allure } = require('allure-playwright');

test.describe('Módulo: Tipos de Egreso', () => {
  let tiposEgreso;

  test.beforeEach(async ({ page }) => {
    tiposEgreso = new TiposEgresoPage(page);
    await page.goto('/');
    await tiposEgreso.abrirModulo();
    logger.info('Navegación al módulo Tipos de Egreso completada');
  });

  test('AE-TC-49. Crear tipo de egreso con datos válidos @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-49: Iniciando creación de tipo de egreso válido');

    await tiposEgreso.crear(
      tiposEgresoData.valid.nombre,
      tiposEgresoData.valid.descripcion,
      tiposEgresoData.valid.rol
    );
    logger.info('Datos de tipo de egreso ingresados correctamente');

    expect(await tiposEgreso.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
    logger.info('Validación de creación exitosa');
    await tiposEgreso.seleccionarFila(tiposEgresoData.valid.nombre);
  await tiposEgreso.btnEliminar.click();
  await tiposEgreso.confirmarEliminacion();
  logger.info('Confirmación de eliminación ejecutada');

  expect(await tiposEgreso.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  logger.info('Validación de eliminación exitosa');

  });

  test('AE-TC-50. Intentar crear tipo de egreso con campos vacíos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('major');
    logger.info('AE-TC-50: Intentando crear tipo de egreso con campos vacíos');

    const filasAntes = await tiposEgreso.tabla.locator('tr').count();
    await tiposEgreso.crear(
      tiposEgresoData.invalid.nombre,
      tiposEgresoData.invalid.descripcion,
      tiposEgresoData.invalid.rol
    );

    const errorNombre = tiposEgreso.page.locator('input[name="joy_tipo_egreso[nombre_tipo_egreso]"] + span');
    await expect(errorNombre).toHaveText(/obligatorio/i);
    logger.info('Validación de mensaje de campo obligatorio exitosa');

    const filasDespues = await tiposEgreso.tabla.locator('tr').count();
    expect(filasDespues).toBe(filasAntes);
    logger.info('Confirmación de que no se agregó nuevo registro');
  });

  test('AE-TC-51. Editar tipo de egreso existente con datos válidos @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-51: Iniciando edición de tipo de egreso existente');

    const nombreOriginal = `EGRESO-${Date.now()}`;
    const descripcionOriginal = 'Tipo de egreso temporal';
    await tiposEgreso.crear(nombreOriginal, descripcionOriginal);
    expect(await tiposEgreso.validarToast()).toBeTruthy();

    const nombreEditado = `${nombreOriginal}-EDIT`;
    const descripcionEditada = 'Tipo de egreso modificado';
    await tiposEgreso.editar(nombreOriginal, nombreEditado, descripcionEditada);

    const filaEditada = tiposEgreso.tabla.locator(`tr:has-text("${nombreEditado}")`).first();
    await filaEditada.waitFor({ state: 'visible', timeout: 15000 });

    const filas = await tiposEgreso.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEditado))).toBeTruthy();
    logger.info('Validación de edición exitosa');
    await tiposEgreso.seleccionarFila(nombreEditado);
  await tiposEgreso.btnEliminar.click();
  await tiposEgreso.confirmarEliminacion();
  logger.info('Confirmación de eliminación ejecutada');

  expect(await tiposEgreso.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  logger.info('Validación de eliminación exitosa');
  });

  test('AE-TC-52. Eliminar tipo de egreso existente y validar eliminación @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-52: Iniciando creación de tipo de egreso para eliminar');

    const nombreEliminar = `DEL-${Date.now()}`;
    const descripcionEliminar = 'Tipo de egreso temporal';

    await tiposEgreso.crear(nombreEliminar, descripcionEliminar);
    expect(await tiposEgreso.validarToast()).toBeTruthy();

    await tiposEgreso.seleccionarFila(nombreEliminar);
    await tiposEgreso.btnEliminar.click();
    await tiposEgreso.confirmarEliminacion();
    expect(await tiposEgreso.validarToast()).toBeTruthy();
    logger.info('Validación de eliminación exitosa');

    await tiposEgreso.page.waitForTimeout(1000);
    await expect(tiposEgreso.tabla.locator(`text=${nombreEliminar}`)).toHaveCount(0, { timeout: 5000 });

    await tiposEgreso.btnActualizar.click();
    const filas = await tiposEgreso.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEliminar))).toBeFalsy();
    logger.info('Confirmación de que el registro fue eliminado correctamente');
  });

  test('AE-TC-53. Validar límite de 64 caracteres en nombre de tipo de egreso @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-53: Verificando límite de 64 caracteres en el nombre');

    await tiposEgreso.crear(
      tiposEgresoData.limites.nombreLargo,
      tiposEgresoData.valid.descripcion
    );
    expect(await tiposEgreso.validarToast('El formato JSON solicitado ha fallado.')).toBeTruthy();
    logger.info('Validación de límite de caracteres completada');
  });

  test('AE-TC-54. Validar límite en descripción de tipo de egreso @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-54: Validando longitud máxima en descripción');

    const descripcionLarga = tiposEgresoData.limites.descripcionLarga;

    await tiposEgreso.click(tiposEgreso.btnCrear);
    await tiposEgreso.fill(tiposEgreso.inputNombre, 'TEST-LIMITE');
    await tiposEgreso.fill(tiposEgreso.textareaDescripcion, descripcionLarga);

    const valor = await tiposEgreso.textareaDescripcion.inputValue();
    expect(valor.length).toBeGreaterThan(0);
    logger.info('Validación de longitud en descripción completada');
  });

  test('AE-TC-55. Buscar tipo de egreso en la tabla @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-55: Iniciando búsqueda de tipo de egreso en la tabla');

    const buscador = tiposEgreso.page.locator('input[type="search"]');
    await buscador.fill(tiposEgresoData.busqueda.termino || 'COMPRA');

    const filasVisibles = tiposEgreso.tabla.locator('tr');
    expect(await filasVisibles.count()).toBeGreaterThan(0);
    logger.info('Validación de resultados de búsqueda completada');
  });

  test('AE-TC-56. Cancelar eliminación de tipo de egreso y validar permanencia @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-56: Probando cancelación de eliminación de tipo de egreso');

    const primerFila = tiposEgreso.tabla.locator('tr').first();
    await primerFila.click();

    await tiposEgreso.btnEliminar.click();
    await tiposEgreso.cancelarEliminacion();

    await expect(tiposEgreso.tabla).toBeVisible();
    logger.info('Validación de cancelación de eliminación completada');
  });

  test('AE-TC-57. Seleccionar registro de tipo de egreso en la tabla @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-57: Seleccionando registro en la tabla');

    const primerFila = tiposEgreso.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();

    await tiposEgreso.seleccionarFila(primerNombre);

    const seleccionadas = tiposEgreso.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
    logger.info('Validación de selección en tabla completada');
  });

  test('AE-TC-58. Verificar que el botón "Actualizar" refresca la tabla de tipos de egreso @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-58: Validando funcionalidad del botón Actualizar');

    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro para refrescar';

    await tiposEgreso.crear(nombreRegistro, descripcionRegistro);
    expect(await tiposEgreso.validarToast()).toBeTruthy();

    await tiposEgreso.seleccionarFila(nombreRegistro);
    await tiposEgreso.btnEliminar.click();
    await tiposEgreso.confirmarEliminacion();
    expect(await tiposEgreso.validarToast()).toBeTruthy();

    await tiposEgreso.page.waitForSelector(`text=${nombreRegistro}`, { state: 'detached', timeout: 5000 });

    await tiposEgreso.btnActualizar.click();
    const filas = await tiposEgreso.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();
    logger.info('Validación de refresco de tabla completada');
  });
});

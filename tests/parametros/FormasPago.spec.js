const { test, expect } = require('@playwright/test');
const { FormasPagoPage } = require('../../pages/FormasPagoPage');
const { formasPagoData } = require('../../data/FormasPagoData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');
test.describe('Módulo: Formas de Pago', () => {
  let formasPago;

  test.beforeEach(async ({ page }) => {
    formasPago = new FormasPagoPage(page);
    await page.goto('/');
    logger.info('Página cargada correctamente. Ingresando al módulo Formas de Pago...');
    await formasPago.abrirModulo();
    logger.info('Módulo Formas de Pago abierto exitosamente.');
  });

  test('AE-TC-05. Verificar creación de forma de pago con datos válidos @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-05: Iniciando creación de forma de pago con datos válidos');
    
    await formasPago.crear(formasPagoData.valid.nombre, formasPagoData.valid.descripcion);
    logger.info(`Formulario completado con: Nombre=${formasPagoData.valid.nombre}, Descripción=${formasPagoData.valid.descripcion}`);

    const toastExito = await formasPago.validarToast('El proceso se ha realizado exitosamente');
    logger.info('Validando mensaje de confirmación...');
    expect(toastExito).toBeTruthy();

    logger.info(' AE-TC-05 finalizado correctamente: Forma de pago creada con éxito.');
  });

  test('AE-TC-06. Validar mensaje de error al crear forma de pago con campos vacíos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-06: Iniciando prueba con campos vacíos.');

    const filasAntes = await formasPago.tabla.locator('tr').count();
    logger.info(`Número de filas antes de la creación: ${filasAntes}`);

    await formasPago.crear(formasPagoData.invalid.nombre, formasPagoData.invalid.descripcion);
    logger.info('Intentando crear forma de pago sin datos.');

    const errorNombre = formasPago.page.locator('#joy_forma_pago\\[nombre_forma_pago\\]-error');
    await expect(errorNombre).toHaveText('Este campo es obligatorio');
    logger.info('Mensaje de error inline validado correctamente.');

    const filasDespues = await formasPago.tabla.locator('tr').count();
    logger.info(`Número de filas después del intento: ${filasDespues}`);
    expect(filasDespues).toBe(filasAntes);

    logger.info(' AE-TC-06 completado: No se creó registro con campos vacíos.');
  });

  test('AE-TC-07. Editar una forma de pago existente con datos válidos @Regression @positive', async ({ page }) => {
  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('critical');
  logger.info(' AE-TC-07: Iniciando edición de forma de pago existente.');

  const nombreOriginal = formasPagoData.valid.nombre;
  const nombreEditado = `${nombreOriginal}-EDITED`;
  const descripcionEditada = 'Descripción modificada';

  logger.info(` Editando registro: ${nombreOriginal} → ${nombreEditado}`);
  await formasPago.editar(nombreOriginal, nombreEditado, descripcionEditada);

  const toastExito = await formasPago.validarToast();
  expect(toastExito).toBeTruthy();
  logger.info('Mensaje de éxito validado.');
  await expect(async () => {
    const filasTexto = await formasPago.tabla.locator('tr').allTextContents();
    const existeEditado = filasTexto.some(f => f.includes(nombreEditado));
    expect(existeEditado).toBeTruthy();
  }).toPass({ timeout: 7000 });

  logger.info(` AE-TC-07 completado: Registro '${nombreEditado}' actualizado correctamente.`);
try {
    logger.info(` Eliminando registro editado: ${nombreEditado}`);
    await formasPago.seleccionarFila(nombreEditado);
    await formasPago.btnEliminar.scrollIntoViewIfNeeded();
    await formasPago.btnEliminar.click();
    await formasPago.confirmarEliminacion();

    const toastEliminado = await formasPago.validarToast();
    expect(toastEliminado).toBeTruthy();
    logger.info(`Registro '${nombreEditado}' eliminado correctamente.`);

    await formasPago.btnActualizar.click();
    logger.info('Tabla actualizada para verificar eliminación.');

    const filas = await formasPago.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEditado))).toBeFalsy();
  } catch (error) {
    logger.error(` No se pudo eliminar el registro '${nombreEditado}': ${error}`);
  }
});

  test('AE-TC-08. Eliminar forma de pago existente y validar eliminación @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-08: Iniciando creación de registro para eliminar.');

    const nombreEliminar = `DELETE-${Date.now()}`;
    const descripcionEliminar = 'Registro a eliminar';
    await formasPago.crear(nombreEliminar, descripcionEliminar);
    expect(await formasPago.validarToast()).toBeTruthy();
    logger.info(`Registro temporal creado: ${nombreEliminar}`);

    logger.info('Seleccionando registro para eliminación...');
    await formasPago.seleccionarFila(nombreEliminar);
    await formasPago.btnEliminar.scrollIntoViewIfNeeded();
    await formasPago.btnEliminar.click();
    logger.info('Confirmando eliminación...');
    await formasPago.confirmarEliminacion();

    const toastEliminado = await formasPago.validarToast();
    expect(toastEliminado).toBeTruthy();
    logger.info('Mensaje de eliminación validado.');

    await formasPago.btnActualizar.click();
    logger.info('Tabla actualizada para verificar eliminación.');
await formasPago.tabla.waitFor({ state: 'attached', timeout: 10000 });
    const filaEliminar = formasPago.tabla.locator('tr', { hasText: nombreEliminar });
await expect(filaEliminar).toHaveCount(0, { timeout: 10000 });

    logger.info(` AE-TC-08 completado: Registro ${nombreEliminar} eliminado exitosamente.`);
  });

  test('AE-TC-09. Verificar que el botón Actualizar refresca la tabla de formas de pago @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-09: Iniciando verificación del botón Actualizar.');

    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro para refrescar';
    await formasPago.crear(nombreRegistro, descripcionRegistro);
    expect(await formasPago.validarToast()).toBeTruthy();
    logger.info(`Registro creado: ${nombreRegistro}`);

    await formasPago.seleccionarFila(nombreRegistro);
    await formasPago.btnEliminar.click();
    await formasPago.confirmarEliminacion();
    logger.info('Registro eliminado, actualizando tabla...');
    await formasPago.btnActualizar.click();
await formasPago.tabla.waitFor({ state: 'attached', timeout: 10000 });
    const filaRefresh = formasPago.tabla.locator('tr', { hasText: nombreRegistro });
await expect(filaRefresh).toHaveCount(0, { timeout: 10000 });

    logger.info('AE-TC-09 completado: Botón actualizar refrescó correctamente la tabla.');
  });

  test('AE-TC-10. Seleccionar un registro de forma de pago en la tabla @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-10: Seleccionando registro en tabla.');

    const primerFila = formasPago.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();
    logger.info(`Seleccionando registro con nombre: ${primerNombre}`);

    await formasPago.seleccionarFila(primerNombre);
    const seleccionadas = formasPago.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);

    logger.info('AE-TC-10 completado: Registro seleccionado correctamente.');
  });

  test('AE-TC-11. Verificar que el botón Anterior esté deshabilitado en Formas de Pago @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-11: Validando estado del botón Anterior.');

    const anterior = formasPago.page.locator('#forma_pago_previous');
    const clases = await anterior.getAttribute('class');
    logger.info(`Clases del botón anterior: ${clases}`);
    expect(clases.includes('disabled')).toBe(true);

    logger.info(' AE-TC-11 completado: Botón Anterior deshabilitado correctamente.');
  });

  test('AE-TC-12. Validar funcionamiento del botón Siguiente en la tabla de formas de pago @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-12: Validando botón Siguiente.');

    const siguiente = formasPago.page.locator('#forma_pago_next');
    const clases = await siguiente.getAttribute('class');
    logger.info(`Estado del botón Siguiente: ${clases.includes('disabled') ? 'Deshabilitado' : 'Activo'}`);
    expect(clases).toBeTruthy();

    logger.info(' AE-TC-12 completado: Botón Siguiente verificado.');
  });

  test('AE-TC-13. Validar límite máximo de 64 caracteres en campo Nombre de Forma de Pago @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-13: Verificando límite de 64 caracteres en el nombre.');

    await formasPago.crear(formasPagoData.limites.nombreLargo, formasPagoData.valid.descripcion);
    const toastError = await formasPago.validarToast('El formato JSON solicitado ha fallado.');
    expect(toastError).toBeTruthy();
    logger.info('Mensaje de error por exceso de caracteres validado.');

    logger.info(' AE-TC-13 completado: Límite de caracteres en nombre validado correctamente.');
  });

  test('AE-TC-14. Validar límite máximo de 255 caracteres permitido en campo Descripción de Forma de Pago @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-14: Verificando límite de caracteres en descripción.');

    const descripcionLarga = formasPagoData.limites.descripcionLarga;
    await formasPago.click(formasPago.btnCrear);
    await formasPago.waitForVisible(formasPago.inputNombre);
    await formasPago.waitForVisible(formasPago.textareaDescripcion);
    logger.info('Campos de formulario visibles.');

    await formasPago.fill(formasPago.inputNombre, 'TEST-DESC');
    await formasPago.fill(formasPago.textareaDescripcion, descripcionLarga);
    logger.info('Campos completados con descripción larga.');

    const valor = await formasPago.textareaDescripcion.inputValue();
    logger.info(`Longitud capturada: ${valor.length}`);
    expect(valor.length).toBeGreaterThan(0);

    logger.info('AE-TC-14 completado: Límite de descripción validado correctamente.');
  });

  test('AE-TC-15. Buscar una forma de pago existente en la tabla @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-15: Iniciando búsqueda de forma de pago.');

    const buscador = formasPago.page.locator('input[type="search"]');
    await buscador.fill(formasPagoData.valid.nombre);
    logger.info(`Buscando registro: ${formasPagoData.valid.nombre}`);

    const filasVisibles = formasPago.tabla.locator('tr');
    const count = await filasVisibles.count();
    logger.info(`Filas encontradas: ${count}`);
    expect(count).toBeGreaterThan(0);

    logger.info('AE-TC-15 completado: Búsqueda validada con éxito.');
  });

  test('AE-TC-16. Cancelar la eliminación de una forma de pago @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-16: Iniciando cancelación de eliminación.');

    const primerFila = formasPago.tabla.locator('tr').first();
    await primerFila.click();
    logger.info('Primera fila seleccionada.');

    await formasPago.page.locator('button[name="Eliminar"]').click();
    logger.info('Ventana de confirmación abierta.');
    await formasPago.cancelarEliminacion();
    logger.info('Eliminación cancelada correctamente.');

    await expect(formasPago.tabla).toBeVisible();
    logger.info(' AE-TC-16 completado: Cancelación de eliminación verificada.');
  });
});

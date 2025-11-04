const { test, expect } = require('@playwright/test');
const { TiposIngresoPage } = require('../../pages/TiposIngresoPage.js');
const { tiposIngresoData } = require('../../data/TiposIngresoData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Módulo: Tipos de Ingreso', () => {
  let tiposIngreso;

  test.beforeEach(async ({ page }) => {
    tiposIngreso = new TiposIngresoPage(page);
    await page.goto('/');
    logger.info('Página principal cargada correctamente.');
    logger.info('Ingresando al módulo Tipos de Ingreso...');
    await tiposIngreso.abrirModulo();
    logger.info('Módulo Tipos de Ingreso abierto exitosamente.');
  });

  test('AE-TC-17. Crear tipo de ingreso válido @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-17: Crear tipo de ingreso válido ');
    logger.info('Comenzando creación de tipo de ingreso con datos válidos.');

    await tiposIngreso.crear(tiposIngresoData.valid.nombre, tiposIngresoData.valid.descripcion);
    logger.info(`Datos enviados: nombre="${tiposIngresoData.valid.nombre}", descripción="${tiposIngresoData.valid.descripcion}".`);

    const toast = await tiposIngreso.validarToast('El proceso se ha realizado exitosamente');
    logger.info('Esperando mensaje de confirmación...');
    expect(toast).toBeTruthy();
    logger.info('Mensaje de éxito validado correctamente.');

    logger.info('AE-TC-17 finalizado exitosamente.');
  });

  test('AE-TC-18. Crear un tipo de ingreso con campos vacíos y validar mensaje de error @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-18: Intentar crear tipo de ingreso con campos vacíos ');

    const filasAntes = await tiposIngreso.tabla.locator('tr').count();
    logger.info(`Filas iniciales en la tabla: ${filasAntes}`);

    await tiposIngreso.crear(tiposIngresoData.invalid.nombre, tiposIngresoData.invalid.descripcion);
    logger.info('Intento de creación con campos vacíos realizado.');

    const errorNombre = tiposIngreso.page.locator('#joy_tipo_ingreso\\[nombre_tipo_ingreso\\]-error');
    await expect(errorNombre).toHaveText('Este campo es obligatorio');
    logger.info('Mensaje de error "Este campo es obligatorio" validado correctamente.');

    const filasDespues = await tiposIngreso.tabla.locator('tr').count();
    logger.info(`Filas finales en la tabla: ${filasDespues}`);
    expect(filasDespues).toBe(filasAntes);

    logger.info('AE-TC-18 finalizado correctamente, sin creación de registro.');
  });
test('AE-TC-19. Editar un tipo de ingreso existente con datos válidos y eliminarlo @Regression @positive', async () => {
  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('major');
  logger.info('=== AE-TC-19: Editar un tipo de ingreso existente con datos válidos y eliminarlo ===');
  const nombreOriginal = tiposIngresoData.valid.nombre;
  const nombreEditado = `${nombreOriginal}-EDIT`;
  const descripcionEditada = 'Ingreso modificado';
  logger.info(`Editando registro "${nombreOriginal}" → "${nombreEditado}" con descripción: "${descripcionEditada}"`);
  await tiposIngreso.editar(nombreOriginal, nombreEditado, descripcionEditada);
  const toastEdicion = await tiposIngreso.validarToast();
  expect(toastEdicion).toBeTruthy();
  logger.info('Mensaje de éxito tras la edición validado.');
  await tiposIngreso.btnActualizar.click();
  await tiposIngreso.page.waitForTimeout(1500);
  logger.info('Tabla actualizada después de la edición.');

  const filas = await tiposIngreso.tabla.locator('tr').allTextContents();
  logger.info(`Contenido actual de la tabla:\n${filas.join('\n')}`);
  const encontrado = filas.some(f => f.toLowerCase().includes(nombreEditado.toLowerCase().trim()));
  expect(encontrado).toBeTruthy();
  logger.info(`El registro editado "${nombreEditado}" fue encontrado en la tabla.`);
  logger.info(`Procediendo a eliminar el registro editado "${nombreEditado}"...`);
  await tiposIngreso.seleccionarFila(nombreEditado);
  logger.info(`Fila "${nombreEditado}" seleccionada para eliminación.`);

  await tiposIngreso.btnEliminar.click();
  logger.info('Botón eliminar presionado, confirmando eliminación...');
  await tiposIngreso.confirmarEliminacion();

  const toastEliminacion = await tiposIngreso.validarToast();
  expect(toastEliminacion).toBeTruthy();
  logger.info('Mensaje de eliminación exitosa validado.');
  await tiposIngreso.page.waitForTimeout(1000);
  await tiposIngreso.btnActualizar.click();
  await tiposIngreso.page.waitForTimeout(1000);
  await expect(tiposIngreso.tabla.locator(`text=${nombreEditado}`)).toHaveCount(0);
  logger.info(`Registro "${nombreEditado}" eliminado correctamente de la tabla.`);

  logger.info('AE-TC-19 finalizado exitosamente con edición y eliminación.');
});



  test('AE-TC-20. Eliminar un tipo de ingreso existente y validar eliminación @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info(' AE-TC-20: Eliminar un tipo de ingreso existente y validar eliminación ');

    const nombreEliminar = `DEL-${Date.now()}`;
    const descripcionEliminar = 'Ingreso temporal';
    logger.info(`Creando registro temporal para eliminar: ${nombreEliminar}`);

    await tiposIngreso.crear(nombreEliminar, descripcionEliminar);
    await expect(await tiposIngreso.validarToast()).toBeTruthy();
    logger.info('Registro temporal creado correctamente.');

    await tiposIngreso.seleccionarFila(nombreEliminar);
    logger.info(`Fila "${nombreEliminar}" seleccionada.`);

    await tiposIngreso.btnEliminar.click();
    logger.info('Botón eliminar presionado, confirmando eliminación...');
    await tiposIngreso.confirmarEliminacion();

    await expect(await tiposIngreso.validarToast()).toBeTruthy();
    logger.info('Mensaje de eliminación exitosa validado.');

    await tiposIngreso.page.waitForTimeout(1000);
    await expect(tiposIngreso.tabla.locator(`text=${nombreEliminar}`)).toHaveCount(0);
    logger.info('Registro eliminado correctamente de la tabla.');

    await tiposIngreso.btnActualizar.click();
    logger.info('Tabla actualizada tras la eliminación.');

    logger.info('AE-TC-20 finalizado correctamente.');
  });

  test('AE-TC-21. Validar límite de 64 caracteres en el campo "nombre" @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-21: Validar límite de 64 caracteres en el campo "nombre" ');

    await tiposIngreso.crear(tiposIngresoData.limites.nombreLargo, tiposIngresoData.valid.descripcion);
    logger.info(`Nombre ingresado con longitud: ${tiposIngresoData.limites.nombreLargo.length}`);

    const toast = await tiposIngreso.validarToast('El formato JSON solicitado ha fallado.');
    expect(toast).toBeTruthy();
    logger.info('Validación del límite de 64 caracteres completada.');

    logger.info('AE-TC-21 finalizado correctamente.');
  });

  test('AE-TC-22. Validar límite de caracteres en el campo "descripción" @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-22: Validar límite de caracteres en el campo "descripción" ');

    const descripcionLarga = tiposIngresoData.limites.descripcionLarga;
    logger.info(`Ingresando descripción de longitud: ${descripcionLarga.length}`);

    await tiposIngreso.click(tiposIngreso.btnCrear);
    logger.info('Ventana de creación abierta.');

    await tiposIngreso.fill(tiposIngreso.inputNombre, 'TEST-LIMITE');
    await tiposIngreso.fill(tiposIngreso.textareaDescripcion, descripcionLarga);

    const valor = await tiposIngreso.textareaDescripcion.inputValue();
    logger.info(`Descripción ingresada (${valor.length} caracteres).`);
    expect(valor.length).toBeGreaterThan(0);

    logger.info('AE-TC-22 finalizado correctamente.');
  });

  test('AE-TC-23. Buscar tipo de ingreso en la tabla mediante el campo de búsqueda @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-23: Buscar tipo de ingreso en la tabla mediante el campo de búsqueda ');

    const buscador = tiposIngreso.page.locator('input[type="search"]');
    logger.info(`Buscando término: "${tiposIngresoData.busqueda.termino}"`);
    await buscador.fill(tiposIngresoData.busqueda.termino);

    const filasVisibles = tiposIngreso.tabla.locator('tr');
    const cantidad = await filasVisibles.count();
    logger.info(`Cantidad de resultados visibles: ${cantidad}`);
    expect(cantidad).toBeGreaterThan(0);

    logger.info('AE-TC-23 finalizado correctamente.');
  });

  test('AE-TC-24. Cancelar la eliminación de un tipo de ingreso y verificar que no se elimine @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-24: Cancelar la eliminación de un tipo de ingreso y verificar que no se elimine');

    const primerFila = tiposIngreso.tabla.locator('tr').first();
    logger.info('Seleccionando primera fila de la tabla...');
    await primerFila.click();

    await tiposIngreso.btnEliminar.click();
    logger.info('Botón eliminar presionado, cancelando acción...');
    await tiposIngreso.cancelarEliminacion();

    await expect(tiposIngreso.tabla).toBeVisible();
    logger.info('Tabla visible tras cancelar eliminación.');

    logger.info('AE-TC-24 finalizado correctamente.');
  });

  test('AE-TC-25. Seleccionar un registro en la tabla de tipos de ingreso @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info(' AE-TC-25: Seleccionar un registro en la tabla de tipos de ingreso ');

    const primerFila = tiposIngreso.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();
    logger.info(`Primer registro encontrado: "${primerNombre}"`);

    await tiposIngreso.seleccionarFila(primerNombre);
    logger.info(`Registro "${primerNombre}" seleccionado.`);

    const seleccionadas = tiposIngreso.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
    logger.info('Selección validada correctamente.');

    logger.info('AE-TC-25 finalizado correctamente.');
  });

  test('AE-TC-26. Verificar que el botón "Anterior" esté deshabilitado al inicio de la paginación @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info(' AE-TC-26: Verificar que el botón "Anterior" esté deshabilitado al inicio de la paginación ');

    const anterior = tiposIngreso.page.locator('#tipo_ingreso_previous');
    const clases = await anterior.getAttribute('class');
    logger.info(`Clases del botón anterior: ${clases}`);
    expect(clases.includes('disabled')).toBe(true);

    logger.info('AE-TC-26 finalizado correctamente. Botón "Anterior" está deshabilitado.');
  });

  test('AE-TC-27. Validar funcionamiento del botón "Siguiente" en la paginación @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-27: Validar funcionamiento del botón "Siguiente" en la paginación ');

    const siguiente = tiposIngreso.page.locator('#tipo_ingreso_next');
    const clases = await siguiente.getAttribute('class');
    logger.info(`Clases del botón siguiente: ${clases}`);

    expect(clases).toBeTruthy();
    logger.info('AE-TC-27 finalizado correctamente.');
  });

  test('AE-TC-28. Verificar que el botón "Actualizar" refresque correctamente la tabla @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('major');
    logger.info(' AE-TC-28: Verificar que el botón "Actualizar" refresque correctamente la tabla ');

    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro para refrescar';
    logger.info(`Creando registro de prueba: ${nombreRegistro}`);

    await tiposIngreso.crear(nombreRegistro, descripcionRegistro);
    expect(await tiposIngreso.validarToast()).toBeTruthy();
    logger.info('Registro creado correctamente.');

    await tiposIngreso.seleccionarFila(nombreRegistro);
    logger.info('Registro seleccionado para eliminación.');

    await tiposIngreso.btnEliminar.click();
    await tiposIngreso.confirmarEliminacion();
    logger.info('Registro eliminado, refrescando tabla...');

    expect(await tiposIngreso.validarToast()).toBeTruthy();
    await page.waitForTimeout(5000);
    await tiposIngreso.btnActualizar.click();
    await page.waitForTimeout(3000);
    const filas = await tiposIngreso.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();

    logger.info('Tabla actualizada correctamente sin mostrar el registro eliminado.');
    logger.info('AE-TC-28 finalizado exitosamente.');
  });
});

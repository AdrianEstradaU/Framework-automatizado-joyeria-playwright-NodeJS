const { test, expect } = require('@playwright/test');
const { ProveedoresPage } = require('../../pages/ProveedoresPage.js');
const { proveedoresData } = require('../../data/ProveedoresData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Módulo: Proveedores', () => {
  let proveedores;

  test.beforeEach(async ({ page }) => {
    proveedores = new ProveedoresPage(page);
    await page.goto('/');
    await proveedores.abrirModulo();
    logger.info('Ingreso al módulo Proveedores');
  });

 test('AE-TC-29. Crear proveedor válido  @Smoke @Regression @positive', async () => {
  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('critical');
  logger.info('AE-TC-29: Iniciando creación y eliminación de proveedor válido');
  await proveedores.crear(proveedoresData.valid.nombre, proveedoresData.valid.descripcion);
  logger.info(`Proveedor creado: ${proveedoresData.valid.nombre}`);

  expect(await proveedores.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  logger.info('Validación de mensaje de éxito completada.');

  await proveedores.seleccionarFila(proveedoresData.valid.nombre);
  await proveedores.btnEliminar.click();
  await proveedores.confirmarEliminacion(proveedoresData.valid.nombre);
   expect(await proveedores.validarToast()).toBeTruthy();
  logger.info(`Proveedor ${proveedoresData.valid.nombre} eliminado correctamente.`);

  logger.info('AE-TC-29 finalizado exitosamente.');
});



  test('AE-TC-30. Intentar crear proveedor con campos vacíos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-30: Intentando crear proveedor con campos vacíos');

    const filasAntes = await proveedores.tabla.locator('tr').count();
    await proveedores.crear(proveedoresData.invalid.nombre, proveedoresData.invalid.descripcion);

    logger.info('Validando mensaje de campo obligatorio');
    const errorNombre = proveedores.page.locator('#joy_proveedor\\[nombre_proveedor\\]-error');
    await expect(errorNombre).toHaveText('Este campo es obligatorio');

    const filasDespues = await proveedores.tabla.locator('tr').count();
    expect(filasDespues).toBe(filasAntes);
    logger.info('No se creó ningún registro con campos vacíos');
  });

  test('AE-TC-31. Editar proveedor existente con datos válidos  @Regression @positive', async () => {
  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('major');
  logger.info(' AE-TC-31: Editar proveedor existente con datos válidos y eliminarlo posteriormente');
  const nombreOriginal = `EDIT-${Date.now()}`;
  const descripcionOriginal = 'Proveedor temporal para edición';
  await proveedores.crear(nombreOriginal, descripcionOriginal);
  expect(await proveedores.validarToast()).toBeTruthy();
  logger.info(`Proveedor temporal creado: ${nombreOriginal}`);
  const nombreEditado = `${nombreOriginal}-MOD`;
  const descripcionEditada = 'Proveedor modificado';
  await proveedores.editar(nombreOriginal, nombreEditado, descripcionEditada);
  expect(await proveedores.validarToast()).toBeTruthy();
  logger.info(`Proveedor editado: ${nombreEditado}`);
  await proveedores.btnActualizar.click();
  await proveedores.page.waitForTimeout(1500);
  const filas = await proveedores.tabla.locator('tr').allTextContents();
  logger.info(`Filas encontradas: ${filas.length}`);
  logger.info(`Buscando nombre editado: ${nombreEditado}`);
  expect(filas.some(f => f.includes(nombreEditado))).toBeTruthy();
  logger.info('Validación de edición exitosa.');
  logger.info(`Procediendo a eliminar el proveedor editado: ${nombreEditado}`);
  await proveedores.seleccionarFila(nombreEditado);
  await proveedores.btnEliminar.click();
  logger.info('Botón eliminar presionado, confirmando eliminación...');
  await proveedores.confirmarEliminacion();
  expect(await proveedores.validarToast()).toBeTruthy();
  logger.info(`Proveedor ${nombreEditado} eliminado correctamente.`);
  await proveedores.page.waitForTimeout(1000);
  await expect(proveedores.tabla.locator(`text=${nombreEditado}`)).toHaveCount(0, { timeout: 5000 });
  await proveedores.btnActualizar.click();
  const filasActualizadas = await proveedores.tabla.locator('tr').allTextContents();
  expect(filasActualizadas.some(f => f.includes(nombreEditado))).toBeFalsy();
  logger.info('Validación de eliminación confirmada.');
  logger.info('AE-TC-31 finalizado exitosamente con edición y eliminación.');
});

  test('AE-TC-32. Eliminar proveedor existente y validar eliminación @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-32: Iniciando eliminación de proveedor existente.');

    const nombreEliminar = `DEL-${Date.now()}`;
    const descripcionEliminar = 'Proveedor temporal';
    await proveedores.crear(nombreEliminar, descripcionEliminar);
    expect(await proveedores.validarToast()).toBeTruthy();
    logger.info(`Proveedor temporal creado: ${nombreEliminar}`);

  
    await proveedores.seleccionarFila(nombreEliminar);
    await proveedores.btnEliminar.click();
    logger.info(`Botón eliminar presionado para "${nombreEliminar}".`);
    await proveedores.confirmarEliminacion();

    await Promise.race([
      proveedores.toastExito.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
      proveedores.page.waitForTimeout(2000)
    ]);
    logger.info(`Proveedor "${nombreEliminar}" eliminado correctamente.`);

    
    await expect(
      proveedores.tabla.locator(`text=${nombreEliminar}`)
    ).toHaveCount(0, { timeout: 5000 });
    logger.info('El registro ya no aparece en la tabla.');

   
    await proveedores.btnActualizar.click();
    const filasActualizadas = await proveedores.tabla.locator('tr').allTextContents();
    expect(filasActualizadas.some(f => f.includes(nombreEliminar))).toBeFalsy();
    logger.info('Validación final de eliminación confirmada.');

    logger.info('AE-TC-32 finalizado exitosamente.');
  
});

  test('AE-TC-33. Validar límite de 64 caracteres en campo "nombre" @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-33: Validando límite de 64 caracteres en nombre');

    await proveedores.crear(proveedoresData.limites.nombreLargo, proveedoresData.valid.descripcion);
    expect(await proveedores.validarToast('El formato JSON solicitado ha fallado.')).toBeTruthy();
    logger.info('Mensaje de error correctamente mostrado por exceso de caracteres');
  });

  test('AE-TC-34. Validar límite de caracteres en campo "descripción" @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    logger.info('AE-TC-34: Validando límite en descripción');

    const descripcionLarga = proveedoresData.limites.descripcionLarga;
    await proveedores.click(proveedores.btnCrear);
    await proveedores.fill(proveedores.inputNombre, 'TEST-LIMITE');
    await proveedores.fill(proveedores.textareaDescripcion, descripcionLarga);

    const valor = await proveedores.textareaDescripcion.inputValue();
    logger.info(`Longitud ingresada en descripción: ${valor.length}`);
    expect(valor.length).toBeGreaterThan(0);
  });

  test('AE-TC-35. Buscar proveedor en la tabla @Smoke @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-35: Iniciando búsqueda de proveedor en tabla');

    const buscador = proveedores.page.locator('input[type="search"]');
    await buscador.fill(proveedoresData.busqueda.termino);
    const filasVisibles = proveedores.tabla.locator('tr');
    expect(await filasVisibles.count()).toBeGreaterThan(0);

    logger.info('Resultados de búsqueda encontrados correctamente');
  });

  test('AE-TC-36. Cancelar eliminación de proveedor @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-36: Iniciando cancelación de eliminación');

    const primerFila = proveedores.tabla.locator('tr').first();
    await primerFila.click();

    await proveedores.btnEliminar.click();
    await proveedores.cancelarEliminacion();
    await expect(proveedores.tabla).toBeVisible();

    logger.info('Eliminación cancelada correctamente, la tabla sigue visible');
  });

  test('AE-TC-37. Seleccionar registro en la tabla @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    logger.info('AE-TC-37: Seleccionando registro en la tabla');

    const primerFila = proveedores.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();

    await proveedores.seleccionarFila(primerNombre);
    const seleccionadas = proveedores.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);

    logger.info(`Registro seleccionado correctamente: ${primerNombre}`);
  });

  test('AE-TC-38. Verificar que botón "Actualizar" refresca correctamente la tabla @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('major');
    logger.info('AE-TC-38: Verificando refresco de tabla con botón Actualizar');

    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro para refrescar';

    await proveedores.crear(nombreRegistro, descripcionRegistro);
    expect(await proveedores.validarToast()).toBeTruthy();
    
    await proveedores.seleccionarFila(nombreRegistro);
    await proveedores.btnEliminar.click();
    await proveedores.confirmarEliminacion();
    expect(await proveedores.validarToast()).toBeTruthy();
    await proveedores.page.waitForTimeout(5000);
    await proveedores.btnActualizar.click();
   await proveedores.page.waitForTimeout(3000);
    const filas = await proveedores.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();

    logger.info('Refresco de tabla validado correctamente');
  });
});

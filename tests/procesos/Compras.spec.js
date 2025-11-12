const { test, expect } = require('@playwright/test');
const { ComprasPage } = require('../../pages/ComprasPage.js');
const { ComprasData } = require('../../data/ComprasData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');


test.describe('Módulo Compras', () => {
  let comprasPage;

  test.beforeEach(async ({ page }) => {
    comprasPage = new ComprasPage(page);
    await page.goto('/');
    logger.info('Página principal cargada correctamente.');
    logger.info('Ingresando al módulo Compras...');
    await comprasPage.abrirModulo();
    logger.info('Módulo Compras abierto exitosamente.');
  });

  test('AE-TC-83: Crear compra válida y verificar existencia @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    const data = ComprasData.valid;
    logger.info(`Creando compra con: descripcion="${data.descripcion}", precio=${data.precio}, cantidad=${data.cantidad}, tipoEgreso=${data.tipoEgreso}, proveedor=${data.proveedor}, tipoProducto=${data.tipoProducto}`);
    
    await comprasPage.crearCompra(
      data.descripcion,
      data.precio,
      data.cantidad,
      data.tipoEgreso,
      data.proveedor,
      data.tipoProducto
    );

    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Compra creada exitosamente, verificando existencia en el listado...');
    const existe = await comprasPage.verificarCompraExiste(data.descripcion);
    expect(existe).toBeTruthy();
  });

  test('AE-TC-84: Verificar botón "Otras opciones" en Compras @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');

    await expect(comprasPage.btnOpciones).toBeVisible();
    await comprasPage.btnOpciones.click();

    const menuDropdown = comprasPage.page.locator('ul.dropdown-menu[role="menu_extra"]');
    await expect(menuDropdown).toBeVisible({ timeout: 3000 });

    const opcionImagen = menuDropdown.locator('a:has-text("Ver imagen cargada")');
    logger.info('Verificando opción "Ver imagen cargada" en el menú desplegable...');
    await expect(opcionImagen).toBeVisible();
  });

  test('AE-TC-85: Buscar compras por término @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');

    const termino = ComprasData.busqueda.termino;
    await comprasPage.crearCompraRapida(termino, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });

    await comprasPage.buscarCompras.fill(termino);
    await comprasPage.page.waitForTimeout(1000);

    const fila = comprasPage.tabla.locator(`tr:has-text("${termino}")`);
    const count = await fila.count();
    logger.info(`Número de compras encontradas con el término "${termino}": ${count}`);
    expect(count).toBeGreaterThan(0);
  });

  test('AE-TC-86: Seleccionar un registro de compras @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');

    const fila = comprasPage.tabla.locator('tr').first();
    await fila.click();

    const seleccionado = await fila.evaluate(el => el.classList.contains('selected'));
    logger.info(`Registro seleccionado: ${seleccionado}`);
  
    expect(seleccionado).toBeTruthy();
  });

  test('AE-TC-87: Validar botón "Anterior" en listado de compras @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');

    const disabled = await comprasPage.isAnteriorDisabled();
    logger.info(`Estado del botón "Anterior": ${disabled ? 'Deshabilitado' : 'Habilitado'}`);
  
    expect(disabled).toBeTruthy();
  });

  test('AE-TC-88: Validar botón "Siguiente" en listado de compras @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');

    const disabled = await comprasPage.isSiguienteDisabled();
    logger.info(`Estado del botón "Siguiente": ${disabled ? 'Deshabilitado' : 'Habilitado'}`);
    expect(disabled).toBeTruthy();
  });

  test('AE-TC-89: No guardar compra con campos vacíos @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    await comprasPage.click(comprasPage.btnCrear);
    await comprasPage.page.waitForTimeout(1000);
    await comprasPage.click(comprasPage.btnGuardar);
    await comprasPage.page.waitForTimeout(2000);

    const errores = await comprasPage.page.locator('.error, .invalid-feedback, .text-danger').allTextContents();
    logger.info(`Errores encontrados al intentar guardar compra vacía: ${errores.join('; ')}`);
    expect(errores.length).toBeGreaterThan(0);
  });

  test('AE-TC-90: Validar límite máximo de caracteres en descripción @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');

    const desc = ComprasData.limites.descripcionLargaValida;
    await comprasPage.crearCompraRapida(desc, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    const toastVisible = await comprasPage.toastExito.isVisible();
    logger.info(`Toast de éxito visible: ${toastVisible}`);
    expect(toastVisible).toBeTruthy();
  });

  test('AE-TC-91: Rechazo por letras en costo y cantidad @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    await comprasPage.click(comprasPage.btnCrear);
    await comprasPage.descripcion.fill('Compra Test');
    await comprasPage.selectOptionSelect2ByValue(comprasPage.tipoEgreso, ComprasData.defaults.tipoEgreso);
    await comprasPage.selectOptionSelect2ByValue(comprasPage.proveedor, ComprasData.defaults.proveedor);
    await comprasPage.selectOptionSelect2ByValue(comprasPage.tipoProducto, ComprasData.defaults.tipoProducto);

    await comprasPage.page.evaluate(() => {
      document.querySelector('[name="joy_egreso[precio_egreso]"]').value = 'ABC';
      document.querySelector('[name="joy_egreso[cantidad]"]').value = 'XYZ';
      document.querySelector('[name="joy_egreso[precio_egreso]"]').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('[name="joy_egreso[cantidad]"]').dispatchEvent(new Event('input', { bubbles: true }));
    });

    const valorPrecio = await comprasPage.precio.inputValue();
    const valorCantidad = await comprasPage.cantidad.inputValue();
    logger.info(`Valor en campo Precio: "${valorPrecio}", Valor en campo Cantidad: "${valorCantidad}"`);
    expect(valorPrecio === '' || valorPrecio === '0').toBeTruthy();
    logger.info(`Valor en campo Cantidad: "${valorCantidad}"`);
    expect(valorCantidad === '' || valorCantidad === '0').toBeTruthy();
   
  });

  test('AE-TC-92: Rechazo por cantidad mayor al límite @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    await comprasPage.crearCompraRapida('Compra Límite', 100, { cantidad: 10000 });
    await comprasPage.page.waitForTimeout(2000);

    const errores = await comprasPage.page.locator('.error, .invalid-feedback, .text-danger, .overhang-message').count();
    if (errores === 0) {
      const existe = await comprasPage.verificarCompraExiste('Compra Límite');
      logger.info(`Verificación de existencia para "Compra Límite": ${existe}`);
      expect(existe).toBeFalsy();
    } else {
      expect(errores).toBeGreaterThan(0);
    }
  });

  test('AE-TC-93: Rechazo por descripción muy larga y costo negativo @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    await comprasPage.crearCompra(
      ComprasData.limites.descripcionLarga,
      -50,
      1,
      ComprasData.defaults.tipoEgreso,
      ComprasData.defaults.proveedor,
      ComprasData.defaults.tipoProducto
    );
    await comprasPage.page.waitForTimeout(2000);

    const errores = await comprasPage.page.locator('.error, .overhang-message').count();
    logger.info(`Número de errores encontrados al crear compra con descripción muy larga y costo negativo: ${errores}`);
    expect(errores).toBeGreaterThan(0);
  });

  test('AE-TC-94: Rechazo por letras en costo y cantidad (manual) @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    await comprasPage.click(comprasPage.btnCrear);
    await comprasPage.page.evaluate(() => {
      document.querySelector('[name="joy_egreso[precio_egreso]"]').value = 'ABC';
      document.querySelector('[name="joy_egreso[cantidad]"]').value = 'XYZ';
    });

    const valorCosto = await comprasPage.precio.inputValue();
    const valorCantidad = await comprasPage.cantidad.inputValue();
    expect(valorCosto).toBe('');
    expect(valorCantidad).toBe('');
  });

  test('AE-TC-95: Rechazo por valores negativos en costo y cantidad @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
  
logger.info('Intentando crear compra con costo y cantidad negativos...');
    await comprasPage.crearCompraRapida('Compra Negativa', -100, { cantidad: -5 });

    const toastError = comprasPage.page.locator('.overhang-message', { 
      hasText: 'El formato JSON solicitado ha fallado' 
    });
    await expect(toastError).toBeVisible({ timeout: 10000 });

    const existe = await comprasPage.verificarCompraExiste('Compra Negativa');
    logger.info(`Verificación de existencia para "Compra Negativa": ${existe}`);
    expect(existe).toBeFalsy();
  });

  test('AE-TC-96: Registro exitoso con costo decimal @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    await comprasPage.crearCompraRapida('Compra Decimal', 99.99);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });

    const existe = await comprasPage.verificarCompraExiste('Compra Decimal');
    logger.info(`Verificación de existencia para "Compra Decimal": ${existe}`);
    expect(existe).toBeTruthy();
  });
test('AE-TC-97: Validar botón Editar en Compras @Regression @positive', async () => {
  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('critical');
  
  const descripcionCompra = 'Compra Test ' + Date.now();
  logger.info(` PASO 1: Crear compra: "${descripcionCompra}" `);
  
 
  await comprasPage.btnCrear.click();
  await comprasPage.page.waitForTimeout(1000);
  
  await comprasPage.descripcion.fill(descripcionCompra);
  await comprasPage.fillPrecio('50');
  await comprasPage.fillCantidad(ComprasData.defaults.cantidad);
  await comprasPage.selectOptionSelect2ByValue(comprasPage.tipoEgreso, ComprasData.defaults.tipoEgreso);
  await comprasPage.selectOptionSelect2ByValue(comprasPage.proveedor, ComprasData.defaults.proveedor);
  await comprasPage.selectOptionSelect2ByValue(comprasPage.tipoProducto, ComprasData.defaults.tipoProducto);
  
  await comprasPage.btnGuardar.click();
  await expect(comprasPage.toastExito).toBeVisible({ timeout: 10000 });
  logger.info(' Compra creada exitosamente');
  await comprasPage.page.waitForTimeout(2000);
  
  
  logger.info(' PASO 2: Actualizar tabla ');
  await comprasPage.btnActualizar.click();
  await comprasPage.page.waitForTimeout(2000);
  logger.info(' Tabla actualizada');
  
  
  logger.info(' PASO 3: Verificar compra existe ');
  const existe = await comprasPage.verificarCompraExiste(descripcionCompra);
  logger.info(`¿Compra existe?: ${existe}`);
  expect(existe).toBeTruthy();


  logger.info(' PASO 4: Seleccionar fila ');
  const fila = comprasPage.tabla.locator(`tr:has(td:text-is("${descripcionCompra}"))`);
  await fila.waitFor({ state: 'visible', timeout: 10000 });
  await fila.scrollIntoViewIfNeeded();
  
  logger.info('Haciendo clic en la fila para seleccionarla...');
  await fila.click();
  await comprasPage.page.waitForTimeout(1000);
  logger.info(' Fila seleccionada');
  

  logger.info(' PASO 5: Hacer clic en botón Editar ');
  await expect(comprasPage.btnEditar).toBeVisible({ timeout: 5000 });
  await comprasPage.btnEditar.click();
  logger.info(' Botón Editar clickeado');
  
  
  logger.info(' PASO 6: Verificar modal de edición ');
  await expect(comprasPage.modalEditarTitulo).toBeVisible({ timeout: 10000 });
  logger.info(' Modal de edición abierto');
  await comprasPage.page.waitForTimeout(1000);
  
  
  logger.info(' PASO 7: Editar descripción ');
  const nuevaDescripcion = `${descripcionCompra} Editada`;
  logger.info(`Cambiando descripción a: "${nuevaDescripcion}"`);
  
  await comprasPage.descripcion.fill('');
  await comprasPage.descripcion.fill(nuevaDescripcion);
  logger.info('✓ Nueva descripción ingresada');
  
  logger.info('PASO 8: Guardar cambios ');
  await comprasPage.btnGuardar.click();
  

  logger.info('PASO 9: Validar mensaje de éxito ');
  await expect(comprasPage.toastExito).toBeVisible({ timeout: 10000 });
  logger.info(' Mensaje de éxito mostrado: "El proceso se ha realizado exitosamente"');
  await comprasPage.page.waitForTimeout(2000);
  
  logger.info(' PASO 10: Verificar compra editada ');
  await comprasPage.btnActualizar.click();
  await comprasPage.page.waitForTimeout(2000);
  
  const existeEditada = await comprasPage.verificarCompraExiste(nuevaDescripcion);
  logger.info(`¿Compra editada existe?: ${existeEditada}`);
  expect(existeEditada).toBeTruthy();
  
  logger.info(` TEST COMPLETADO EXITOSAMENTE`);
  logger.info(`   Original: "${descripcionCompra}"`);
  logger.info(`   Editada: "${nuevaDescripcion}"`);
});
  test('AE-TC-98: Validar botón Eliminar en Compras @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    const descripcionCompra = `Compra Test ${Date.now()}`;
    await comprasPage.crearCompraRapida(descripcionCompra, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });

    const fila = comprasPage.tabla.locator(`tr:has-text("${descripcionCompra}")`).first();
    await fila.click();
    const btnEliminar = comprasPage.page.locator('button[name="Eliminar"]');
    await btnEliminar.click();

    await comprasPage.btnConfirmarEliminar.click();
    logger.info(`Confirmada eliminación de la compra "${descripcionCompra}".`);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
logger.info(`Compra "${descripcionCompra}" eliminada exitosamente.`);
    const existe = await comprasPage.verificarCompraExiste(descripcionCompra);
    logger.info(`Verificación de existencia para "${descripcionCompra}": ${existe}`);
    expect(existe).toBeFalsy();
  });

  test('AE-TC-99: Validar botón Actualizar en Compras @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');

    const descripcionCompra = `Compra Test ${Date.now()}`;
    await comprasPage.crearCompraRapida(descripcionCompra, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });

    const btnActualizar = comprasPage.page.locator('button[name="Actualizar"]');
    await btnActualizar.click();
    await comprasPage.page.waitForTimeout(2000);

    const existe = await comprasPage.verificarCompraExiste(descripcionCompra);
    logger.info(`Verificación de existencia para "${descripcionCompra}" después de actualizar: ${existe}`);
    expect(existe).toBeTruthy();
  });

 
  test.afterEach(async ({ page }, testInfo) => {
    const comprasPage = new ComprasPage(page);

    const comprasACheckear = [
      ComprasData.busqueda.termino,
      ComprasData.limites.descripcionLargaValida,
      'Compra Test',
      'Compra Límite',
      ComprasData.limites.descripcionLarga,
      'Compra Negativa',
      'Compra Decimal'
    ];

    for (const desc of comprasACheckear) {
      const existe = await comprasPage.verificarCompraExiste(desc);
      if (!existe) continue;

      logger.info(`Teardown: eliminando compra "${desc}"`);
      const fila = comprasPage.tabla.locator(`tr:has-text("${desc}")`).first();
      await fila.click();
      const btnEliminar = comprasPage.page.locator('button[name="Eliminar"]');

      if (await btnEliminar.isVisible() && await btnEliminar.isEnabled()) {
        await btnEliminar.click();

        try {
          if (await comprasPage.mensajeEliminar.isVisible({ timeout: 2000 })) {
            await comprasPage.btnConfirmarEliminar.click();
            await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
            logger.info(`Compra "${desc}" eliminada exitosamente en teardown.`);
          } else {
            logger.warn(`Mensaje de eliminación no apareció para "${desc}", se omitió.`);
          }
        } catch (err) {
          logger.warn(`Error al eliminar "${desc}" en teardown: ${err.message}`);
        }
      }
    }
  });

});

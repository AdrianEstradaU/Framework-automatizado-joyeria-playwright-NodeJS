const { test, expect } = require('@playwright/test');
const { ComprasPage } = require('../../pages/ComprasPage');
const { ComprasData } = require('../../data/ComprasData');

test.describe('Módulo Compras', () => {
  let comprasPage;

  test.beforeEach(async ({ page }) => {
    comprasPage = new ComprasPage(page);
    await page.goto('/');
    await comprasPage.abrirModulo();
  });
  test('AE-83: Crear compra válida y verificar existencia', async () => {
    const data = ComprasData.valid;
    await comprasPage.crearCompra(
      data.descripcion,
      data.precio,
      data.cantidad,
      data.tipoEgreso,
      data.proveedor,
      data.tipoProducto
    );
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    const existe = await comprasPage.verificarCompraExiste(data.descripcion);
    expect(existe).toBeTruthy();
  });

  test('AE-84: Verificar botón "Otras opciones" en Compras', async () => {
    await expect(comprasPage.btnOpciones).toBeVisible();
    await comprasPage.btnOpciones.click();
    const menuDropdown = comprasPage.page.locator('ul.dropdown-menu[role="menu_extra"]');
    await expect(menuDropdown).toBeVisible({ timeout: 3000 });
    const opcionImagen = menuDropdown.locator('a:has-text("Ver imagen cargada")');
    await expect(opcionImagen).toBeVisible();
  });

  test('AE-85: Buscar compras por término', async () => {
    const termino = ComprasData.busqueda.termino;
    await comprasPage.crearCompraRapida(termino, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    await comprasPage.buscarCompras.fill(termino);
    await comprasPage.page.waitForTimeout(1000);
    const fila = comprasPage.tabla.locator(`tr:has-text("${termino}")`);
    expect(await fila.count()).toBeGreaterThan(0);
  });

  test('AE-86: Seleccionar un registro de compras', async () => {
    const fila = comprasPage.tabla.locator('tr').first();
    await fila.click();
    expect(await fila.evaluate(el => el.classList.contains('selected'))).toBeTruthy();
  });

  test('AE-87: Validar botón "Anterior" en listado de compras', async () => {
    expect(await comprasPage.isAnteriorDisabled()).toBeTruthy();
  });

  test('AE-88: Validar botón "Siguiente" en listado de compras', async () => {
    expect(await comprasPage.isSiguienteDisabled()).toBeTruthy();
  });

  test('AE-89: No guardar compra con campos vacíos', async () => {
    await comprasPage.click(comprasPage.btnCrear);
    await comprasPage.page.waitForTimeout(1000);
    await comprasPage.click(comprasPage.btnGuardar);
    await comprasPage.page.waitForTimeout(2000);
    const errores = await comprasPage.page.locator('.error, .invalid-feedback, .text-danger').allTextContents();
    expect(errores.length).toBeGreaterThan(0);
  });

  test('AE-90: Validar límite máximo de caracteres en descripción', async () => {
    await comprasPage.crearCompraRapida(ComprasData.limites.descripcionLargaValida, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    expect(await comprasPage.toastExito.isVisible()).toBeTruthy();
  });

  test('AE-91: Rechazo por letras en costo y cantidad', async () => {
    await comprasPage.click(comprasPage.btnCrear);
    await comprasPage.page.waitForTimeout(1000);
    await comprasPage.descripcion.fill('Compra Test');
    await comprasPage.selectOptionSelect2ByValue(comprasPage.tipoEgreso, ComprasData.defaults.tipoEgreso);
    await comprasPage.selectOptionSelect2ByValue(comprasPage.proveedor, ComprasData.defaults.proveedor);
    await comprasPage.selectOptionSelect2ByValue(comprasPage.tipoProducto, ComprasData.defaults.tipoProducto);

    await comprasPage.page.evaluate(() => {
      const precioInput = document.querySelector('[name="joy_egreso[precio_egreso]"]');
      const cantidadInput = document.querySelector('[name="joy_egreso[cantidad]"]');

      precioInput.value = 'ABC';
      cantidadInput.value = 'XYZ';
    
      precioInput.dispatchEvent(new Event('input', { bubbles: true }));
      cantidadInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await comprasPage.page.waitForTimeout(500);
    const valorPrecio = await comprasPage.precio.inputValue();
    const valorCantidad = await comprasPage.cantidad.inputValue();
    
    expect(valorPrecio === '' || valorPrecio === '0').toBeTruthy();
    expect(valorCantidad === '' || valorCantidad === '0').toBeTruthy();
  });

  test('AE-92: Rechazo por cantidad mayor al límite', async () => {
    await comprasPage.crearCompraRapida('Compra Límite', 100, { cantidad: 10000 });
    
    await comprasPage.page.waitForTimeout(2000);
    
    const errores = await comprasPage.page.locator(
      '.error, .invalid-feedback, .text-danger, .overhang-message'
    ).count();
    
    if (errores === 0) {
      const existe = await comprasPage.verificarCompraExiste('Compra Límite');
      expect(existe).toBeFalsy(); 
    } else {
      expect(errores).toBeGreaterThan(0);
    }
  });

  test('AE-93: Rechazo por descripción muy larga y costo negativo', async () => {
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
    expect(errores).toBeGreaterThan(0);
  });

  test('AE-94: Rechazo por letras en costo y cantidad (manual)', async () => {
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

 test('AE-95: Rechazo por valores negativos en costo y cantidad', async () => {
  await comprasPage.crearCompraRapida('Compra Negativa', -100, { cantidad: -5 });
  const toastError = comprasPage.page.locator('.overhang-message', { 
    hasText: 'El formato JSON solicitado ha fallado' 
  });
  await expect(toastError).toBeVisible({ timeout: 10000 });
  const existe = await comprasPage.verificarCompraExiste('Compra Negativa');
  expect(existe).toBeFalsy();
});


  test('AE-96: Registro exitoso con costo decimal', async () => {
    await comprasPage.crearCompraRapida('Compra Decimal', 99.99);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    const existe = await comprasPage.verificarCompraExiste('Compra Decimal');
    expect(existe).toBeTruthy();
  });

  test('AE-97: Validar botón Editar en Compras', async () => {
    const descripcionCompra = `Compra Test ${Date.now()}`;
    await comprasPage.crearCompraRapida(descripcionCompra, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    await comprasPage.page.waitForTimeout(1500);
    const fila = comprasPage.tabla.locator(`tr:has-text("${descripcionCompra}")`).first();
    await expect(fila).toBeVisible({ timeout: 5000 });
    await fila.click(); 
    await comprasPage.page.waitForTimeout(500);
    const btnEditar = comprasPage.page.locator('button[name="Editar"]');
    await expect(btnEditar).toBeVisible();
    await expect(btnEditar).toBeEnabled();
    await btnEditar.click();
    await comprasPage.page.waitForTimeout(1000);
    const nuevaDescripcion = descripcionCompra + ' Editada';
    await comprasPage.descripcion.clear();
    await comprasPage.descripcion.fill(nuevaDescripcion);
    await comprasPage.page.waitForTimeout(300);
    await comprasPage.click(comprasPage.btnGuardar);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    await comprasPage.page.waitForTimeout(2000);
    const existe = await comprasPage.verificarCompraExiste(nuevaDescripcion);
    if (!existe) {
      const filaEditada = await comprasPage.tabla.locator(`tr:has-text("Editada")`).count();
      console.log(`Filas con "Editada": ${filaEditada}`);
      const contenidoTabla = await comprasPage.tabla.textContent();
      console.log('Contenido de tabla:', contenidoTabla);
      const existeOriginal = await comprasPage.verificarCompraExiste(descripcionCompra);
      expect(existeOriginal).toBeFalsy(); 
      expect(filaEditada).toBeGreaterThan(0);
    } else {
      expect(existe).toBeTruthy();
    }
  });
  test('AE-98: Validar botón Eliminar en Compras', async () => {
    const descripcionCompra = `Compra Test ${Date.now()}`;
    await comprasPage.crearCompraRapida(descripcionCompra, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    await comprasPage.page.waitForTimeout(1000);

    const fila = comprasPage.tabla.locator(`tr:has-text("${descripcionCompra}")`).first();
    await expect(fila).toBeVisible({ timeout: 5000 });
    await fila.click();
    await comprasPage.page.waitForTimeout(500);
    const btnEliminar = comprasPage.page.locator('button[name="Eliminar"]');
    await expect(btnEliminar).toBeVisible();
    await expect(btnEliminar).toBeEnabled();
    await btnEliminar.click();
    await comprasPage.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
    await comprasPage.btnConfirmarEliminar.click();
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    const existe = await comprasPage.verificarCompraExiste(descripcionCompra);
    expect(existe).toBeFalsy();
  });

  test('AE-99: Validar botón Actualizar en Compras', async () => {
    const descripcionCompra = `Compra Test ${Date.now()}`;
    await comprasPage.crearCompraRapida(descripcionCompra, 100);
    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    await comprasPage.page.waitForTimeout(1000);
    const btnActualizar = comprasPage.page.locator('button[name="Actualizar"]');
    await expect(btnActualizar).toBeVisible();
    await expect(btnActualizar).toBeEnabled();
    await btnActualizar.click();
    await comprasPage.page.waitForTimeout(2000);
    
    await expect(comprasPage.tabla).toBeVisible();

    const existe = await comprasPage.verificarCompraExiste(descripcionCompra);
    expect(existe).toBeTruthy();
  });
});
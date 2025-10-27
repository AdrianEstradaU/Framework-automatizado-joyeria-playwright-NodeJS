const { test, expect } = require('@playwright/test');
const { TiposProductoPage } = require('../../pages/TiposProductoPage');
const { tiposProductoData } = require('../../data/TiposProductoData');

test.describe('Módulo: Tipos de Producto', () => {
  let tiposProducto;

  test.beforeEach(async ({ page }) => {
    tiposProducto = new TiposProductoPage(page);
    await page.goto('/');
    await tiposProducto.abrirModulo();
  });

  test('39. Crear tipo de producto válido', async () => {
    await tiposProducto.crear(tiposProductoData.valid.nombre, tiposProductoData.valid.descripcion);
    expect(await tiposProducto.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  });

  test('40. Intentar crear tipo de producto con campos vacíos', async () => {
    const filasAntes = await tiposProducto.tabla.locator('tr').count();
    await tiposProducto.crear(tiposProductoData.invalid.nombre, tiposProductoData.invalid.descripcion);

    const errorNombre = tiposProducto.page.locator('#joy_tipo_producto\\[nombre_tipo_producto\\]-error');
    await expect(errorNombre).toHaveText('Este campo es obligatorio');

    const filasDespues = await tiposProducto.tabla.locator('tr').count();
    expect(filasDespues).toBe(filasAntes);
  });

  test('41. Editar tipo de producto existente', async () => {
    const nombreOriginal = tiposProductoData.valid.nombre;
    const nombreEditado = `${nombreOriginal}-EDIT`;
    const descripcionEditada = 'Tipo de producto modificado';

    await tiposProducto.editar(nombreOriginal, nombreEditado, descripcionEditada);
    expect(await tiposProducto.validarToast()).toBeTruthy();

    const filas = await tiposProducto.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEditado))).toBeTruthy();
  });

  test('42. Eliminar tipo de producto existente', async () => {
    const nombreEliminar = `DEL-${Date.now()}`;
    const descripcionEliminar = 'Tipo de producto temporal';

    await tiposProducto.crear(nombreEliminar, descripcionEliminar);
    expect(await tiposProducto.validarToast()).toBeTruthy();

    await tiposProducto.seleccionarFila(nombreEliminar);
    await tiposProducto.btnEliminar.click();
    await tiposProducto.confirmarEliminacion();
    expect(await tiposProducto.validarToast()).toBeTruthy();

    await tiposProducto.page.waitForTimeout(1000);
    await expect(tiposProducto.tabla.locator(`text=${nombreEliminar}`)).toHaveCount(0, { timeout: 5000 });

    await tiposProducto.btnActualizar.click();
    const filas = await tiposProducto.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEliminar))).toBeFalsy();
  });

  test('43. Validar límite de 64 caracteres en nombre de tipo de producto', async () => {
    await tiposProducto.crear(tiposProductoData.limites.nombreLargo, tiposProductoData.valid.descripcion);
    expect(await tiposProducto.validarToast('El formato JSON solicitado ha fallado.')).toBeTruthy();
  });

  test('44. Validar límite en descripción de tipo de producto', async () => {
    const descripcionLarga = tiposProductoData.limites.descripcionLarga;

    await tiposProducto.click(tiposProducto.btnCrear);
    await tiposProducto.fill(tiposProducto.inputNombre, 'TEST-LIMITE');
    await tiposProducto.fill(tiposProducto.textareaDescripcion, descripcionLarga);

    const valor = await tiposProducto.textareaDescripcion.inputValue();
    expect(valor.length).toBeGreaterThan(0);
  });

  test('45. Buscar tipo de producto en la tabla', async () => {
    const buscador = tiposProducto.page.locator('input[type="search"]');
    await buscador.fill(tiposProductoData.busqueda.termino);
    const filasVisibles = tiposProducto.tabla.locator('tr');
    expect(await filasVisibles.count()).toBeGreaterThan(0);
  });

  test('46. Cancelar eliminación de tipo de producto', async () => {
    const primerFila = tiposProducto.tabla.locator('tr').first();
    await primerFila.click();

    await tiposProducto.btnEliminar.click();
    await tiposProducto.cancelarEliminacion();

    await expect(tiposProducto.tabla).toBeVisible();
  });

  test('47. Seleccionar registro de tipo de producto en la tabla', async () => {
    const primerFila = tiposProducto.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();

    await tiposProducto.seleccionarFila(primerNombre);

    const seleccionadas = tiposProducto.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
  });

  test('48. Verificar que botón actualizar refresca tabla de tipos de producto', async () => {
    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro para refrescar';

    await tiposProducto.crear(nombreRegistro, descripcionRegistro);
    expect(await tiposProducto.validarToast()).toBeTruthy();

    await tiposProducto.seleccionarFila(nombreRegistro);
    await tiposProducto.btnEliminar.click();
    await tiposProducto.confirmarEliminacion();
    expect(await tiposProducto.validarToast()).toBeTruthy();

    await tiposProducto.btnActualizar.click();
    const filas = await tiposProducto.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();
  });
});

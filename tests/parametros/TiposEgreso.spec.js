const { test, expect } = require('@playwright/test');
const { TiposEgresoPage } = require('../../pages/TiposEgresoPage');
const { tiposEgresoData } = require('../../data/TiposEgresoData');

test.describe('Módulo: Tipos de Egreso', () => {
  let tiposEgreso;

  test.beforeEach(async ({ page }) => {
    tiposEgreso = new TiposEgresoPage(page);
    await page.goto('/');
    await tiposEgreso.abrirModulo();
  });

  test('49. Crear tipo de egreso válido', async () => {
    await tiposEgreso.crear(
      tiposEgresoData.valid.nombre,
      tiposEgresoData.valid.descripcion,
      tiposEgresoData.valid.rol 
    );
    expect(await tiposEgreso.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  });

  test('50. Intentar crear tipo de egreso con campos vacíos', async () => {
    const filasAntes = await tiposEgreso.tabla.locator('tr').count();
    await tiposEgreso.crear(
      tiposEgresoData.invalid.nombre,
      tiposEgresoData.invalid.descripcion,
        tiposEgresoData.invalid.rol 
    );

    const errorNombre = tiposEgreso.page.locator('input[name="joy_tipo_egreso[nombre_tipo_egreso]"] + span');
    await expect(errorNombre).toHaveText(/obligatorio/i);

    const filasDespues = await tiposEgreso.tabla.locator('tr').count();
    expect(filasDespues).toBe(filasAntes);
  });

   test('51. Editar tipo de egreso existente', async () => {
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
});
  test('52. Eliminar tipo de egreso existente', async () => {
    const nombreEliminar = `DEL-${Date.now()}`;
    const descripcionEliminar = 'Tipo de egreso temporal';

    await tiposEgreso.crear(nombreEliminar, descripcionEliminar);
    expect(await tiposEgreso.validarToast()).toBeTruthy();

    await tiposEgreso.seleccionarFila(nombreEliminar);
    await tiposEgreso.btnEliminar.click();
    await tiposEgreso.confirmarEliminacion();
    expect(await tiposEgreso.validarToast()).toBeTruthy();

    await tiposEgreso.page.waitForTimeout(1000);
    await expect(tiposEgreso.tabla.locator(`text=${nombreEliminar}`)).toHaveCount(0, { timeout: 5000 });

    await tiposEgreso.btnActualizar.click();
    const filas = await tiposEgreso.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEliminar))).toBeFalsy();
  });

  test('53. Validar límite de 64 caracteres en nombre de tipo de egreso', async () => {
    await tiposEgreso.crear(
      tiposEgresoData.limites.nombreLargo,
      tiposEgresoData.valid.descripcion
    );
    expect(await tiposEgreso.validarToast('El formato JSON solicitado ha fallado.')).toBeTruthy();
  });

  test('54. Validar límite en descripción de tipo de egreso', async () => {
    const descripcionLarga = tiposEgresoData.limites.descripcionLarga;

    await tiposEgreso.click(tiposEgreso.btnCrear);
    await tiposEgreso.fill(tiposEgreso.inputNombre, 'TEST-LIMITE');
    await tiposEgreso.fill(tiposEgreso.textareaDescripcion, descripcionLarga);

    const valor = await tiposEgreso.textareaDescripcion.inputValue();
    expect(valor.length).toBeGreaterThan(0);
  });

  test('55. Buscar tipo de egreso en la tabla', async () => {
    const buscador = tiposEgreso.page.locator('input[type="search"]');
    await buscador.fill(tiposEgresoData.busqueda.termino || 'COMPRA');
    const filasVisibles = tiposEgreso.tabla.locator('tr');
    expect(await filasVisibles.count()).toBeGreaterThan(0);
  });

  test('56. Cancelar eliminación de tipo de egreso', async () => {
    const primerFila = tiposEgreso.tabla.locator('tr').first();
    await primerFila.click();

    await tiposEgreso.btnEliminar.click();
    await tiposEgreso.cancelarEliminacion();

    await expect(tiposEgreso.tabla).toBeVisible();
  });

  test('57. Seleccionar registro de tipo de egreso en la tabla', async () => {
    const primerFila = tiposEgreso.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();

    await tiposEgreso.seleccionarFila(primerNombre);

    const seleccionadas = tiposEgreso.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
  });

test('58. Verificar que botón actualizar refresca tabla de tipos de egreso', async () => {
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
});
});

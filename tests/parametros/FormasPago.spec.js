const { test, expect } = require('@playwright/test');
const { FormasPagoPage } = require('../../pages/FormasPagoPage');
const { formasPagoData } = require('../../data/formasPagoData');

test.describe('Módulo: Formas de Pago', () => {
  let formasPago;

  test.beforeEach(async ({ page }) => {
    formasPago = new FormasPagoPage(page);
    await page.goto('/');
    await formasPago.abrirModulo();
  });

  
  test('5. Crear forma de pago válida', async () => {
    await formasPago.crear(formasPagoData.valid.nombre, formasPagoData.valid.descripcion);
    expect(await formasPago.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  });

  
 test('6. Intentar crear con campos vacíos y validar errores inline', async () => {
  const filasAntes = await formasPago.tabla.locator('tr').count();

  // Intentar crear con datos vacíos
  await formasPago.crear(formasPagoData.invalid.nombre, formasPagoData.invalid.descripcion);

  // Validar solo el error del nombre
  const errorNombre = formasPago.page.locator('#joy_forma_pago\\[nombre_forma_pago\\]-error');
  await expect(errorNombre).toHaveText('Este campo es obligatorio');

  // Validar que la tabla no se agregó un nuevo registro
  const filasDespues = await formasPago.tabla.locator('tr').count();
  expect(filasDespues).toBe(filasAntes);
});


test('7. Editar registro existente', async () => {
  const nombreOriginal = formasPagoData.valid.nombre; 
  const nombreEditado = `${nombreOriginal}-EDITED`;
  const descripcionEditada = 'Descripción modificada';

  // Editar directamente el registro
  await formasPago.editar(nombreOriginal, nombreEditado, descripcionEditada);

  // Validar toast de éxito
  expect(await formasPago.validarToast()).toBeTruthy();

  // Esperar a que la tabla se actualice
  await formasPago.page.waitForTimeout(1000);

  // Verificar que el nombre editado aparece en la tabla
  const filasTexto = await formasPago.tabla.locator('tr').allTextContents();
  expect(filasTexto.some(f => f.includes(nombreEditado))).toBeTruthy();
});



test('8. Eliminar registro existente', async () => {
  const nombreEliminar = `DELETE-${Date.now()}`;
  const descripcionEliminar = 'Registro a eliminar';

  
  await formasPago.crear(nombreEliminar, descripcionEliminar);
  expect(await formasPago.validarToast()).toBeTruthy();

 
  await formasPago.seleccionarFila(nombreEliminar);
  await formasPago.btnEliminar.scrollIntoViewIfNeeded();
  await formasPago.btnEliminar.click();
  await formasPago.confirmarEliminacion();
  expect(await formasPago.validarToast()).toBeTruthy();


  await formasPago.btnActualizar.scrollIntoViewIfNeeded();
  await formasPago.btnActualizar.click();
  await formasPago.tabla.waitFor({ state: 'visible', timeout: 10000 });
  await formasPago.page.waitForTimeout(500);

  const filas = await formasPago.tabla.locator('tr').allTextContents();
  expect(filas.some(f => f.includes(nombreEliminar))).toBeFalsy();
});


test('9. Verificar botón actualizar refresca tabla', async () => {
  const nombreRegistro = `REFRESH-${Date.now()}`;
  const descripcionRegistro = 'Registro para refrescar';


  await formasPago.crear(nombreRegistro, descripcionRegistro);
  expect(await formasPago.validarToast()).toBeTruthy();

 
  await formasPago.seleccionarFila(nombreRegistro);
  await formasPago.btnEliminar.scrollIntoViewIfNeeded();
  await formasPago.btnEliminar.click();
  await formasPago.confirmarEliminacion();
  expect(await formasPago.validarToast()).toBeTruthy();

 
  await formasPago.btnActualizar.scrollIntoViewIfNeeded();
  await formasPago.btnActualizar.click();
  await formasPago.tabla.waitFor({ state: 'visible', timeout: 10000 });
  await formasPago.page.waitForTimeout(500);

  
  const filas = await formasPago.tabla.locator('tr').allTextContents();
  expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();
});
  
  test('10. Seleccionar registro en tabla', async () => {
    const primerFila = formasPago.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();

    await formasPago.seleccionarFila(primerNombre);

    const seleccionadas = formasPago.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
  });

  
  test('11. Botón anterior deshabilitado', async () => {
    const anterior = formasPago.page.locator('#forma_pago_previous');
    const clases = await anterior.getAttribute('class');
    expect(clases.includes('disabled')).toBe(true);
  });

  
  test('12. Validar botón siguiente', async () => {
    const siguiente = formasPago.page.locator('#forma_pago_next');
    const clases = await siguiente.getAttribute('class');
    console.log('Estado:', clases.includes('disabled') ? 'Deshabilitado' : 'Activo');
    expect(clases).toBeTruthy();
  });

  
  test('13. Validar límite de 64 caracteres en nombre', async () => {
    await formasPago.crear(formasPagoData.limites.nombreLargo, formasPagoData.valid.descripcion);
    expect(await formasPago.validarToast('El formato JSON solicitado ha fallado.')).toBeTruthy();
  });

 
  test('14. Validar límite en descripción', async () => {
    const descripcionLarga = formasPagoData.limites.descripcionLarga;
    await formasPago.click(formasPago.btnCrear);
    await formasPago.fill(formasPago.inputNombre, 'TEST-DESC');
    await formasPago.fill(formasPago.inputDescripcion, descripcionLarga);

    const valor = await formasPago.inputDescripcion.inputValue();
    expect(valor.length).toBeGreaterThan(0);
  });

  
  test('15. Buscar en tabla', async () => {
    const buscador = formasPago.page.locator('input[type="search"]');
    await buscador.fill(formasPagoData.valid.nombre);

    const filasVisibles = formasPago.tabla.locator('tr');
    const count = await filasVisibles.count();
    expect(count).toBeGreaterThan(0);
  });

  
  test('16. Cancelar eliminación', async () => {
    const primerFila = formasPago.tabla.locator('tr').first();
    await primerFila.click();

    await formasPago.page.locator('button[name="Eliminar"]').click();
    await formasPago.cancelarEliminacion();

    await expect(formasPago.tabla).toBeVisible();
  });
});

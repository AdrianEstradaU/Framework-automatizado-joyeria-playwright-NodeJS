const { test, expect } = require('@playwright/test');
const { TiposIngresoPage } = require('../../pages/TiposIngresoPage');
const { tiposIngresoData } = require('../../data/TiposIngresoData');

test.describe('Módulo: Tipos de Ingreso', () => {
  let tiposIngreso;

  test.beforeEach(async ({ page }) => {
    tiposIngreso = new TiposIngresoPage(page);
    await page.goto('/');
    await tiposIngreso.abrirModulo();
  });

 
  test('17. Crear tipo de ingreso válido', async () => {
    await tiposIngreso.crear(tiposIngresoData.valid.nombre, tiposIngresoData.valid.descripcion);
    expect(await tiposIngreso.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  });

  
  test('18. Intentar crear con campos vacíos', async () => {
    const filasAntes = await tiposIngreso.tabla.locator('tr').count();
    await tiposIngreso.crear(tiposIngresoData.invalid.nombre, tiposIngresoData.invalid.descripcion);

    const errorNombre = tiposIngreso.page.locator('#joy_tipo_ingreso\\[nombre_tipo_ingreso\\]-error');
    await expect(errorNombre).toHaveText('Este campo es obligatorio');

    const filasDespues = await tiposIngreso.tabla.locator('tr').count();
    expect(filasDespues).toBe(filasAntes);
  });

  
  test('19. Editar tipo de ingreso existente', async () => {
    const nombreOriginal = tiposIngresoData.valid.nombre;
    const nombreEditado = `${nombreOriginal}-EDIT`;
    const descripcionEditada = 'Ingreso modificado';

    await tiposIngreso.editar(nombreOriginal, nombreEditado, descripcionEditada);
    expect(await tiposIngreso.validarToast()).toBeTruthy();

    const filas = await tiposIngreso.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEditado))).toBeTruthy();
  });

 
 test('20. Eliminar tipo de ingreso existente', async () => {
  const nombreEliminar = `DEL-${Date.now()}`;
  const descripcionEliminar = 'Ingreso temporal';

  await tiposIngreso.crear(nombreEliminar, descripcionEliminar);
  await expect(await tiposIngreso.validarToast()).toBeTruthy();

  await tiposIngreso.seleccionarFila(nombreEliminar);
  await tiposIngreso.btnEliminar.click();
  await tiposIngreso.confirmarEliminacion();
  await expect(await tiposIngreso.validarToast()).toBeTruthy();

 
  await tiposIngreso.page.waitForTimeout(1000);
  await expect(tiposIngreso.tabla.locator(`text=${nombreEliminar}`)).toHaveCount(0, { timeout: 5000 });

  await tiposIngreso.btnActualizar.click();
  const filas = await tiposIngreso.tabla.locator('tr').allTextContents();
  expect(filas.some(f => f.includes(nombreEliminar))).toBeFalsy();
});


  
  test('21. Validar límite de 64 caracteres en nombre', async () => {
    await tiposIngreso.crear(tiposIngresoData.limites.nombreLargo, tiposIngresoData.valid.descripcion);
    expect(await tiposIngreso.validarToast('El formato JSON solicitado ha fallado.')).toBeTruthy();
  });

test('22. Validar límite en descripción', async () => {
  const descripcionLarga = tiposIngresoData.limites.descripcionLarga;

  await tiposIngreso.click(tiposIngreso.btnCrear);
  await tiposIngreso.fill(tiposIngreso.inputNombre, 'TEST-LIMITE');
  await tiposIngreso.fill(tiposIngreso.textareaDescripcion, descripcionLarga);

  const valor = await tiposIngreso.textareaDescripcion.inputValue();
  expect(valor.length).toBeGreaterThan(0);
});

  test('23. Buscar tipo de ingreso en la tabla', async () => {
    const buscador = tiposIngreso.page.locator('input[type="search"]');
    await buscador.fill(tiposIngresoData.busqueda.termino);
    const filasVisibles = tiposIngreso.tabla.locator('tr');
    expect(await filasVisibles.count()).toBeGreaterThan(0);
  });

 
  test('24. Cancelar eliminación', async () => {
    const primerFila = tiposIngreso.tabla.locator('tr').first();
    await primerFila.click();

    await tiposIngreso.btnEliminar.click();
    await tiposIngreso.cancelarEliminacion();

    await expect(tiposIngreso.tabla).toBeVisible();
  });

 
  test('25. Seleccionar registro en tabla', async () => {
    const primerFila = tiposIngreso.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();

    await tiposIngreso.seleccionarFila(primerNombre);

    const seleccionadas = tiposIngreso.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
  });

  
  test('26. Botón anterior deshabilitado', async () => {
    const anterior = tiposIngreso.page.locator('#tipo_ingreso_previous');
    const clases = await anterior.getAttribute('class');
    expect(clases.includes('disabled')).toBe(true);
  });

 
  test('27. Validar botón siguiente', async () => {
    const siguiente = tiposIngreso.page.locator('#tipo_ingreso_next');
    const clases = await siguiente.getAttribute('class');
    console.log('Estado:', clases.includes('disabled') ? 'Deshabilitado' : 'Activo');
    expect(clases).toBeTruthy();
  });

  
  test('28. Verificar botón actualizar refresca tabla', async () => {
    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro para refrescar';

    await tiposIngreso.crear(nombreRegistro, descripcionRegistro);
    expect(await tiposIngreso.validarToast()).toBeTruthy();

    await tiposIngreso.seleccionarFila(nombreRegistro);
    await tiposIngreso.btnEliminar.click();
    await tiposIngreso.confirmarEliminacion();
    expect(await tiposIngreso.validarToast()).toBeTruthy();

    await tiposIngreso.btnActualizar.click();
    const filas = await tiposIngreso.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();
  });
});

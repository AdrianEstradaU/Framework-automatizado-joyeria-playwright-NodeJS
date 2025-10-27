const { test, expect } = require('@playwright/test');
const { ProveedoresPage } = require('../../pages/ProveedoresPage');
const { proveedoresData } = require('../../data/ProveedoresData');

test.describe('Módulo: Proveedores', () => {
  let proveedores;

  test.beforeEach(async ({ page }) => {
    proveedores = new ProveedoresPage(page);
    await page.goto('/');
    await proveedores.abrirModulo();
  });

  test('29. Crear proveedor válido', async () => {
    await proveedores.crear(proveedoresData.valid.nombre, proveedoresData.valid.descripcion);
    expect(await proveedores.validarToast('El proceso se ha realizado exitosamente')).toBeTruthy();
  });

  test('30. Intentar crear proveedor con campos vacíos', async () => {
    const filasAntes = await proveedores.tabla.locator('tr').count();
    await proveedores.crear(proveedoresData.invalid.nombre, proveedoresData.invalid.descripcion);

    const errorNombre = proveedores.page.locator('#joy_proveedor\\[nombre_proveedor\\]-error');
    await expect(errorNombre).toHaveText('Este campo es obligatorio');

    const filasDespues = await proveedores.tabla.locator('tr').count();
    expect(filasDespues).toBe(filasAntes);
  });

  test('31. Editar proveedor existente', async () => {
    const nombreOriginal = proveedoresData.valid.nombre;
    const nombreEditado = `${nombreOriginal}-EDIT`;
    const descripcionEditada = 'Proveedor modificado';

    await proveedores.editar(nombreOriginal, nombreEditado, descripcionEditada);
    expect(await proveedores.validarToast()).toBeTruthy();

    const filas = await proveedores.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEditado))).toBeTruthy();
  });

  test('32. Eliminar proveedor existente', async () => {
    const nombreEliminar = `DEL-${Date.now()}`;
    const descripcionEliminar = 'Proveedor temporal';

    await proveedores.crear(nombreEliminar, descripcionEliminar);
    expect(await proveedores.validarToast()).toBeTruthy();

    await proveedores.seleccionarFila(nombreEliminar);
    await proveedores.btnEliminar.click();
    await proveedores.confirmarEliminacion();
    expect(await proveedores.validarToast()).toBeTruthy();

    await proveedores.page.waitForTimeout(1000);
    await expect(proveedores.tabla.locator(`text=${nombreEliminar}`)).toHaveCount(0, { timeout: 5000 });

    await proveedores.btnActualizar.click();
    const filas = await proveedores.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreEliminar))).toBeFalsy();
  });

  test('33. Validar límite de 64 caracteres en nombre', async () => {
    await proveedores.crear(proveedoresData.limites.nombreLargo, proveedoresData.valid.descripcion);
    expect(await proveedores.validarToast('El formato JSON solicitado ha fallado.')).toBeTruthy();
  });

  test('34. Validar límite en descripción', async () => {
    const descripcionLarga = proveedoresData.limites.descripcionLarga;

    await proveedores.click(proveedores.btnCrear);
    await proveedores.fill(proveedores.inputNombre, 'TEST-LIMITE');
    await proveedores.fill(proveedores.textareaDescripcion, descripcionLarga);

    const valor = await proveedores.textareaDescripcion.inputValue();
    expect(valor.length).toBeGreaterThan(0);
  });

  test('35. Buscar proveedor en la tabla', async () => {
    const buscador = proveedores.page.locator('input[type="search"]');
    await buscador.fill(proveedoresData.busqueda.termino);
    const filasVisibles = proveedores.tabla.locator('tr');
    expect(await filasVisibles.count()).toBeGreaterThan(0);
  });

  test('36. Cancelar eliminación', async () => {
    const primerFila = proveedores.tabla.locator('tr').first();
    await primerFila.click();

    await proveedores.btnEliminar.click();
    await proveedores.cancelarEliminacion();

    await expect(proveedores.tabla).toBeVisible();
  });

  test('37. Seleccionar registro en tabla', async () => {
    const primerFila = proveedores.tabla.locator('tr').first();
    const primerNombre = (await primerFila.locator('td').first().textContent()).trim();

    await proveedores.seleccionarFila(primerNombre);

    const seleccionadas = proveedores.tabla.locator('tr.selected');
    await expect(seleccionadas).toHaveCount(1);
  });

  test('38. Verificar botón actualizar refresca tabla', async () => {
    const nombreRegistro = `REFRESH-${Date.now()}`;
    const descripcionRegistro = 'Registro para refrescar';

    await proveedores.crear(nombreRegistro, descripcionRegistro);
    expect(await proveedores.validarToast()).toBeTruthy();

    await proveedores.seleccionarFila(nombreRegistro);
    await proveedores.btnEliminar.click();
    await proveedores.confirmarEliminacion();
    expect(await proveedores.validarToast()).toBeTruthy();

    await proveedores.btnActualizar.click();
    const filas = await proveedores.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(nombreRegistro))).toBeFalsy();
  });
});

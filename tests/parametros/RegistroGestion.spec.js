const { test, expect } = require('@playwright/test');
const { RegistroGestionPage } = require('../../pages/RegistroGestionPage');
const { registroGestionData } = require('../../data/registroGestionData');

test.describe('Módulo: Registro de Gestión', () => {
  let registro;

  test.beforeEach(async ({ page }) => {
    registro = new RegistroGestionPage(page);
    await page.goto('/');
    await registro.abrirModulo();
  });

  test('59. Crear registro válido', async () => {
    const anio = registroGestionData.valid.generarAnio();
    console.log(` Test 59: Creando ${anio}`);
    
    await registro.crearRegistro(anio);
    
    const existe = await registro.verificarRegistroExiste(anio);
    expect(existe).toBeTruthy();
  });

  test('60. Validar campo obligatorio', async () => {
    await registro.click(registro.btnCrear);
    await registro.modal.waitFor({ state: 'visible' });
    await registro.click(registro.btnGuardar);

    expect(await registro.validarError('obligatorio')).toBeTruthy();
  });

  test('61. Validar año demasiado largo', async () => {
    const anioLargo = registroGestionData.invalid.demasiadoLargo;
    
    await registro.click(registro.btnCrear);
    await registro.modal.waitFor({ state: 'visible' });
    await registro.inputAnio.fill(anioLargo);
    await registro.click(registro.btnGuardar);
    await registro.page.waitForTimeout(2000);
    
    const existe = await registro.verificarRegistroExiste(anioLargo);
    expect(existe).toBeFalsy();
  });

  test('62. Validar año no numérico', async () => {
    const anioTexto = registroGestionData.invalid.noNumerico;
    
    await registro.click(registro.btnCrear);
    await registro.modal.waitFor({ state: 'visible' });
    await registro.inputAnio.fill(anioTexto);
    await registro.click(registro.btnGuardar);

    expect(await registro.validarError('número')).toBeTruthy();
  });

  test('63. Editar registro', async () => {
    const original = registroGestionData.valid.generarAnio();
    const editado = registroGestionData.valid.generarAnio(); 
  
    console.log(` Test 63: ${original} → ${editado}`);

    await registro.crearRegistro(original);
    let existe = await registro.verificarRegistroExiste(original);
    expect(existe).toBeTruthy();
    await registro.editarRegistro(original, editado);
    
    existe = await registro.verificarRegistroExiste(editado);
    expect(existe).toBeTruthy();
  });

  test('64. Eliminar registro', async () => {
    const anio = registroGestionData.valid.generarAnio();
    console.log(` Test 64: Eliminar ${anio}`);
    
    await registro.crearRegistro(anio);
    let existe = await registro.verificarRegistroExiste(anio);
    expect(existe).toBeTruthy();
    await registro.eliminarRegistro(anio);
    
    await registro.btnActualizar.click();
    await registro.page.waitForTimeout(1500);
    
    existe = await registro.verificarRegistroExiste(anio);
    expect(existe).toBeFalsy();
  });

  test('65. Buscar registro', async () => {
    const anio = registroGestionData.valid.generarAnio();
    console.log(` Test 65: Buscar ${anio}`);
    await registro.crearRegistro(anio);
    await registro.buscarRegistro(anio);
    const filas = await registro.tabla.locator('tr').allTextContents();
    expect(filas.some(f => f.includes(anio))).toBeTruthy();
  });

  test('66. Seleccionar registro', async () => {
    const anio = registroGestionData.valid.generarAnio();
    console.log(` Test 66: Seleccionar ${anio}`);
  
    await registro.crearRegistro(anio);
    
    await registro.seleccionarRegistro(anio);
    
    const fila = registro.tabla.locator(`tr:has-text("${anio}")`);
    expect(await fila.isVisible()).toBeTruthy();
  });

  test('67. Paginación - botón anterior deshabilitado', async () => {
    const btnAnterior = registro.page.locator('#gestion_previous');
    expect(await btnAnterior.getAttribute('class')).toContain('disabled');
  });

  test('68. Paginación - botón siguiente', async () => {
    const btnSiguiente = registro.page.locator('#gestion_next');
    const clase = await btnSiguiente.getAttribute('class');
    
    if (clase.includes('disabled')) {
      console.log(' No hay más páginas');
    } else {
      console.log(' Hay más páginas disponibles');
    }
  });

  test('69. Cancelar eliminación', async () => {
    const anio = registroGestionData.valid.generarAnio();
    console.log(` Test 69: Cancelar eliminación ${anio}`);
    
    
    await registro.crearRegistro(anio);
    let existe = await registro.verificarRegistroExiste(anio);
    expect(existe).toBeTruthy();
  
    await registro.seleccionarRegistro(anio);
    await registro.click(registro.btnEliminar);
    await registro.cancelarEliminacion();
    
   
    await registro.page.waitForTimeout(1000);
    existe = await registro.verificarRegistroExiste(anio);
    expect(existe).toBeTruthy();
  });
});
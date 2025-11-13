const { test, expect } = require('@playwright/test');
const { RegistroGestionPage } = require('../../pages/RegistroGestionPage.js');
const { registroGestionData } = require('../../data/RegistroGestionData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');
const { teardownRegistroGestion, ejecutarLimpiezaRegistroGestion } = require('../../utils/RegistroGestionTeardown');

test.describe('Módulo: Registro de Gestión', () => {
  let registro;

  test.beforeEach(async ({ page }) => {
    registro = new RegistroGestionPage(page);
    await page.goto('/');
    logger.info('Página principal cargada.');
    logger.info('Ingresando al módulo Registro de Gestión...');
    await registro.abrirModulo();
    logger.info('Módulo Registro de Gestión abierto correctamente.');
  });

test.afterAll(async ({ browser }) => {
  test.setTimeout(90000); 
  await ejecutarLimpiezaRegistroGestion(browser);
});

  test('AE-TC-59. Crear registro de gestión válido @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    const anio = registroGestionData.valid.generarAnio();
    teardownRegistroGestion.registrar(anio);
    logger.info(`Creando registro de gestión con año: ${anio}`);
    
    await registro.crearRegistro(anio);
    logger.info('Registro creado, validando existencia...');
    
    await registro.page.waitForTimeout(2000);
    await registro.btnActualizar.click();
    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1500);
    
    const existe = await registro.verificarRegistroExiste(anio);
    expect(existe).toBeTruthy();
    logger.info('Registro validado correctamente.');
  });

  test('AE-TC-60. Validar campo obligatorio en registro de gestión @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('Abriendo ventana de creación de registro...');
    
    await registro.click(registro.btnCrear);
    await registro.modal.waitFor({ state: 'visible' });
    logger.info('Intentando guardar sin ingresar datos...');
    
    await registro.click(registro.btnGuardar);
    expect(await registro.validarError('obligatorio')).toBeTruthy();
    logger.info('Mensaje de campo obligatorio validado correctamente.');
  });

  test('AE-TC-61. Validar año demasiado largo @Regression @negative', async () => {
  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('minor');

  const anioLargo = registroGestionData.invalid.demasiadoLargo;
  logger.info(`Probando año demasiado largo: ${anioLargo}`);

  await registro.click(registro.btnCrear);
  await registro.modal.waitFor({ state: 'visible' });

  await registro.inputAnio.fill(anioLargo);
  await registro.click(registro.btnGuardar);

  expect(await registro.validarError('máximo')).toBeTruthy();
  logger.info('Error de longitud máxima validado correctamente.');
  await registro.btnActualizar.click();
  await registro.page.waitForLoadState('networkidle');

  const existe = await registro.verificarRegistroExiste(anioLargo);

  if (existe) {
    logger.warn(` BUG: El registro ${anioLargo} se creó pese al error. Enviando a teardown.`);
    teardownRegistroGestion.registrar(anioLargo);
  }
});

  test('AE-TC-62. Validar año no numérico @Regression @negative', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    const anioTexto = registroGestionData.invalid.noNumerico;
    logger.info(`Probando año no numérico: ${anioTexto}`);
    
    await registro.click(registro.btnCrear);
    await registro.modal.waitFor({ state: 'visible' });
    await registro.inputAnio.fill(anioTexto);
    await registro.click(registro.btnGuardar);
    
    expect(await registro.validarError('número')).toBeTruthy();
    logger.info('Error de formato de número validado correctamente.');
  });

  test('AE-TC-63. Editar registro de gestión existente @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('major');
    const original = registroGestionData.valid.generarAnio();
    const editado = registroGestionData.valid.generarAnio();
    teardownRegistroGestion.registrar(editado); 
    logger.info(`Creando registro para edición: ${original}`);
    
    await registro.crearRegistro(original);
    await registro.page.waitForTimeout(2000);
    await registro.btnActualizar.click();
    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1500);
    
    expect(await registro.verificarRegistroExiste(original)).toBeTruthy();
    
    logger.info(`Editando registro: ${original} → ${editado}`);
    await registro.editarRegistro(original, editado);
    await registro.page.waitForTimeout(2000);
    await registro.btnActualizar.click();
    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1500);
    
    const existe = await registro.verificarRegistroExiste(editado);
    expect(existe).toBeTruthy();
    logger.info('Registro editado validado correctamente.');
  });

  test('AE-TC-64. Eliminar registro de gestión existente @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    const anio = registroGestionData.valid.generarAnio();

    logger.info(`Creando registro para eliminación: ${anio}`);
    
    await registro.crearRegistro(anio);
    await registro.page.waitForTimeout(2000);
    await registro.btnActualizar.click();
    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1500);
    
    expect(await registro.verificarRegistroExiste(anio)).toBeTruthy();
    
    await registro.eliminarRegistro(anio);
    await registro.btnActualizar.click();
    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1500);
    
    const existe = await registro.verificarRegistroExiste(anio);
    expect(existe).toBeFalsy();
    logger.info('Registro eliminado correctamente.');
  });

  test('AE-TC-65. Buscar registro de gestión existente @Smoke @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');
    logger.info('AE-TC-65: Iniciando prueba de búsqueda de registro de gestión existente');

    const anioBuscar = registroGestionData.valid.generarAnio();
    teardownRegistroGestion.registrar(anioBuscar); 
    logger.info(`Creando registro para buscar: ${anioBuscar}`);
    
    await registro.crearRegistro(anioBuscar);
    await registro.page.waitForTimeout(2000);
    await registro.btnActualizar.click();
    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1500);
    
    await registro.buscador.fill(anioBuscar);
    logger.info(`Filtro aplicado: ${anioBuscar}`);

    await registro.btnActualizar.click();
    logger.info('Botón "Actualizar" presionado');

    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1000);

    const existe = await registro.verificarRegistroExiste(anioBuscar);
    expect(existe).toBeTruthy();
    logger.info('Validación exitosa: registro encontrado correctamente');
  });

  test('AE-TC-66. Seleccionar registro de gestión en tabla @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('normal');
    const anio = registroGestionData.valid.generarAnio();
    teardownRegistroGestion.registrar(anio); 
    logger.info(`Creando registro para selección: ${anio}`);
    
    await registro.crearRegistro(anio);
    await registro.page.waitForTimeout(2000);
    await registro.btnActualizar.click();
    await registro.page.waitForLoadState('networkidle');
    await registro.page.waitForTimeout(1500);
    
    await registro.seleccionarRegistro(anio);
    
    const fila = registro.tabla.locator(`tr:has-text("${anio}")`);
    expect(await fila.isVisible()).toBeTruthy();
    logger.info('Registro seleccionado correctamente en la tabla.');
  });

  test('AE-TC-67. Paginación - botón anterior deshabilitado @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    const btnAnterior = registro.page.locator('#gestion_previous');
    const clase = await btnAnterior.getAttribute('class');
    logger.info(`Clase botón anterior: ${clase}`);
    expect(clase).toContain('disabled');
  });

  test('AE-TC-68. Paginación - botón siguiente @Regression @positive', async () => {
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('minor');
    const btnSiguiente = registro.page.locator('#gestion_next');
    const clase = await btnSiguiente.getAttribute('class');
    logger.info(`Clase botón siguiente: ${clase}`);
    
    if (clase.includes('disabled')) {
      logger.info('No hay más páginas disponibles.');
    } else {
      logger.info('Hay más páginas disponibles.');
    }
  });

 test('AE-TC-69. Cancelar eliminación de registro de gestión existente @Regression @positive', async ({ page }) => {
  test.setTimeout(60000);

  allure.owner('Andres Adrian Estrada Uzeda');
  allure.severity('major');
  logger.info('AE-TC-69: Iniciando prueba de cancelación de eliminación');
  const anioEliminar = registroGestionData.valid.generarAnio();
  teardownRegistroGestion.registrar(anioEliminar);
  logger.info(`Creando registro para cancelar eliminación: ${anioEliminar}`);

  await page.goto('/');
  
  await registro.abrirModulo();
 
  logger.info('Módulo recargado correctamente');

  await registro.crearRegistro(anioEliminar);
 
  await registro.btnActualizar.click();
  await page.waitForLoadState('networkidle');

  const existeAntes = await registro.verificarRegistroExiste(anioEliminar);
  expect(existeAntes).toBeTruthy();
  logger.info('Registro creado correctamente');
  await registro.seleccionarFila(anioEliminar);
  await registro.btnEliminar.click();
  logger.info('Modal de eliminación abierto');
  await registro.cancelarEliminacion();
  await registro.btnActualizar.click();
  await page.waitForLoadState('networkidle');
  const existeDespues = await registro.verificarRegistroExiste(anioEliminar);
  expect(existeDespues).toBeTruthy();
  logger.info('Validación exitosa: el registro no fue eliminado tras cancelar');
});

});
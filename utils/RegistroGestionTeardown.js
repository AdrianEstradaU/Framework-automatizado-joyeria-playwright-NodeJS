const { test } = require('@playwright/test');
const { TeardownHelper } = require('./teardownHelper');
const { RegistroGestionPage } = require('../pages/RegistroGestionPage');
const logger = require('./loggers');
const teardownRegistroGestion = new TeardownHelper();

async function ejecutarLimpiezaRegistroGestion(browser, storageStatePath = 'fixtures/storageState.json') {
  if (teardownRegistroGestion.cantidad() === 0) {
    logger.info(' No hay registros para limpiar en Registro de Gestión');
    return { eliminados: 0, fallidos: 0, total: 0 };
  }

  logger.info(`\n Iniciando limpieza de ${teardownRegistroGestion.cantidad()} registros de Gestión...`);
  
  let context;
  let page;
  
  try {
    context = await browser.newContext({ storageState: storageStatePath });
    page = await context.newPage();
   
    const resultado = await teardownRegistroGestion.limpiarTodo(page, RegistroGestionPage);
    
    return resultado;
    
  } catch (error) {
    logger.error(` Error crítico en limpieza: ${error.message}`);
    return { 
      eliminados: 0, 
      fallidos: teardownRegistroGestion.cantidad(), 
      total: teardownRegistroGestion.cantidad() 
    };
    
  } finally {
    
    if (page) await page.close();
    if (context) await context.close();
    logger.info('✓ Contexto de limpieza cerrado\n');
  }
}

module.exports = { 
  teardownRegistroGestion,
  ejecutarLimpiezaRegistroGestion 
};
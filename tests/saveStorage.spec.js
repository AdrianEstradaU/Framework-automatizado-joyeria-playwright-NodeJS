const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test('Generar storage de autenticación', async ({ page }) => {
  const login = new LoginPage(page);
  
  console.log('🔐 Iniciando login...');
  await login.goto();
  await login.login('andres', 'A123456a');
  
  // ⏳ Esperar a que la página cargue completamente
  await page.locator('text=Módulo de Joyeria').waitFor({ 
    state: 'visible',
    timeout: 20000 
  });
  
  // Esperar a que termine de cargar scripts
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // 💾 Guardar storage
  await page.context().storageState({ path: 'fixtures/storageState.json' });
  
  console.log('✅ Storage guardado en fixtures/storageState.json');
});
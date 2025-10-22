// tests/registroPersona.spec.js
const { test, expect } = require('@playwright/test');

test('Login y crear nueva persona', async ({ page }) => {
  // 1. Abrir la página de login
  await page.goto('https://pruebas-3-3hjs.onrender.com/');

  // 2. Llenar usuario y contraseña
  await page.fill('input[name="seg_usuario[login]"]', 'morgan.checa');
  await page.fill('input[name="seg_usuario[password]"]', 'A123456a');

  // 3. Hacer clic en el botón "Ingresar"
  await page.click('#enviar');

  // 4. Esperar que cargue el módulo de seguridad (login exitoso)
  await page.waitForSelector('a:has-text("Módulo de Seguridad")', { timeout: 5000 });

  // 5. Click en "Módulo de Seguridad"
  await page.click('a:has-text("Módulo de Seguridad")');

  // 6. Click en "Parámetros"
  await page.click('#menu-padre-1 > a');

  // 7. Click en "Registro de Personas"
  await page.click('#tab-11');

  // 8. Click en botón "Crear"
  await page.click('button[title="Crear"]');

  // 9. Esperar que aparezca el modal
  const modal = page.locator('#modal-personas');
  await expect(modal).toBeVisible();

  // 10. Llenar el formulario
  await page.fill('input[name="seg_persona[ap_paterno]"]', 'Perez');
  await page.fill('input[name="seg_persona[ap_materno]"]', 'Gomez');
  await page.fill('input[name="seg_persona[nombres]"]', 'Andres');
  await page.fill('input[name="seg_persona[ci]"]', '12345678');
  await page.selectOption('select[name="seg_persona[ci_extension]"]', 'La Paz');
  await page.fill('input[name="seg_persona[telefono_fijo]"]', '4444444');
  await page.fill('input[name="seg_persona[celular]"]', '77777777');
  await page.fill('input[name="seg_persona[direccion]"]', 'Av. Bolivia 123');
  await page.fill('input[name="seg_persona[correo_personal]"]', 'andres@mail.com');
  await page.selectOption('select[name="seg_persona[genero]"]', 'M');
  await page.fill('input[name="seg_persona[profesion]"]', 'Ingeniero');
  await page.selectOption('select[name="seg_persona[estado]"]', 'activo');

  // 11. Hacer clic en "Guardar"
  await page.click('#boton_guardar');

  // 12. Verificar que el modal se haya cerrado
  await expect(modal).toBeHidden();
});

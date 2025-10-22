// tests/registroPersona.spec.js
const { test, expect } = require('@playwright/test');

test('Login y crear una nueva Forma de Pago', async ({ page }) => {
  // 1️⃣ Abrir la página de login
  await page.goto('https://pruebas-3-3hjs.onrender.com/');

  // 2️⃣ Llenar usuario y contraseña
  await page.fill('input[name="seg_usuario[login]"]', 'morgan.checa');
  await page.fill('input[name="seg_usuario[password]"]', 'A123456a');

  // 3️⃣ Hacer clic en el botón "Ingresar"
  await page.click('#enviar');

  // 4️⃣ Esperar que cargue el menú principal
  await page.waitForSelector('#menu-padre-16');


  // Módulo principal
  const moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
  const menuParametros = page.locator('#menu-padre-17 > a:has-text("Parámetros")');
  const submenuFormasPago = page.locator('#tab-20:has-text("Formas de Pago")');

  // Botones CRUD
  const btnCrear = page.locator('button[name="Crear"]');
  const btnEditar = page.locator('button[name="Editar"]');
  const btnEliminar = page.locator('button[name="Eliminar"]');
  const btnActualizar = page.locator('button[name="Actualizar"]');

  // Modal y campos
  const modalFormaPago = page.locator('#modal-forma-pago');
  const inputNombreFormaPago = page.locator('input[name="joy_forma_pago[nombre_forma_pago]"]');
  const inputDescripcion = page.locator('textarea[name="joy_forma_pago[descripcion_forma_pago]"]');
  const btnGuardar = page.locator('#boton_guardar');

  // -------------------------------
  // 🚀 Flujo de acciones
  // -------------------------------

  // Abrir el módulo de joyería
  await moduloJoyeria.click();

  // Abrir el submenú “Parámetros”
  await menuParametros.click();

  // Click en “Formas de Pago”
  await submenuFormasPago.click();

  // Esperar que aparezcan los botones CRUD
  await btnCrear.waitFor({ state: 'visible' });

  // Click en el botón Crear
  await btnCrear.click();

  // Esperar que el modal se muestre
  await modalFormaPago.waitFor({ state: 'visible' });

  // Llenar el formulario
  await inputNombreFormaPago.fill('Pago en Efectivo');
  await inputDescripcion.fill('Forma de pago en caja.');

  // Guardar el registro
  await btnGuardar.click();

  // Esperar que el modal se cierre
  await expect(modalFormaPago).toBeHidden();

  // (Opcional) Validar que el nuevo registro aparezca en la lista
  await btnActualizar.click();
  await expect(page.locator('text=Pago en Efectivo')).toBeVisible();

  console.log('✅ Prueba completada: se creó la forma de pago correctamente');
});

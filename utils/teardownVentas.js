
const ventasCreadas = [];

function registrarVentaCreada(descripcion) {
  if (descripcion && !ventasCreadas.includes(descripcion)) {
    ventasCreadas.push(descripcion);
    console.log(` Registrada: "${descripcion}"`);
  }
}

async function limpiarVentasCreadas(page) {
  try {
    if (ventasCreadas.length === 0) {
      console.log('  No hay ventas para limpiar');
      return;
    }

    console.log(` Limpiando ${ventasCreadas.length} ventas...`);
    
    const { VentasPage } = require('../pages/VentasPage');
    const ventasPage = new VentasPage(page);
    
    await page.goto('/');
    await ventasPage.abrirModulo();
    await page.waitForTimeout(2000);

    let eliminadas = 0;

    while (ventasCreadas.length > 0) {
      try {
        const count = await ventasPage.tabla.locator('tr').count();
        
        if (count === 0) {
          console.log(' Tabla vacía');
          break;
        }

        const fila = ventasPage.tabla.locator('tr').first();
        await fila.click();
        await page.waitForTimeout(300);
        
       
        await ventasPage.btnEliminar.click();
        await page.waitForTimeout(300);
      
        await ventasPage.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
        await ventasPage.btnConfirmarEliminar.click();
        await ventasPage.toastExito.waitFor({ state: 'visible', timeout: 5000 });
        await page.waitForTimeout(500);
        
        eliminadas++;
        ventasCreadas.shift(); 
        
        console.log(`  ${eliminadas} eliminadas`);

      } catch (error) {
        console.log(` Error: ${error.message}`);
        break;
      }
    }

    console.log(` ${eliminadas} ventas eliminadas`);
    ventasCreadas.length = 0;
    
  } catch (error) {
    console.log(` Error: ${error.message}`);
    ventasCreadas.length = 0;
  }
}

module.exports = { 
  limpiarVentasCreadas,
  registrarVentaCreada
};
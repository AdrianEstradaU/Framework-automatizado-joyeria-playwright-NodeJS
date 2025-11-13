const { BasePage } = require('./BasePage');


class RegistroGestionPage extends BasePage {
  constructor(page) {
    super(page);
  
    this.moduloJoyeria = page.locator('#menu-padre-16 > a span:has-text("Módulo de Joyeria")');
    this.menuParametros = page.locator('#menu-padre-17 > a:has-text("Parámetros")');
    this.submenu = page.locator('#tab-31:has-text("Registro de Gestión")');


    this.btnCrear = page.locator('button[name="Crear"]');
    this.btnGuardar = page.locator('#boton_guardar');
    this.btnEditar = page.locator('button[name="Editar"]');
    this.btnEliminar = page.locator('button[name="Eliminar"]');
    this.btnActualizar = page.locator('button[name="Actualizar"]');

  
    this.inputAnio = page.locator('input[name="joy_gestion[anio]"]');

  
    this.tabla = page.locator('#gestion tbody');
    this.buscador = page.locator('input[type="search"][aria-controls="gestion"]');

  
    this.modal = page.locator('.modal-dialog, .modal-content').first();
    this.errorAnio = page.locator('#joy_gestion\\[anio\\]-error');

  
    this.toastMessage = page.locator('.overhang-message');
    this.toastExito = page.locator('.overhang-message', { hasText: 'El proceso se ha realizado exitosamente' });
    this.toastError = page.locator('.overhang-message', { hasText: 'El formato JSON solicitado ha fallado' });
    
   
    this.mensajeEliminar = page.locator('.overhang-message', { hasText: '¿Desea eliminar el registro seleccionado?' });
    this.btnConfirmarEliminar = page.locator('.overhang-yes-option');
    this.btnCancelarEliminar = page.locator('.overhang-no-option');
  }

  async abrirModulo() {
    await this.moduloJoyeria.waitFor({ state: 'visible', timeout: 10000 });
    await this.navigateMenu(this.moduloJoyeria, this.menuParametros, this.submenu);
    await this.tabla.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  async crearRegistro(anio) {
    try {
      console.log(` Creando registro: ${anio}`);
      
      await this.click(this.btnCrear);
      await this.modal.waitFor({ state: 'visible', timeout: 5000 });
      await this.inputAnio.waitFor({ state: 'visible', timeout: 5000 });
      await this.fill(this.inputAnio, anio);
      await this.click(this.btnGuardar);
      
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1500);
      
      console.log(`Registro ${anio} creado`);
    } catch (error) {
      console.log(` Error al crear registro ${anio}:`, error.message);
      throw error;
    }
  }

  async eliminarRegistroSilencioso(anio) {
    try {
      await this.seleccionarFila(anio);
      await this.click(this.btnEliminar);
      await this.confirmarEliminacion();
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log(` No se pudo eliminar ${anio} (probablemente no existe)`);
    }
  }

  async editarRegistro(anioOriginal, anioEditado) {
    try {
      console.log(` Editando: ${anioOriginal} → ${anioEditado}`);
      
      await this.seleccionarFila(anioOriginal);
      await this.click(this.btnEditar);
      await this.modal.waitFor({ state: 'visible', timeout: 5000 });
      await this.inputAnio.waitFor({ state: 'visible', timeout: 5000 });
      await this.inputAnio.clear();
      await this.fill(this.inputAnio, anioEditado);
      await this.btnGuardar.scrollIntoViewIfNeeded();
      await this.click(this.btnGuardar);
      
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1500);
      
      console.log(` Registro editado exitosamente`);
    } catch (error) {
      console.log(` Error al editar registro:`, error.message);
      throw error;
    }
  }

  async eliminarRegistro(anio) {
    try {
      console.log(` Eliminando: ${anio}`);
      
      await this.seleccionarFila(anio);
      await this.click(this.btnEliminar);
      await this.confirmarEliminacion();
      
      console.log(` Registro ${anio} eliminado`);
      
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log(` Error al eliminar registro:`, error.message);
      throw error;
    }
  }

  async seleccionarFila(anio) {
    try {
      await this.buscar(anio);
      
      const fila = this.tabla.locator(`tr:has-text("${anio}")`).first();
      await fila.waitFor({ state: 'visible', timeout: 10000 });
      await fila.scrollIntoViewIfNeeded();
      await fila.click();
      await this.page.waitForTimeout(500);

      const visible = await fila.isVisible();
      if (!visible) {
        throw new Error(` No se encontró la fila con año "${anio}" después del clic`);
      }

      await this.page.waitForLoadState('networkidle');
      console.log(`Fila ${anio} seleccionada`);
    } catch (error) {
      console.log(` Error al seleccionar fila ${anio}:`, error.message);
      throw error;
    }
  }

  async buscar(termino) {
    await this.buscador.clear();
    await this.page.waitForTimeout(500);
    await this.buscador.fill(termino);
    await this.page.waitForTimeout(1500);
  }

  async buscarRegistro(anio) {
    await this.buscar(anio);
  }

  async seleccionarRegistro(anio) {
    await this.seleccionarFila(anio);
  }

  async verificarRegistroExiste(anio) {
  try {
   
    await this.buscador.clear();
    await this.page.waitForTimeout(500);
    
 
    await this.buscador.fill(anio);
    await this.page.waitForTimeout(1000);
    
   
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
    
 
    const filas = await this.tabla.locator('tr').allTextContents();
    
    
    const sinDatos = filas.some(f => 
      f.includes('No data available') || 
      f.includes('Sin datos') ||
      f.includes('No hay') ||
      f.includes('No matching records')
    );
    
    if (sinDatos) {
      console.log(` No se encontró registro ${anio} (sin datos)`);
      return false;
    }
    
    // Verificar si el año existe en alguna fila
    const existe = filas.some(f => f.includes(anio));
    
    if (existe) {
      console.log(` Registro ${anio} encontrado`);
    } else {
      console.log(` Registro ${anio} no encontrado`);
      console.log('Filas disponibles:', filas);
    }
    
    return existe;
  } catch (error) {
    console.log(` Error al verificar registro ${anio}:`, error.message);
    return false;
  }
}



async eliminarRegistroSilencioso(anio) {
  try {
    console.log(` Intentando eliminar registro: ${anio}`);
    
  
    await this.btnActualizar.click();
    await this.page.waitForTimeout(1000);
    
    
    const existe = await this.verificarRegistroExiste(anio);
    if (!existe) {
      console.log(`Registro ${anio} no existe, saltando eliminación`);
      return;
    }
    

    await this.seleccionarFila(anio);
    await this.click(this.btnEliminar);
    await this.confirmarEliminacion();
    await this.page.waitForTimeout(1500);
    
    console.log(` Registro ${anio} eliminado exitosamente`);
  } catch (error) {
    console.log(`⚠ No se pudo eliminar ${anio}: ${error.message}`);
    
  }
}
  async validarToast(mensajeEsperado = 'El proceso se ha realizado exitosamente') {
    try {
      await this.toastMessage.waitFor({ state: 'visible', timeout: 8000 });
      const texto = await this.toastMessage.textContent();
      const resultado = texto.includes(mensajeEsperado);
      return resultado;
    } catch (error) {
      console.log(` No se detectó toast`);
      return false;
    }
  }

  async confirmarEliminacion() {
    await this.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
    await this.btnConfirmarEliminar.scrollIntoViewIfNeeded();
    await this.click(this.btnConfirmarEliminar);
    await this.toastExito.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {
      console.log(' Toast de éxito no apareció después de eliminar');
    });
  }

  async cancelarEliminacion() {
  await this.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
  await this.click(this.btnCancelarEliminar);
  
  await this.mensajeEliminar.waitFor({ state: 'hidden', timeout: 5000 });
  await this.page.waitForTimeout(1000);
  
  console.log(' Eliminación cancelada correctamente');
}
  async validarError(mensajeEsperado) {
    try {
      await this.errorAnio.waitFor({ state: 'visible', timeout: 3000 });
      const texto = await this.errorAnio.textContent();
      return new RegExp(mensajeEsperado, 'i').test(texto);
    } catch {
      return false;
    }
  }
}

module.exports = { RegistroGestionPage };
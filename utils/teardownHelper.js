const logger = require("./loggers.js");

class TeardownHelper {
  constructor() {
    this.registrosCreados = [];
    this.registrosProtegidos = [2025];
  }

  
  registrar(anio) {
    if (!this.registrosCreados.includes(anio)) {
      this.registrosCreados.push(anio);
      logger.info(` Registro ${anio} agregado para limpieza`);
    }
  }

  registrarVarios(...anios) {
    anios.forEach(anio => this.registrar(anio));
  }

  async limpiarTodo(page, PageClass) {
    if (this.registrosCreados.length === 0) {
      logger.info(' No hay registros para limpiar');
      return { eliminados: 0, fallidos: 0, total: 0 };
    }

    logger.info(`\n${'='.repeat(60)}`);
    logger.info(`  LIMPIEZA FINAL: ${this.registrosCreados.length} registro(s)`);
    logger.info(`  Registros: ${this.registrosCreados.join(', ')}`);
    logger.info(`${'='.repeat(60)}\n`);

    const registro = new PageClass(page);
    
    try {
      await page.goto('/', { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);
      await registro.abrirModulo();
      await page.waitForTimeout(2000);
    } catch (error) {
      logger.error(`  Error abriendo módulo para limpieza: ${error.message}`);
      return { eliminados: 0, fallidos: this.registrosCreados.length, total: this.registrosCreados.length };
    }

    let eliminados = 0;
    let fallidos = 0;

    for (let i = 0; i < this.registrosCreados.length; i++) {
      const anio = this.registrosCreados[i];
      const progreso = `[${i + 1}/${this.registrosCreados.length}]`;
      
      try {
        logger.info(`\n ${progreso}   Eliminando: ${anio}`);
        
        // Actualizar tabla
        await registro.btnActualizar.click();
        await page.waitForTimeout(1500);
        
        // Buscar el registro
        await registro.buscador.clear();
        await page.waitForTimeout(300);
        await registro.buscador.fill(anio.toString());
        await page.waitForTimeout(1000);
        
        // Verificar si existe
        const filas = await registro.tabla.locator('tr').allTextContents();
        const existe = filas.some(f => f.includes(anio.toString()));
        
        if (!existe) {
          logger.info(`     Registro ${anio} no encontrado (ya fue eliminado)`);
          eliminados++; // Contar como exitoso si ya no existe
          continue;
        }
        
        logger.info(`    Registro encontrado`);
        
        // Seleccionar fila
        const fila = registro.tabla.locator(`tr:has-text("${anio}")`).first();
        await fila.waitFor({ state: 'visible', timeout: 5000 });
        await fila.click();
        await page.waitForTimeout(500);
        logger.info(`    Fila seleccionada`);
        
        // Clic en eliminar
        await registro.btnEliminar.waitFor({ state: 'visible', timeout: 5000 });
        await registro.btnEliminar.click();
        await page.waitForTimeout(800);
        logger.info(`    Botón eliminar presionado`);
        
        // Confirmar eliminación
        await registro.mensajeEliminar.waitFor({ state: 'visible', timeout: 5000 });
        logger.info(`    Modal de confirmación visible`);
        
        await registro.btnConfirmarEliminar.click();
        await page.waitForTimeout(2000);
        
        logger.info(`    Registro ${anio} ELIMINADO`);
        eliminados++;
        
      } catch (error) {
        logger.error(`    Error eliminando ${anio}: ${error.message}`);
        fallidos++;
      }
    }
    
    // Resumen
    logger.info(`\n${'='.repeat(60)}`);
    logger.info(`  RESUMEN DE LIMPIEZA:`);
    logger.info(`    Eliminados exitosamente: ${eliminados}`);
    logger.info(`    Fallidos: ${fallidos}`);
    logger.info(`    Total procesados: ${this.registrosCreados.length}`);
    
    if (eliminados === this.registrosCreados.length) {
      logger.info(`    ¡100% de limpieza exitosa!`);
    } else if (eliminados > 0) {
      logger.info(`     Limpieza parcial (${Math.round(eliminados/this.registrosCreados.length*100)}%)`);
    } else {
      logger.error(`    No se pudo eliminar ningún registro`);
    }
    logger.info(`${'='.repeat(60)}\n`);
    
    this.registrosCreados = [];
    
    return { eliminados, fallidos, total: eliminados + fallidos };
  }

  cantidad() {
    return this.registrosCreados.length;
  }

  reset() {
    const cantidad = this.registrosCreados.length;
    this.registrosCreados = [];
    logger.info(` Array de registros reseteado (${cantidad} registros)`);
    return cantidad;
  }
}

module.exports = { TeardownHelper };
const proveedoresData = {
  valid: { nombre: 'DIAMANTE', descripcion: 'Proveedor de joyas finas' },
  invalid: { nombre: '', descripcion: '' },
  limites: {
    nombreLargo: 'A'.repeat(65),          // para probar límite de 64 caracteres
    descripcionLarga: 'D'.repeat(256)     // ejemplo de descripción larga
  },
   validFlujo: { nombre: 'DIAMANTE BLANCO', descripcion: 'Proveedor de joyas finas' },
  busqueda: { termino: 'DIAMANTE' }       // para probar búsqueda en tabla
};

module.exports = { proveedoresData };

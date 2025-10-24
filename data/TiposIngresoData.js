const tiposIngresoData = {
  valid: {
    nombre: 'SALARIO',
    descripcion: 'Ingreso mensual por trabajo',
  },
  invalid: {
    nombre: '',
    descripcion: '',
  },
  limites: {
    nombreLargo: 'N'.repeat(65),
    descripcionLarga: 'D'.repeat(300),
  },
  busqueda: {
    termino: 'VENTAS NORMALES',
  },
};

module.exports = { tiposIngresoData };

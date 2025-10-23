const formasPagoData = {
  // ✅ Datos válidos
  valid: {
    nombre: 'PAGO TARJETA',
    descripcion: 'Pago con tarjeta de crédito/débito'
  },

  // ❌ Datos inválidos (campos vacíos)
  invalid: {
    nombre: '',
    descripcion: ''
  },

  // 📏 Datos con límites
  limites: {
    nombreLargo: 'A'.repeat(70), // Excede 64 caracteres
    nombreMaximo: 'A'.repeat(64), // Justo en el límite
    descripcionLarga: 'B'.repeat(260), // Excede 255 caracteres
    descripcionMaxima: 'B'.repeat(255) // Justo en el límite
  },

  // 🎯 Datos para diferentes escenarios
  escenarios: {
    efectivo: {
      nombre: 'EFECTIVO',
      descripcion: 'Pago en efectivo al momento de la compra'
    },
    transferencia: {
      nombre: 'TRANSFERENCIA',
      descripcion: 'Transferencia bancaria'
    },
    qr: {
      nombre: 'QR',
      descripcion: 'Pago mediante código QR'
    }
  }
};

module.exports = { formasPagoData };
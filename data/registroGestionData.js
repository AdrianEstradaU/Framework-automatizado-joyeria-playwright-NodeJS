// Genera un año único basado en timestamp + random para evitar duplicados
const generarAnioUnico = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000);
  // Combinar timestamp y random para crear año único de 4 dígitos
  const anio = (timestamp.slice(-3) + random.toString().padStart(1, '0')).slice(0, 4);
  return anio;
};

const registroGestionData = {
  valid: {
    generarAnio: () => generarAnioUnico(),  
    anioFijo: '2023'                        
  },
  invalid: {
    vacio: '',                              
    demasiadoLargo: '12345',                
    noNumerico: '20AB'                      
  },
  limites: {
    maxCaracteres: 4
  }
};

module.exports = { registroGestionData };
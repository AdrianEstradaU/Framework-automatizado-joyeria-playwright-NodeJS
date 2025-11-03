const generarAnioUnico = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  
 
  const primerDigito = Math.floor(Math.random() * 9) + 1; // 1-9
  
  
  const restoDigitos = ((timestamp + random) % 1000).toString().padStart(3, '0');
  
  
  const anio = primerDigito + restoDigitos;
  
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
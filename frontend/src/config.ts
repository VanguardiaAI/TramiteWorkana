// Archivo de configuración para URLs de API
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // En producción, utilizará el proxy de nginx
  : 'http://localhost:5000/api'; // En desarrollo

export default API_URL; 
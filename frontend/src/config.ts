// Configuración para entornos
let API_URL: string;

// Determinar el entorno basado en la URL actual
const isProduction = window.location.hostname === 'ingenieracochele.com' || 
                      window.location.hostname === 'www.ingenieracochele.com';

if (isProduction) {
  // URL para producción
  API_URL = 'https://ingenieracochele.com/api';
} else {
  // URL para desarrollo
  API_URL = 'http://localhost:5000/api';
}

export { API_URL }; 
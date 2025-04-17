// Configuración para entornos
let API_URL: string;

// Determinar el entorno basado en la URL actual
const isProduction = window.location.hostname === 'cochele.clinicas.tech';

if (isProduction) {
  // URL para producción
  API_URL = 'https://cochele.clinicas.tech/api';
} else {
  // URL para desarrollo
  API_URL = 'http://localhost:5000/api';
}

export { API_URL }; 
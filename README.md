# Sistema de Trámites

Aplicación web para gestión de trámites con React + TypeScript en el frontend y Flask + SQLite en el backend.

## Requisitos

- Node.js
- Python 3.8+
- npm o yarn

## Estructura del Proyecto

```
tramite-app/
├── backend/         # API Flask + SQLite
└── frontend/        # React + TypeScript + Vite + Shadcn UI
```

## Instalación y Ejecución

### Frontend

1. Navegar al directorio del frontend:
```
cd tramite-app/frontend
```

2. Instalar dependencias:
```
npm install
```

3. Iniciar el servidor de desarrollo:
```
npm run dev
```

El frontend estará disponible en: http://localhost:5173

### Backend

1. Navegar al directorio del backend:
```
cd tramite-app/backend
```

2. Crear un entorno virtual (recomendado):
```
python -m venv venv
venv\Scripts\activate
```

3. Instalar dependencias:
```
pip install -r requirements.txt
```

4. Iniciar el servidor Flask:
```
python app.py
```

El backend estará disponible en: http://localhost:5000

## Funcionalidades

- **Autenticación**: Registro de usuarios e inicio de sesión
- **Dashboard**: Página principal con acceso a los formularios
- **Formularios**: Tres tipos diferentes de formularios para trámites
- **API RESTful**: Backend con Flask que proporciona endpoints para todas las funcionalidades

## Tecnologías Utilizadas

### Frontend
- React
- TypeScript
- Vite
- Shadcn UI
- React Router

### Backend
- Flask
- SQLAlchemy
- SQLite
- JWT para autenticación 
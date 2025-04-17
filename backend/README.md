# Sistema de Gestión de Trámites - Backend

## Configuración del Sistema de Notificaciones por Email

El sistema ahora incluye la capacidad de enviar notificaciones por correo electrónico a los clientes cuando un trámite cambia su estado de "Pendiente" a "Completado".

### Requisitos previos

1. Cuenta en SendGrid (puedes registrarte en [SendGrid](https://sendgrid.com/))
2. API Key de SendGrid con permisos para enviar correos

### Configuración

1. Copia el archivo `.env.example` y renómbralo a `.env`:
   ```
   copy .env.example .env
   ```

2. Edita el archivo `.env` y añade tu API Key de SendGrid:
   ```
   SENDGRID_API_KEY=tu_api_key_de_sendgrid
   EMAIL_SENDER=tu_email@verificado.com
   ```
   
   > **Importante**: El email que uses como remitente debe estar verificado en tu cuenta de SendGrid.

3. Instala las nuevas dependencias:
   ```
   pip install -r requirements.txt
   ```

### Cómo funciona

1. Cuando un empleado actualiza el estado de un trámite a "Completado", tiene la opción de enviar una notificación por correo al cliente.
2. Si selecciona esta opción, el sistema envía automáticamente un correo al cliente usando la dirección de email registrada en el trámite.
3. El correo incluye los detalles del trámite completado.

### Solución de problemas

Si el correo no se envía correctamente:

1. Verifica que la API key de SendGrid esté correctamente configurada en el archivo `.env`
2. Asegúrate de que el email remitente esté verificado en tu cuenta de SendGrid
3. Revisa los logs del servidor para más detalles sobre posibles errores

### Personalización

Puedes personalizar el contenido del correo electrónico modificando la plantilla HTML en la función `update_tramite_estado` en el archivo `app.py`. 
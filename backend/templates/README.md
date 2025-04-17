# Plantillas de correo electrónico para el sistema de trámites

Este documento describe las diferentes plantillas de correo electrónico que deben configurarse en SendGrid para el sistema de trámites.

## Configuración en SendGrid

1. Inicie sesión en su cuenta de SendGrid
2. Vaya a la sección "Email API" > "Dynamic Templates"
3. Cree una nueva plantilla dinámica para cada uno de los tipos de correo siguientes
4. Diseñe cada plantilla según las especificaciones y guarde el ID de la plantilla

## Plantillas requeridas

### 1. Plantilla de finalización de trámite (ID sugerido: `finalizado`)

Esta plantilla se envía cuando un trámite ha sido marcado como finalizado.

**Asunto sugerido**: "✅ Su trámite ha sido finalizado con éxito"

**Contenido sugerido**:
```html
<p>Estimado/a {{nombreCliente}},</p>

<p>Nos complace informarle que su trámite con número de expediente <strong>{{numeroExpediente}}</strong> ha sido completado y finalizado exitosamente.</p>

<p>Detalles del trámite:</p>
<ul>
  <li><strong>Tipo de trámite:</strong> {{tipoTramite}}</li>
  <li><strong>CUPS:</strong> {{cups}}</li>
  <li><strong>Dirección:</strong> {{direccion}}</li>
  <li><strong>Fecha de apertura:</strong> {{fechaApertura}}</li>
</ul>

<p>Agradecemos su confianza en nuestros servicios.</p>

<p>Atentamente,<br>
El equipo de gestión de trámites</p>
```

### 2. Plantilla de solicitud de incidencia (ID sugerido: `incidencia`)

Esta plantilla se envía cuando se registra una incidencia en el trámite y se requiere información adicional del cliente.

**Asunto sugerido**: "⚠️ Información requerida para resolver incidencia en su trámite"

**Contenido sugerido**:
```html
<p>Estimado/a {{nombreCliente}},</p>

<p>Le informamos que se ha registrado una incidencia en su trámite con número de expediente <strong>{{numeroExpediente}}</strong>.</p>

<p>Para poder resolverla, necesitamos que nos proporcione la siguiente información o documentación:</p>

<div style="background-color: #f8f9fa; border-left: 4px solid #e63946; padding: 15px; margin: 20px 0;">
  <p style="margin: 0;">{{mensajeIncidencia}}</p>
</div>

<p>Por favor, responda a este correo con la información solicitada para poder continuar con la gestión de su trámite.</p>

<p>Detalles del trámite:</p>
<ul>
  <li><strong>Tipo de trámite:</strong> {{tipoTramite}}</li>
  <li><strong>CUPS:</strong> {{cups}}</li>
  <li><strong>Dirección:</strong> {{direccion}}</li>
</ul>

<p>Si tiene alguna pregunta adicional, no dude en contactarnos.</p>

<p>Atentamente,<br>
El equipo de gestión de trámites</p>
```

### 3. Plantilla de gestión de pago (ID sugerido: `pago`)

Esta plantilla se envía cuando el trámite requiere un pago y se solicita al cliente el justificante correspondiente.

**Asunto sugerido**: "💰 Justificante de pago requerido para su trámite"

**Contenido sugerido**:
```html
<p>Estimado/a {{nombreCliente}},</p>

<p>Le informamos que su trámite con número de expediente <strong>{{numeroExpediente}}</strong> se encuentra en la fase de gestión de pago.</p>

<p>Para poder continuar con el proceso, es necesario que nos envíe el justificante de pago correspondiente. Por favor, responda a este correo adjuntando dicho justificante en formato PDF o imagen.</p>

<p><strong>Instrucciones de pago:</strong></p>
<ol>
  <li>Realice la transferencia a la cuenta bancaria indicada en la carta de condiciones</li>
  <li>Incluya el número de expediente {{numeroExpediente}} como concepto</li>
  <li>Guarde el justificante bancario</li>
  <li>Responda a este correo adjuntando el justificante</li>
</ol>

<p>Detalles del trámite:</p>
<ul>
  <li><strong>Tipo de trámite:</strong> {{tipoTramite}}</li>
  <li><strong>CUPS:</strong> {{cups}}</li>
  <li><strong>Dirección:</strong> {{direccion}}</li>
</ul>

<p>Si tiene alguna pregunta sobre el proceso de pago, no dude en contactarnos.</p>

<p>Atentamente,<br>
El equipo de gestión de trámites</p>
```

## Implementación en el backend

Para integrar estas plantillas con el backend, asegúrese de:

1. Configurar las claves API de SendGrid en el archivo de entorno (.env)
2. Actualizar el servicio de correos para manejar los diferentes tipos de plantillas
3. Asegurarse de que el controlador de trámites pase el tipo de plantilla al servicio de correos

### Ejemplo de implementación en el controlador

```javascript
// Modificación en el controlador de trámites
const updateTramiteEstado = async (req, res) => {
  const { id } = req.params;
  const { estado, enviarCorreo, emailTemplateType, mensajeIncidencia } = req.body;
  
  try {
    // Actualizar estado del trámite en base de datos
    // ...
    
    // Si se solicita enviar correo
    if (enviarCorreo) {
      const tramite = await Tramite.findByPk(id);
      
      // Configurar los datos según el tipo de plantilla
      const emailData = {
        to: tramite.email,
        nombreCliente: tramite.nombreCliente,
        numeroExpediente: tramite.numeroExpediente,
        tipoTramite: tramite.tipo,
        cups: tramite.cups,
        direccion: tramite.direccion,
        fechaApertura: tramite.fecha,
        // Para incidencias, incluir el mensaje personalizado
        mensajeIncidencia: mensajeIncidencia
      };
      
      // Enviar correo con la plantilla adecuada
      await emailService.sendTemplateEmail(emailTemplateType, emailData);
    }
    
    res.status(200).json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del trámite' });
  }
};
``` 
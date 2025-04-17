const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configurar API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// IDs de las plantillas en SendGrid
const TEMPLATE_IDS = {
  finalizado: process.env.SENDGRID_TEMPLATE_FINALIZADO,
  incidencia: process.env.SENDGRID_TEMPLATE_INCIDENCIA,
  pago: process.env.SENDGRID_TEMPLATE_PAGO
};

/**
 * Envía un correo electrónico usando una plantilla de SendGrid
 * @param {string} templateType - Tipo de plantilla a utilizar (finalizado, incidencia, pago)
 * @param {Object} data - Datos para la plantilla
 * @param {string} data.to - Correo electrónico del destinatario
 * @param {string} data.nombreCliente - Nombre del cliente
 * @param {string} data.numeroExpediente - Número de expediente
 * @param {string} data.tipoTramite - Tipo de trámite
 * @param {string} data.cups - Código CUPS
 * @param {string} data.direccion - Dirección del inmueble
 * @param {string} data.fechaApertura - Fecha de apertura del trámite
 * @param {string} data.mensajeIncidencia - Mensaje específico para incidencias (solo para plantilla de incidencia)
 * @returns {Promise} Promesa que se resuelve cuando el correo es enviado
 */
const sendTemplateEmail = async (templateType, data) => {
  try {
    // Verificar que el tipo de plantilla es válido
    if (!TEMPLATE_IDS[templateType]) {
      throw new Error(`Tipo de plantilla no válido: ${templateType}`);
    }

    // Crear mensaje con la plantilla correspondiente
    const msg = {
      to: data.to,
      from: process.env.EMAIL_FROM || 'no-reply@tramites.com',
      templateId: TEMPLATE_IDS[templateType],
      dynamicTemplateData: {
        nombreCliente: data.nombreCliente,
        numeroExpediente: data.numeroExpediente || 'Sin asignar',
        tipoTramite: data.tipoTramite,
        cups: data.cups,
        direccion: data.direccion,
        fechaApertura: data.fechaApertura,
        mensajeIncidencia: data.mensajeIncidencia
      }
    };

    // Enviar correo
    const response = await sgMail.send(msg);
    console.log('Correo enviado con éxito:', response[0].statusCode);
    return response;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};

module.exports = {
  sendTemplateEmail
}; 
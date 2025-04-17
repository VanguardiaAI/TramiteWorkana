// Actualizar el estado de un trámite
const updateTramite = async (req, res) => {
  const { id } = req.params;
  const { 
    numeroExpediente,
    estado, 
    enviarCorreo, 
    emailTemplateType, 
    mensajeIncidencia 
  } = req.body;

  try {
    // Buscar el trámite en la base de datos
    const tramite = await Tramite.findByPk(id);
    
    if (!tramite) {
      return res.status(404).json({ message: 'Trámite no encontrado' });
    }

    // Actualizar campos
    if (numeroExpediente !== undefined) {
      tramite.numeroExpediente = numeroExpediente;
    }
    
    if (estado !== undefined) {
      tramite.estado = estado;
    }

    // Guardar cambios
    await tramite.save();

    // Si se solicitó enviar correo electrónico
    if (enviarCorreo) {
      try {
        const emailService = require('../services/emailService');
        
        // Configurar los datos para la plantilla
        const emailData = {
          to: tramite.email,
          nombreCliente: tramite.nombreCliente,
          numeroExpediente: tramite.numeroExpediente,
          tipoTramite: tramite.tipo,
          cups: tramite.cups,
          direccion: tramite.direccion,
          fechaApertura: tramite.fecha,
          mensajeIncidencia: mensajeIncidencia
        };
        
        // Enviar correo con la plantilla correspondiente
        await emailService.sendTemplateEmail(emailTemplateType, emailData);
        
        console.log(`Correo de tipo ${emailTemplateType} enviado al cliente ${tramite.email}`);
      } catch (emailError) {
        console.error('Error al enviar correo:', emailError);
        return res.status(200).json({
          message: 'Trámite actualizado, pero hubo un error al enviar el correo',
          error: emailError.message
        });
      }
    }

    res.status(200).json({ message: 'Trámite actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar trámite:', error);
    res.status(500).json({ message: 'Error al actualizar el trámite' });
  }
}; 
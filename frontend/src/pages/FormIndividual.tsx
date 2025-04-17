import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

interface LocationState {
  tipoEspecifico?: string;
  tipoFormulario?: string;
}

const FormIndividual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tipoEspecifico, tipoFormulario } = (location.state as LocationState) || {};
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipoTramite, setTipoTramite] = useState<string>('Individual');
  const [formData, setFormData] = useState({
    nombreCliente: '',
    dniPdf: null as File | null,
    email: '',
    telefonoMovil: '',
    formatoAutorizacion: null as File | null,
    vivienda: '',
    cups: '',
    direccion: '',
    refCatastral: '',
    tension: '',
    potenciaNumerica: ''
  });

  // Establecer el tipo específico si existe
  useEffect(() => {
    if (tipoEspecifico) {
      setTipoTramite(tipoEspecifico);
      // Si recibimos un tipo específico que coincide con alguna opción de vivienda
      if (['Suministro de obras', 'Suministro eventual', 'Local comercial', 'Otros'].includes(tipoEspecifico)) {
        setFormData(prev => ({
          ...prev,
          vivienda: tipoEspecifico
        }));
      }
    }
  }, [tipoEspecifico]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        [fieldName]: file
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Para campos numéricos, solo permitir números
    if (name === 'potenciaNumerica' || name === 'numeroExpediente') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validación del formulario
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No está autenticado. Por favor, inicie sesión.');
        navigate('/login');
        return;
      }

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      
      // Añadir todos los campos de texto
      formDataToSend.append('tipo', tipoTramite);
      formDataToSend.append('nombreCliente', formData.nombreCliente);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telefonoMovil', formData.telefonoMovil);
      formDataToSend.append('cups', formData.cups);
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('refCatastral', formData.refCatastral);
      formDataToSend.append('tension', formData.tension);
      formDataToSend.append('potenciaNumerica', formData.potenciaNumerica);
      formDataToSend.append('vivienda', formData.vivienda);
      formDataToSend.append('formulario', tipoFormulario || 'Individual');
      
      // Añadir los archivos
      if (formData.dniPdf) {
        formDataToSend.append('dniPdf', formData.dniPdf);
      }
      
      if (formData.formatoAutorizacion) {
        formDataToSend.append('formatoAutorizacion', formData.formatoAutorizacion);
      }

      // Enviar datos al backend
      const response = await fetch('http://localhost:5000/api/tramites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend // No incluir Content-Type, el navegador lo establece automáticamente con FormData
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message || 'Trámite creado correctamente');
        // Reiniciar el formulario
        setFormData({
          nombreCliente: '',
          dniPdf: null,
          email: '',
          telefonoMovil: '',
          formatoAutorizacion: null,
          vivienda: '',
          cups: '',
          direccion: '',
          refCatastral: '',
          tension: '',
          potenciaNumerica: ''
        });
        setValidated(false);
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Error al crear el trámite');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="bg-success text-white">
          <h4 className="mb-0">Individual</h4>
        </Card.Header>
        <Card.Body>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="nombreCliente">
                <Form.Label>Nombre cliente</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese el nombre del cliente.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="dniPdf">
                <Form.Label>Adjuntar DNI (PDF)</Form.Label>
                <Form.Control
                  required
                  type="file"
                  name="dniPdf"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>, 'dniPdf')}
                />
                <Form.Control.Feedback type="invalid">
                  Por favor adjunte una copia del DNI en formato PDF.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese un email válido.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="telefonoMovil">
                <Form.Label>Teléfono Móvil</Form.Label>
                <Form.Control
                  required
                  type="tel"
                  name="telefonoMovil"
                  value={formData.telefonoMovil}
                  onChange={handleInputChange}
                  placeholder="Ej: 600123456"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese un número de teléfono móvil.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formatoAutorizacion">
                <Form.Label>Formato Autorización (PDF)</Form.Label>
                <Form.Control
                  required
                  type="file"
                  name="formatoAutorizacion"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>, 'formatoAutorizacion')}
                />
                <Form.Control.Feedback type="invalid">
                  Por favor adjunte el formato de autorización en PDF.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="vivienda">
                <Form.Label>Vivienda</Form.Label>
                <Form.Select
                  required
                  name="vivienda"
                  value={formData.vivienda}
                  onChange={handleSelectChange}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Suministro de obras">Suministro de obras</option>
                  <option value="Suministro eventual">Suministro eventual</option>
                  <option value="Local comercial">Local comercial</option>
                  <option value="Escalera-Ascensor">Escalera-Ascensor</option>
                  <option value="Punto de recarga">Punto de recarga</option>
                  <option value="Otros">Otros</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Por favor seleccione un tipo de vivienda.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="cups">
                <Form.Label>CUPS</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="cups"
                  value={formData.cups}
                  onChange={handleInputChange}
                  placeholder="Código Universal de Punto de Suministro"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese el CUPS.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="direccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Dirección completa"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese la dirección.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="refCatastral">
                <Form.Label>Ref catastral</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="refCatastral"
                  value={formData.refCatastral}
                  onChange={handleInputChange}
                  placeholder="Referencia catastral"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese la referencia catastral.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="tension">
                <Form.Label>Tensión</Form.Label>
                <Form.Select
                  required
                  name="tension"
                  value={formData.tension}
                  onChange={handleSelectChange}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="1x230">1x230</option>
                  <option value="3x230">3x230</option>
                  <option value="3x400/230">3x400/230</option>
                  <option value="15.000">15.000</option>
                  <option value="20.000">20.000</option>
                  <option value="30.000">30.000</option>
                  <option value="45.000">45.000</option>
                  <option value="80.000">80.000</option>
                  <option value="132.000">132.000</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Por favor seleccione la tensión.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="potenciaNumerica">
                <Form.Label>Potencia Numérica</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="potenciaNumerica"
                  value={formData.potenciaNumerica}
                  onChange={handleInputChange}
                  placeholder="Ingrese la potencia en kW"
                />
                <Form.Control.Feedback type="invalid">
                  Por favor ingrese la potencia numérica.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => navigate('/formulario')}>
                Volver
              </Button>
              <Button 
                type="submit" 
                variant="success"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar solicitud'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormIndividual; 
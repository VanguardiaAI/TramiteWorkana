import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css'; // Asegúrate de crear este archivo CSS

const LandingPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResultado(null);
    setCargando(true);

    try {
      const response = await fetch(`http://localhost:5000/api/expedientes/consulta?tipo=expediente&valor=${busqueda}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCargando(false);
        if (data) {
          setResultado(data);
        } else {
          setError('No se encontró información con los datos proporcionados');
        }
      } else {
        setCargando(false);
        setError(data.message || 'Error al buscar el expediente');
      }
    } catch (err) {
      setCargando(false);
      setError('Error de conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar con logo */}
      <header className="navbar-section">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="brand">
              <img src="/Logo.png" alt="Logo de la empresa" className="company-logo" />
            </div>
            <div className="d-flex align-items-center">
              <Link to="/login" className="btn btn-outline-primary btn-login-nav">
                <i className="bi bi-person-fill me-2"></i>Acceso Empleados
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Banner principal más discreto */}
      <div className="main-banner">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <div className="banner-content">
                <h3 className="mb-2">Consulta el estado de tu expediente</h3>
                <p className="mb-0">
                  Introduce tu número de expediente para conocer el estado actual de tu trámite.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="main-content">
        <Row className="mt-3">
          <Col lg={8} className="mx-auto">
            <Card className="search-card shadow">
              <Card.Body className="py-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <div className="main-search-container">
                        <div className="search-label-container">
                          <i className="bi bi-search-heart me-2"></i>
                          <Form.Label className="search-label">
                            Número de Expediente
                          </Form.Label>
                        </div>
                        <p className="search-description">Ingresa tu número de expediente para consultar su estado actual</p>
                        <Form.Control
                          type="text"
                          placeholder="Ej: EXP-2023-001"
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          required
                          className="form-control-custom"
                          size="lg"
                        />
                      </div>
                    </Col>
                  </Row>

                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                  <Button variant="primary" type="submit" className="btn-search" disabled={cargando} size="lg">
                    {cargando ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Buscando...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>Consultar Estado
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            
            {/* Botón de descarga destacado */}
            <div className="download-section text-center mt-4">
              <a href="/modelo.pdf" download className="btn btn-danger btn-download-pdf">
                <i className="bi bi-file-earmark-pdf-fill me-2"></i>
                Descargar Modelo de Autorización
              </a>
              <p className="download-info mt-2">
                Descarga el formato oficial requerido para iniciar tu trámite
              </p>
            </div>
          </Col>
        </Row>

        {resultado && (
          <Row>
            <Col lg={8} className="mx-auto">
              <Card className="result-card mb-5">
                <Card.Header className="result-header">
                  <h3 className="mb-0">
                    <i className="bi bi-file-text me-2"></i>
                    Información del Expediente
                  </h3>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3 result-row">
                    <Col sm={4} className="result-label">Número de Expediente:</Col>
                    <Col sm={8} className="result-value">{resultado.numeroExpediente || resultado.id}</Col>
                  </Row>
                  <Row className="mb-3 result-row">
                    <Col sm={4} className="result-label">Tipo:</Col>
                    <Col sm={8} className="result-value">{resultado.tipo}</Col>
                  </Row>
                  <Row className="mb-3 result-row">
                    <Col sm={4} className="result-label">Fecha de Solicitud:</Col>
                    <Col sm={8} className="result-value">{new Date(resultado.fechaCreacion).toLocaleDateString()}</Col>
                  </Row>
                  <Row className="mb-3 result-row">
                    <Col sm={4} className="result-label">Estado:</Col>
                    <Col sm={8}>
                      <span className={`status-badge ${resultado.estado === 'Completado' ? 'status-completed' : 'status-pending'}`}>
                        {resultado.estado === 'Completado' ? (
                          <><i className="bi bi-check-circle me-1"></i>{resultado.estado}</>
                        ) : (
                          <><i className="bi bi-clock-history me-1"></i>{resultado.estado}</>
                        )}
                      </span>
                    </Col>
                  </Row>
                  {resultado.comentarios && (
                    <Row className="mb-3 result-row">
                      <Col sm={4} className="result-label">Comentarios:</Col>
                      <Col sm={8} className="result-value">{resultado.comentarios}</Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row className="text-center mb-5">
          <Col>
            <div className="help-section">
              <div className="logo-conjunto-container">
                <img src="/Logo_Conjunto.png" alt="Logo Conjunto" className="logo-conjunto" />
              </div>
              <h3>¿Necesitas ayuda?</h3>
              <p>Si tienes alguna duda o necesitas asistencia, contacta con nuestro equipo de soporte:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="bi bi-telephone"></i>
                  <span>+34 900 123 456</span>
                </div>
                <div className="contact-item">
                  <i className="bi bi-envelope"></i>
                  <span>soporte@tramites.com</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <footer className="footer">
        <Container>
          <Row>
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0">Sistema de Gestión de Expedientes. Beta 1.0</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="footer-links">
                <a href="#" className="footer-link">Términos y Condiciones</a>
                <a href="#" className="footer-link">Política de Privacidad</a>
                <a href="#" className="footer-link">Contacto</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage; 
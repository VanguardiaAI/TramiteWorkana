import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

interface NavigationState {
  tipoEspecifico: string;
  tipoFormulario: string;
}

const FormularioSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar si el usuario viene de la landing page
  const isFromLandingPage = location.state?.from === 'landing';

  // Función para volver a la página anterior correcta
  const handleVolverClick = () => {
    if (isFromLandingPage) {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  // Función para navegar con el tipo específico seleccionado y el tipo de formulario
  const navegarConTipo = (rutaBase: string, tipoEspecifico: string, tipoFormulario: string) => {
    navigate(`/formulario/${rutaBase}`, { 
      state: { 
        tipoEspecifico,
        tipoFormulario,
        from: location.state?.from // Mantener la información de origen
      } 
    });
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Seleccione el tipo de trámite a realizar</h2>
          <p className="text-center text-muted">Elija una de las siguientes opciones para comenzar su trámite</p>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-hover">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Modificaciones en suministro existente</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center" style={{ minHeight: '350px' }}>
              <p className="text-muted mb-4 text-center">Para modificar uno o varios suministros o instalaciones existentes.</p>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('modificacion', 'Aumento de potencia', 'Modificación suministro existente')}
                >
                  Aumento de potencia
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('modificacion', 'Cambio de tensión', 'Modificación suministro existente')}
                >
                  Cambio de tensión
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('modificacion', 'Modificación de instalaciones', 'Modificación suministro existente')}
                >
                  Modificación de instalaciones
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-hover">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Individual</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center" style={{ minHeight: '350px' }}>
              <p className="text-muted mb-4 text-center">Para gestionar trámites relacionados con un único suministro.</p>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-success" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('individual', 'Suministro de vivienda', 'Individual')}
                >
                  Suministro de vivienda
                </Button>
                <Button 
                  variant="outline-success" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('individual', 'Suministro de obras', 'Individual')}
                >
                  Suministro de obras
                </Button>
                <Button 
                  variant="outline-success" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('individual', 'Suministro eventual', 'Individual')}
                >
                  Suministro eventual
                </Button>
                <Button 
                  variant="outline-success" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('individual', 'Local comercial', 'Individual')}
                >
                  Local comercial
                </Button>
                <Button 
                  variant="outline-success" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('individual', 'Punto de recarga', 'Individual')}
                >
                  Punto de recarga
                </Button>
                <Button 
                  variant="outline-success" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('individual', 'Otros', 'Individual')}
                >
                  Otros
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-hover">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Varios suministros</h5>
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center" style={{ minHeight: '350px' }}>
              <p className="text-muted mb-4 text-center">Para solicitar el alta de nuevos suministros eléctricos.</p>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-info" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('alta', 'Viviendas nuevas', 'Varios suministros')}
                >
                  Viviendas nuevas
                </Button>
                <Button 
                  variant="outline-info" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('alta', 'Locales comerciales', 'Varios suministros')}
                >
                  Locales comerciales
                </Button>
                <Button 
                  variant="outline-info" 
                  className="btn-selector py-2"
                  onClick={() => navegarConTipo('alta', 'Suministros múltiples', 'Varios suministros')}
                >
                  Suministros múltiples
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col className="text-center">
          <Button 
            variant="outline-secondary" 
            onClick={handleVolverClick}
            className="px-4 py-2"
          >
            {isFromLandingPage ? 'Volver a la página principal' : 'Volver al Dashboard'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FormularioSelector; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const CLAVE_CORRECTA = 'Workana2025';

const ClavePrivada = () => {
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (clave === CLAVE_CORRECTA) {
      navigate('/register/form');
    } else {
      setError('Clave incorrecta');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Header className="text-center">
              <Card.Title>Clave Privada</Card.Title>
              <Card.Subtitle className="text-muted">
                Ingresa la clave secreta para poder registrarte
              </Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Clave Secreta</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Clave secreta"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    required
                  />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" type="submit" className="w-100">
                  Continuar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClavePrivada; 
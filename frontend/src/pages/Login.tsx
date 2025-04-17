import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { API_URL } from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        // Redirigir a la página principal
        navigate('/dashboard');
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card>
            <Card.Header className="text-center">
              <Card.Title>Iniciar Sesión</Card.Title>
              <Card.Subtitle className="text-muted">
                Ingresa tus credenciales para acceder al sistema
              </Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" type="submit" className="w-100">
                  Iniciar Sesión
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                ¿No tienes una cuenta?{' '}
                <Button variant="link" onClick={() => navigate('/register')} className="p-0">
                  Regístrate
                </Button>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 
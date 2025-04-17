import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { API_URL } from '../config';

const FormSolicitud = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipoTramite: '',
    documentoAdjunto: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/solicitudes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Solicitud enviada correctamente');
        // Limpiar el formulario
        setFormData({
          titulo: '',
          descripcion: '',
          tipoTramite: '',
          documentoAdjunto: '',
        });
      } else {
        setError(data.message || 'Error al enviar la solicitud');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Formulario de Solicitud</CardTitle>
            <CardDescription>
              Complete los siguientes datos para iniciar su trámite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="titulo" className="text-sm font-medium">
                  Título del Trámite
                </label>
                <Input
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ingrese un título descriptivo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tipoTramite" className="text-sm font-medium">
                  Tipo de Trámite
                </label>
                <select
                  id="tipoTramite"
                  name="tipoTramite"
                  value={formData.tipoTramite}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  required
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="solicitud">Solicitud General</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="consulta">Consulta</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="descripcion" className="text-sm font-medium">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describa detalladamente su solicitud..."
                  className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="documentoAdjunto" className="text-sm font-medium">
                  Documento (Opcional)
                </label>
                <Input
                  id="documentoAdjunto"
                  name="documentoAdjunto"
                  value={formData.documentoAdjunto}
                  onChange={handleChange}
                  placeholder="Enlace al documento (opcional)"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-500">{success}</p>}

              <div className="flex gap-4 pt-4">
                <Button type="submit">
                  Enviar Solicitud
                </Button>
                <Button type="button" variant="outline-secondary" onClick={() => navigate('/dashboard')}>
                  Volver al Dashboard
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormSolicitud; 
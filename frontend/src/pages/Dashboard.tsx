import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Form, Badge, Spinner, Card, Modal, Row, Col, Pagination, InputGroup, Dropdown } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { FiFileText, FiCheckCircle, FiClipboard, FiUserCheck, FiLogOut, FiEye, FiDownload, FiX, FiMail, FiEdit2 } from 'react-icons/fi';
import { API_URL } from '../config';

interface Tramite {
  id: number;
  numeroExpediente: string;
  tipo: string;
  fecha: string;
  nombreCliente: string;
  email: string;
  telefonoMovil: string;
  cups: string;
  direccion: string;
  refCatastral: string;
  tension: string;
  potenciaNumerica: string;
  estado: string;
  formulario: string;
  dniPdf?: string;
  formatoAutorizacion?: string;
  plantillaRelacionPuntos?: string;
  // Campos específicos según el tipo
  aumentoPotencia?: boolean;
  vivienda?: string;
  variosSuministros?: boolean;
  acometidaCentralizada?: boolean;
}

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [filteredTramites, setFilteredTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTramite, setSelectedTramite] = useState<Tramite | null>(null);
  const [tramiteToDelete, setTramiteToDelete] = useState<Tramite | null>(null);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [tramiteToUpdate, setTramiteToUpdate] = useState<{id: number, estado: string} | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [updatingState, setUpdatingState] = useState(false);
  const [editingExpediente, setEditingExpediente] = useState<number | null>(null);
  const [numeroExpedienteInput, setNumeroExpedienteInput] = useState('');
  const [emailTemplateType, setEmailTemplateType] = useState<string>('');
  const [incidenciaMessage, setIncidenciaMessage] = useState<string>('');
  const [editingCups, setEditingCups] = useState<number | null>(null);
  const [cupsInput, setCupsInput] = useState('');
  const [searchExpediente, setSearchExpediente] = useState('');
  const [searchNombre, setSearchNombre] = useState('');
  const [searchCUPS, setSearchCUPS] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [filterEstado, setFilterEstado] = useState<string>('');
  const navigate = useNavigate();

  // Efecto para registrar información del trámite seleccionado
  useEffect(() => {
    if (selectedTramite) {
      console.log('Documentos del trámite seleccionado:', {
        id: selectedTramite.id,
        dniPdf: selectedTramite.dniPdf,
        formatoAutorizacion: selectedTramite.formatoAutorizacion,
        plantillaRelacionPuntos: selectedTramite.plantillaRelacionPuntos
      });
    }
  }, [selectedTramite]);

  useEffect(() => {
    // Verificar si hay un token (usuario autenticado)
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Obtener datos del usuario desde el backend
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
        } else {
          // Si hay error de autenticación, redirigir a login
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    // Obtener los trámites desde el backend
    const fetchTramites = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/tramites`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Trámites recibidos del backend:', data);
          setTramites(data);
        } else {
          setError('Error al cargar los trámites. Por favor, inténtelo de nuevo.');
        }
      } catch (error) {
        console.error('Error al obtener trámites:', error);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchTramites();
  }, [navigate]);

  // Efecto para aplicar filtros
  useEffect(() => {
    let results = tramites;
    
    // Filtrar por número de expediente
    if (searchExpediente) {
      results = results.filter(tramite => 
        tramite.numeroExpediente?.toLowerCase().includes(searchExpediente.toLowerCase())
      );
    }
    
    // Filtrar por nombre de cliente
    if (searchNombre) {
      results = results.filter(tramite => 
        tramite.nombreCliente?.toLowerCase().includes(searchNombre.toLowerCase())
      );
    }
    
    // Filtrar por CUPS
    if (searchCUPS) {
      results = results.filter(tramite => 
        tramite.cups?.toLowerCase().includes(searchCUPS.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (filterEstado) {
      results = results.filter(tramite => tramite.estado === filterEstado);
    }
    
    setFilteredTramites(results);
    setCurrentPage(1); // Regresar a la primera página después de aplicar filtros
  }, [tramites, searchExpediente, searchNombre, searchCUPS, filterEstado]);

  // Cálculo de páginas y elementos a mostrar
  const totalPages = Math.ceil(filteredTramites.length / itemsPerPage);
  
  const currentTramites = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredTramites.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredTramites, currentPage, itemsPerPage]);

  // Navegación por páginas
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const paginationItems = [];
  
  // Agregar primer y último botón
  paginationItems.push(
    <Pagination.First key="first" onClick={() => paginate(1)} disabled={currentPage === 1} />
  );
  paginationItems.push(
    <Pagination.Prev key="prev" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
  );
  
  // Determinar qué páginas mostrar (máximo 5 páginas visibles)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
        {i}
      </Pagination.Item>
    );
  }
  
  paginationItems.push(
    <Pagination.Next key="next" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} />
  );
  paginationItems.push(
    <Pagination.Last key="last" onClick={() => paginate(totalPages)} disabled={currentPage === totalPages || totalPages === 0} />
  );

  const resetFilters = () => {
    setSearchExpediente('');
    setSearchNombre('');
    setSearchCUPS('');
    setFilterEstado('');
    setAdvancedSearch(false);
  };

  // Función para obtener el color del Badge según el estado
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente de Enviar':
      case 'Pendiente de enviar':
        return 'warning';
      case 'En trámite Solicitud':
        return 'info';
      case 'Pendiente aceptar Carta de Condiciones':
        return 'primary';
      case 'Gestión de Pago':
        return 'secondary';
      case 'Gestión de pago trámite':
        return 'warning'; // Usando warning (naranja/amarillo) que es más visible
      case 'Solicitud de Incidencia':
        return 'danger';
      case 'Trámite de licencia/obras':
        return 'dark';
      case 'Finalizado':
        return 'success';
      case 'Anulado':
        return 'danger';
      default:
        return 'light';
    }
  };

  // Función para determinar si un badge debe tener estilo especial
  const getBadgeClass = (estado: string) => {
    if (estado === 'Gestión de pago trámite') {
      return 'text-dark'; // Texto oscuro para mayor contraste
    }
    return '';
  };

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    // Buscar el trámite para obtener su información
    const tramite = tramites.find(t => t.id === id);
    
    if (!tramite) return;
    
    // Si el estado es uno de los que requiere opción de correo, mostrar modal de confirmación
    if (nuevoEstado === 'Finalizado' || nuevoEstado === 'Solicitud de Incidencia' || nuevoEstado === 'Gestión de Pago') {
      setTramiteToUpdate({id, estado: nuevoEstado});
      setSendEmail(false); // Reiniciar la opción de enviar correo
      setIncidenciaMessage(''); // Reiniciar el mensaje de incidencia
      
      // Establecer el tipo de plantilla según el estado seleccionado
      if (nuevoEstado === 'Finalizado') {
        setEmailTemplateType('finalizado');
      } else if (nuevoEstado === 'Solicitud de Incidencia') {
        setEmailTemplateType('incidencia');
      } else if (nuevoEstado === 'Gestión de Pago') {
        setEmailTemplateType('pago');
      }
      
      setShowEstadoModal(true);
      return;
    }

    // Si no es un estado que requiera correo, proceder normalmente
    await updateTramiteEstado(id, nuevoEstado);
  };

  const handleNumeroExpedienteEdit = (id: number, numeroActual: string) => {
    setEditingExpediente(id);
    setNumeroExpedienteInput(numeroActual);
  };

  const handleNumeroExpedienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroExpedienteInput(e.target.value);
  };

  const handleNumeroExpedienteSubmit = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Obtener el trámite actual para incluir su estado
      const tramiteActual = tramites.find(t => t.id === id);
      if (!tramiteActual) {
        setError('No se encontró el trámite a actualizar.');
        return;
      }

      const response = await fetch(`${API_URL}/tramites/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          numeroExpediente: numeroExpedienteInput,
          estado: tramiteActual.estado // Incluir el estado actual
        })
      });

      if (response.ok) {
        // Actualizar el número de expediente en la interfaz
        setTramites(tramites.map(tramite => 
          tramite.id === id ? {...tramite, numeroExpediente: numeroExpedienteInput} : tramite
        ));
        setEditingExpediente(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el número de expediente. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al actualizar número de expediente:', error);
      setError('Error de conexión con el servidor');
    }
  };

  const updateTramiteEstado = async (id: number, nuevoEstado: string, enviarCorreo = false, mensajeIncidencia: string = '') => {
    setUpdatingState(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/tramites/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          estado: nuevoEstado,
          enviarCorreo,
          emailTemplateType,
          mensajeIncidencia
        })
      });

      if (response.ok) {
        // Actualizar el estado en la interfaz
        setTramites(tramites.map(tramite => 
          tramite.id === id ? {...tramite, estado: nuevoEstado} : tramite
        ));
        
        if (enviarCorreo) {
          // Mostrar mensaje de éxito para el envío de correo
          setError('');
          // Se podría agregar un estado adicional para mostrar un mensaje de éxito
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el estado. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setUpdatingState(false);
      setShowEstadoModal(false);
    }
  };

  const getMotivoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Modificación':
        return <FiClipboard className="me-2" />;
      case 'Individual':
        return <FiFileText className="me-2" />;
      case 'Alta':
        return <FiCheckCircle className="me-2" />;
      default:
        return <FiFileText className="me-2" />;
    }
  };

  const openTramiteDetails = (tramite: Tramite) => {
    setSelectedTramite(tramite);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTramite(null);
  };

  const handleViewPdf = (pdfName: string) => {
    if (!pdfName) {
      setError("No hay documento disponible para visualizar");
      return;
    }
    setShowModal(true);
    setSelectedTramite(tramites.find(t => t.dniPdf === pdfName) || null);
  };

  const handleDownloadPdf = (pdfName: string) => {
    if (!pdfName) {
      setError("No hay documento disponible para descargar");
      return;
    }
    // Abrir en una nueva pestaña para descargar
    window.open(`${API_URL}/documents/download/${pdfName}?token=${localStorage.getItem('token')}`, '_blank');
  };

  const handleDeleteTramite = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/tramites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Eliminar el trámite de la lista local
        setTramites(tramites.filter(tramite => tramite.id !== id));
        setShowDeleteModal(false);
        setTramiteToDelete(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al eliminar el trámite. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al eliminar trámite:', error);
      setError('Error de conexión con el servidor');
    }
  };

  const confirmDelete = (tramite: Tramite) => {
    setTramiteToDelete(tramite);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setTramiteToDelete(null);
  };

  const handleCupsEdit = (id: number, cupsActual: string) => {
    setEditingCups(id);
    setCupsInput(cupsActual);
  };

  const handleCupsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCupsInput(e.target.value);
  };

  const handleCupsSubmit = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const tramiteActual = tramites.find(t => t.id === id);
      if (!tramiteActual) {
        setError('No se encontró el trámite a actualizar.');
        return;
      }
      const response = await fetch(`${API_URL}/tramites/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          cups: cupsInput,
          estado: tramiteActual.estado // Mantener el estado actual
        })
      });
      if (response.ok) {
        setTramites(tramites.map(tramite => 
          tramite.id === id ? {...tramite, cups: cupsInput} : tramite
        ));
        setEditingCups(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el CUPS. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error al actualizar CUPS:', error);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="fade-in-animation">
      <div className="dashboard-header">
        <Container fluid className="px-4">
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="mb-0 d-flex align-items-center">
                <FiFileText size={28} className="me-2" />
                Sistema de Trámites
              </h2>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-md-end align-items-center gap-3">
                <div className="d-flex align-items-center">
                  <FiUserCheck size={20} className="me-2" />
                  <span>Bienvenido, <strong>{userName}</strong></span>
                </div>
                <Button 
                  variant="light" 
                  size="sm"
                  className="d-flex align-items-center" 
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  <FiLogOut className="me-2" /> Cerrar Sesión
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="py-4 px-4">
        <Row className="mb-4">
          <Col md={8} className="d-flex align-items-center">
            <Form className="w-100 me-2">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar por N° Expediente..."
                  value={searchExpediente}
                  onChange={e => setSearchExpediente(e.target.value)}
                  aria-label="Buscar expediente"
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setAdvancedSearch(!advancedSearch)}
                  title="Búsqueda avanzada"
                >
                  {advancedSearch ? "Búsqueda simple" : "Búsqueda avanzada"}
                </Button>
                {(searchExpediente || searchNombre || searchCUPS || filterEstado) && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetFilters}
                    title="Limpiar filtros"
                  >
                    <FiX size={18} />
                  </Button>
                )}
              </InputGroup>
            </Form>
          </Col>
          <Col md={4} className="d-flex justify-content-end align-items-center">
            <Button 
              variant="primary" 
              onClick={() => navigate('/formulario')}
              className="d-flex align-items-center"
            >
              <FiFileText className="me-2" /> Solicitud Expediente
            </Button>
          </Col>
        </Row>

        {advancedSearch && (
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nombre del cliente</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchNombre}
                  onChange={e => setSearchNombre(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>CUPS</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por CUPS..."
                  value={searchCUPS}
                  onChange={e => setSearchCUPS(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="Pendiente de enviar">Pendiente de enviar</option>
                  <option value="En trámite Solicitud">En trámite Solicitud</option>
                  <option value="Pendiente aceptar Carta de Condiciones">Pendiente aceptar Carta de Condiciones</option>
                  <option value="Gestión de Pago">Gestión de Pago</option>
                  <option value="Gestión de pago trámite">Gestión de pago trámite</option>
                  <option value="Solicitud de Incidencia">Solicitud de Incidencia</option>
                  <option value="Trámite de licencia/obras">Trámite de licencia/obras</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Anulado">Anulado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        )}

        {error && (
          <Row className="mb-4">
            <Col>
              <div className="alert alert-danger">{error}</div>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Trámites Registrados</h5>
                <div className="d-flex align-items-center">
                  <span className="me-3">
                    <Badge bg="primary" pill>
                      {filteredTramites.length} {filteredTramites.length === 1 ? 'registro' : 'registros'}
                    </Badge>
                  </span>
                  <Form.Select 
                    size="sm"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{ width: 'auto' }}
                  >
                    <option value="10">10 por página</option>
                    <option value="20">20 por página</option>
                    <option value="50">50 por página</option>
                    <option value="100">100 por página</option>
                  </Form.Select>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="mt-3 text-muted">Cargando trámites...</p>
                  </div>
                ) : filteredTramites.length === 0 ? (
                  <div className="alert alert-info m-3">
                    <p className="mb-0">No hay trámites que coincidan con los criterios de búsqueda. {searchExpediente || searchNombre || searchCUPS || filterEstado ? <Button variant="link" onClick={resetFilters} className="p-0">Limpiar filtros</Button> : 'Use el botón "Solicitud Expediente" para crear uno nuevo.'}</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table striped hover className="mb-0">
                      <thead>
                        <tr>
                          <th>N° Expediente</th>
                          <th>Motivo</th>
                          <th>Fecha de apertura</th>
                          <th>Tipo</th>
                          <th>CUPS</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTramites.map((tramite) => (
                          <tr 
                            key={tramite.id}
                            onClick={() => openTramiteDetails(tramite)}
                            style={{ cursor: 'pointer' }}
                            className="hover-effect"
                          >
                            <td onClick={(e) => e.stopPropagation()}>
                              {editingExpediente === tramite.id ? (
                                <div className="d-flex">
                                  <Form.Control
                                    size="sm"
                                    type="text"
                                    value={numeroExpedienteInput}
                                    onChange={handleNumeroExpedienteChange}
                                    className="me-2"
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="primary"
                                    onClick={() => handleNumeroExpedienteSubmit(tramite.id)}
                                  >
                                    Guardar
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="d-flex align-items-center"
                                  onClick={() => handleNumeroExpedienteEdit(tramite.id, tramite.numeroExpediente || '')}
                                >
                                  <span className={!tramite.numeroExpediente ? 'text-muted fst-italic' : ''}>
                                    {tramite.numeroExpediente || 'Sin asignar - Click para editar'}
                                  </span>
                                  <FiEdit2 size={14} className="ms-2" style={{ opacity: 0.7 }} />
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {getMotivoIcon(tramite.tipo)}
                                {tramite.tipo}
                              </div>
                            </td>
                            <td>{tramite.fecha}</td>
                            <td>{tramite.formulario || "-"}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                              {editingCups === tramite.id ? (
                                <div className="d-flex">
                                  <Form.Control
                                    size="sm"
                                    type="text"
                                    value={cupsInput}
                                    onChange={handleCupsChange}
                                    className="me-2"
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="primary"
                                    onClick={() => handleCupsSubmit(tramite.id)}
                                  >
                                    Guardar
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="d-flex align-items-center"
                                  onClick={() => handleCupsEdit(tramite.id, tramite.cups || '')}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <span className={!tramite.cups ? 'text-muted fst-italic' : ''}>
                                    {tramite.cups || 'Sin asignar - Click para editar'}
                                  </span>
                                  <FiEdit2 size={14} className="ms-2" style={{ opacity: 0.7 }} />
                                </div>
                              )}
                            </td>
                            <td>
                              <Badge 
                                bg={getEstadoBadgeColor(tramite.estado)}
                                className={`px-3 py-2 ${getBadgeClass(tramite.estado)}`}
                              >
                                {tramite.estado}
                              </Badge>
                            </td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <div className="d-flex align-items-center gap-2">
                                <Form.Select 
                                  size="sm" 
                                  value={tramite.estado}
                                  onChange={(e) => handleEstadoChange(tramite.id, e.target.value)}
                                  className="form-select-sm w-auto me-2"
                                >
                                  <option value="Pendiente de enviar">Pendiente de enviar</option>
                                  <option value="En trámite Solicitud">En trámite Solicitud</option>
                                  <option value="Pendiente aceptar Carta de Condiciones">Pendiente aceptar Carta de Condiciones</option>
                                  <option value="Gestión de Pago">Gestión de Pago</option>
                                  <option value="Gestión de pago trámite">Gestión de pago trámite</option>
                                  <option value="Solicitud de Incidencia">Solicitud de Incidencia</option>
                                  <option value="Trámite de licencia/obras">Trámite de licencia/obras</option>
                                  <option value="Finalizado">Finalizado</option>
                                  <option value="Anulado">Anulado</option>
                                </Form.Select>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  className="d-flex align-items-center justify-content-center"
                                  onClick={() => confirmDelete(tramite)}
                                  style={{ width: '32px', height: '32px', padding: '0' }}
                                >
                                  <FiX size={18} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
                {filteredTramites.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <div>
                      Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredTramites.length)} de {filteredTramites.length} trámites
                    </div>
                    <Pagination className="mb-0">
                      {paginationItems}
                    </Pagination>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal para ver detalles del trámite */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg" 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTramite && (
              <div className="d-flex align-items-center">
                {getMotivoIcon(selectedTramite.tipo)}
                Expediente{' '}
                {selectedTramite.numeroExpediente 
                  ? `N° ${selectedTramite.numeroExpediente}` 
                  : `ID: ${selectedTramite.id}`} - {selectedTramite.tipo}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTramite && (
            <div>
              <div className="mb-4">
                <Badge 
                  bg={getEstadoBadgeColor(selectedTramite.estado)}
                  className={`px-3 py-2 ${getBadgeClass(selectedTramite.estado)}`}
                >
                  {selectedTramite.estado}
                </Badge>
                <h5 className="mb-3">Información General</h5>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>N° Expediente:</strong>{' '}
                      {editingExpediente === selectedTramite.id ? (
                        <span className="d-inline-flex align-items-center">
                          <Form.Control
                            size="sm"
                            type="text"
                            value={numeroExpedienteInput}
                            onChange={handleNumeroExpedienteChange}
                            className="me-2"
                            style={{ width: '150px' }}
                          />
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => handleNumeroExpedienteSubmit(selectedTramite.id)}
                          >
                            Guardar
                          </Button>
                        </span>
                      ) : (
                        <span 
                          className="d-inline-flex align-items-center"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleNumeroExpedienteEdit(selectedTramite.id, selectedTramite.numeroExpediente || '')}
                        >
                          <span className={!selectedTramite.numeroExpediente ? 'text-muted fst-italic' : ''}>
                            {selectedTramite.numeroExpediente || 'Sin asignar'}
                          </span>
                          <FiEdit2 size={14} className="ms-2" style={{ opacity: 0.7 }} />
                        </span>
                      )}
                    </p>
                    <p><strong>Tipo:</strong> {selectedTramite.formulario || "-"}</p>
                    <p><strong>Cliente:</strong> {selectedTramite.nombreCliente}</p>
                    <p><strong>Email:</strong> {selectedTramite.email}</p>
                    <p><strong>Teléfono:</strong> {selectedTramite.telefonoMovil}</p>
                    <p><strong>CUPS:</strong> {selectedTramite.cups}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Dirección:</strong> {selectedTramite.direccion}</p>
                    <p><strong>Ref. Catastral:</strong> {selectedTramite.refCatastral}</p>
                    <p><strong>Tensión:</strong> {selectedTramite.tension || '-'}</p>
                    <p><strong>Potencia:</strong> {selectedTramite.potenciaNumerica} kW</p>
                    <p><strong>Fecha:</strong> {selectedTramite.fecha}</p>
                  </Col>
                </Row>
              </div>

              {/* Información específica según motivo de trámite */}
              {selectedTramite.tipo === 'Modificación' && (
                <div className="mb-4">
                  <h5 className="mb-3">Detalles de Modificación</h5>
                  <p><strong>Aumento de Potencia:</strong> {selectedTramite.aumentoPotencia ? 'Sí' : 'No'}</p>
                </div>
              )}

              {selectedTramite.tipo === 'Individual' && (
                <div className="mb-4">
                  <h5 className="mb-3">Detalles de Solicitud Individual</h5>
                  <p><strong>Vivienda:</strong> {selectedTramite.vivienda}</p>
                </div>
              )}

              {selectedTramite.tipo === 'Alta' && (
                <div className="mb-4">
                  <h5 className="mb-3">Detalles de Alta</h5>
                  <p><strong>Varios Suministros:</strong> {selectedTramite.variosSuministros ? 'Sí' : 'No'}</p>
                  <p><strong>Acometida Centralizada:</strong> {selectedTramite.acometidaCentralizada ? 'Sí' : 'No'}</p>
                </div>
              )}

              {/* Documentos */}
              <div>
                <h5 className="mb-3">Documentos</h5>
                <div className="d-flex flex-column gap-2">
                  
                  {selectedTramite.dniPdf && (
                    <Card className="bg-light">
                      <Card.Body className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center">
                          <FiFileText className="me-2" />
                          <span>DNI</span>
                        </div>
                        <div>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleViewPdf(selectedTramite.dniPdf!)}
                          >
                            <FiEye className="me-1" /> Ver
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleDownloadPdf(selectedTramite.dniPdf!)}
                          >
                            <FiDownload className="me-1" /> Descargar
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {selectedTramite.formatoAutorizacion && (
                    <Card className="bg-light">
                      <Card.Body className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center">
                          <FiFileText className="me-2" />
                          <span>Formato de Autorización</span>
                        </div>
                        <div>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleViewPdf(selectedTramite.formatoAutorizacion!)}
                          >
                            <FiEye className="me-1" /> Ver
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleDownloadPdf(selectedTramite.formatoAutorizacion!)}
                          >
                            <FiDownload className="me-1" /> Descargar
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {selectedTramite.plantillaRelacionPuntos && (
                    <Card className="bg-light">
                      <Card.Body className="d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center">
                          <FiFileText className="me-2" />
                          <span>Plantilla Relación Puntos</span>
                        </div>
                        <div>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleViewPdf(selectedTramite.plantillaRelacionPuntos!)}
                          >
                            <FiEye className="me-1" /> Ver
                          </Button>
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleDownloadPdf(selectedTramite.plantillaRelacionPuntos!)}
                          >
                            <FiDownload className="me-1" /> Descargar
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  )}

                  {!selectedTramite.dniPdf && !selectedTramite.formatoAutorizacion && !selectedTramite.plantillaRelacionPuntos && (
                    <p className="text-muted">No hay documentos disponibles para este trámite.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tramiteToDelete && (
            <p>
              ¿Está seguro que desea eliminar el expediente{' '}
              {tramiteToDelete.numeroExpediente 
                ? `N° ${tramiteToDelete.numeroExpediente}` 
                : `ID: ${tramiteToDelete.id}`} - {tramiteToDelete.tipo}?
              <br />
              <strong>Esta acción no se puede deshacer.</strong>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={() => tramiteToDelete && handleDeleteTramite(tramiteToDelete.id)}
          >
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar cambio de estado y envío de correo */}
      <Modal show={showEstadoModal} onHide={() => setShowEstadoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {tramiteToUpdate && (
              <>
                {tramiteToUpdate.estado === 'Finalizado' && 'Confirmar finalización de trámite'}
                {tramiteToUpdate.estado === 'Solicitud de Incidencia' && 'Confirmar solicitud de incidencia'}
                {tramiteToUpdate.estado === 'Gestión de Pago' && 'Confirmar gestión de pago'}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tramiteToUpdate && (
            <>
              <p>
                {tramiteToUpdate.estado === 'Finalizado' && (
                  <>¿Está seguro que desea cambiar el estado del trámite a <strong>Finalizado</strong>?</>
                )}
                {tramiteToUpdate.estado === 'Solicitud de Incidencia' && (
                  <>¿Está seguro que desea registrar una <strong>Solicitud de Incidencia</strong> para este trámite?</>
                )}
                {tramiteToUpdate.estado === 'Gestión de Pago' && (
                  <>¿Está seguro que desea cambiar el estado del trámite a <strong>Gestión de Pago</strong>?</>
                )}
              </p>
              
              <Form.Check 
                type="checkbox" 
                id="send-email-checkbox"
                label={
                  tramiteToUpdate.estado === 'Finalizado' 
                    ? "Enviar notificación de finalización al cliente" 
                    : tramiteToUpdate.estado === 'Solicitud de Incidencia'
                      ? "Enviar solicitud de documentación para la incidencia"
                      : "Enviar solicitud de justificante de pago"
                }
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mt-3"
              />
              
              {sendEmail && (
                <div className="mt-3 p-3 bg-light border rounded">
                  <div className="d-flex align-items-center mb-2">
                    <FiMail className="me-2" />
                    <strong>Se enviará un correo electrónico a:</strong>
                  </div>
                  <p className="mb-1">
                    {tramites.find(t => t.id === tramiteToUpdate.id)?.email || 'Correo no disponible'}
                  </p>
                  
                  {tramiteToUpdate.estado === 'Finalizado' && (
                    <small className="text-muted">
                      El cliente será notificado que su trámite ha sido finalizado.
                    </small>
                  )}
                  
                  {tramiteToUpdate.estado === 'Solicitud de Incidencia' && (
                    <>
                      <small className="text-muted mb-2 d-block">
                        El cliente será notificado que se requiere información adicional para resolver la incidencia.
                      </small>
                      <Form.Group className="mt-3">
                        <Form.Label><strong>Detalles de la incidencia:</strong></Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          value={incidenciaMessage}
                          onChange={(e) => setIncidenciaMessage(e.target.value)}
                          placeholder="Indique los detalles o documentación requerida para resolver la incidencia..."
                        />
                      </Form.Group>
                    </>
                  )}
                  
                  {tramiteToUpdate.estado === 'Gestión de Pago' && (
                    <small className="text-muted">
                      El cliente será notificado que debe enviar el justificante de pago para continuar con el trámite.
                    </small>
                  )}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowEstadoModal(false)}
            disabled={updatingState}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              if (tramiteToUpdate) {
                updateTramiteEstado(
                  tramiteToUpdate.id, 
                  tramiteToUpdate.estado, 
                  sendEmail,
                  tramiteToUpdate.estado === 'Solicitud de Incidencia' ? incidenciaMessage : ''
                );
              }
            }}
            disabled={updatingState || (sendEmail && tramiteToUpdate?.estado === 'Solicitud de Incidencia' && !incidenciaMessage)}
          >
            {updatingState ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Actualizando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard; 
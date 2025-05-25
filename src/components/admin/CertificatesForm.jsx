import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col, Collapse, Badge } from 'react-bootstrap';
import { 
  FaCertificate, 
  FaAward, 
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaLink, 
  FaCalendarAlt, 
  FaBuilding, 
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { setData, getData } from '../../api';

const CertificatesForm = () => {
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCards, setOpenCards] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('certifications');
        setCertificates(data || []);
        
        // Initialize all cards as open
        const initialOpenState = (data || []).reduce((acc, _, index) => {
          acc[index] = true;
          return acc;
        }, {});
        setOpenCards(initialOpenState);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching certificates data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await setData(certificates, 'certifications');
      setStatus({
        show: true,
        message: 'Certificates saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving certificates data:', error);
      setStatus({
        show: true,
        message: 'Failed to save data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle card collapsed/expanded state - only one card open at a time
  const toggleCard = (index) => {
    setOpenCards(prev => {
      const isCurrentlyOpen = prev[index];
      // Close all cards first
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      // If the clicked card was closed, open it
      if (!isCurrentlyOpen) {
        newState[index] = true;
      }
      return newState;
    });
  };

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      {
        title: '',
        issuer: '',
        url: ''
      }
    ]);
  };

  const removeCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const updateCertificate = (index, field, value) => {
    const updatedCertificates = [...certificates];
    updatedCertificates[index][field] = value;
    setCertificates(updatedCertificates);
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="mb-4">
          <span className="spinner-border spinner-border-lg text-primary" role="status" aria-hidden="true"></span>
        </div>
        <h5 className="text-muted">Loading Certificates...</h5>
        <p className="text-muted mb-0">Please wait while we fetch your data</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger" className="text-center p-4">
        <div className="mb-3">
          <FaExclamationTriangle style={{fontSize: '2rem'}} />
        </div>
        <h5>Oops! Something went wrong</h5>
        <p className="mb-3">{error}</p>
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          <FaRedo className="me-2" />
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="certificates-form animate-fade-in">
      {status.show && (
        <Alert 
          variant={status.type}
          onClose={() => setStatus({ ...status, show: false })} 
          dismissible
          className="d-flex align-items-center"
        >
          {status.type === 'success' ? (
            <FaCheckCircle className="me-2" />
          ) : (
            <FaExclamationTriangle className="me-2" />
          )}
          <div>{status.message}</div>
        </Alert>
      )}

      <div className="section-header mb-4">
        <h4 className="mb-3"><FaCertificate className="me-2" /> Certificates & Credentials</h4>
        <p className="text-muted">Manage your professional certifications and credentials</p>
      </div>

      {certificates.length === 0 && !isLoading && (
        <div className="text-center p-4 mb-4 empty-state-container">
          <FaCertificate style={{ fontSize: '2.5rem' }} className="text-muted mb-3" />
          <h5>No Certificates Added Yet</h5>
          <p className="mb-3 text-muted">Add your professional certifications to showcase your expertise.</p>
          <Button 
            variant="primary" 
            onClick={addCertificate}
            className="animated-button"
          >
            <FaPlus className="me-2" /> Add First Certificate
          </Button>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {certificates.map((cert, certIndex) => (
          <Card key={certIndex} className="mb-4 form-card hover-effect">
            <Card.Header 
              className="d-flex align-items-center"
              onClick={() => toggleCard(certIndex)}
              style={{ cursor: 'pointer' }}
            >
              <FaAward className="me-2" />
              <span>{cert.title || `Certificate #${certIndex + 1}`}</span>
              <div className="ms-auto d-flex align-items-center">
                {cert.issuer && (
                  <Badge bg="light" text="dark" className="me-2">
                    {cert.issuer}
                  </Badge>
                )}
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="me-2 btn-icon-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card toggle when clicking remove button
                    removeCertificate(certIndex);
                  }}
                  aria-label="Remove certificate"
                >
                  <FaTrash /> <span className="d-none d-md-inline">Remove</span>
                </Button>
                {openCards[certIndex] ? (
                  <FaChevronUp className="text-secondary" />
                ) : (
                  <FaChevronDown className="text-secondary" />
                )}
              </div>
            </Card.Header>
            <Collapse in={openCards[certIndex]}>
              <div>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaFileAlt className="me-1" /> Certificate Title</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={cert.title} 
                          onChange={(e) => updateCertificate(certIndex, 'title', e.target.value)}
                          placeholder="e.g. AWS Certified Solutions Architect" 
                          className="form-control-modern"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaBuilding className="me-1" /> Issuing Organization</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={cert.issuer} 
                          onChange={(e) => updateCertificate(certIndex, 'issuer', e.target.value)} 
                          placeholder="e.g. Amazon Web Services (AWS)"
                          className="form-control-modern"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label><FaLink className="me-1" /> Certificate URL</Form.Label>
                    <Form.Control 
                      type="url" 
                      value={cert.url} 
                      onChange={(e) => updateCertificate(certIndex, 'url', e.target.value)}
                      placeholder="https://credential.example.com/verify/12345" 
                      className="form-control-modern"
                      required
                    />
                    <Form.Text className="text-muted">
                      <FaInfoCircle className="me-1" />
                      Link to the certificate or credential verification page
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        ))}

        {certificates.length > 0 && (
          <Button
            variant="outline-success"
            className="add-item-button animated-button"
            onClick={addCertificate}
            type="button"
          >
            <FaPlus className="me-2" /> Add New Certificate
          </Button>
        )}

        <div className="d-flex justify-content-end mt-4">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2"
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CertificatesForm;

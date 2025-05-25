import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
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
  FaInfoCircle
} from 'react-icons/fa';
import { setData, getData } from '../../api';

const CertificatesForm = () => {
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('certifications');
        setCertificates(data || []);
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
    <div className="fade-in">
      {status.show && (
        <Alert 
          variant={status.type}
          onClose={() => setStatus({ ...status, show: false })} 
          dismissible
          className="slide-in"
        >
          <div className="d-flex align-items-center">
            {status.type === 'success' ? <FaCheckCircle className="me-2" /> : <FaExclamationTriangle className="me-2" />}
            {status.message}
          </div>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-4">
              <FaCertificate className="me-3 text-primary" style={{fontSize: '1.5rem'}} />
              <div>
                <Card.Title className="mb-1">Certificates & Credentials</Card.Title>
                <Card.Subtitle className="mb-0">
                  Manage your professional certifications and credentials
                </Card.Subtitle>
              </div>
            </div>
            
            {certificates.length > 0 ? (
              certificates.map((cert, certIndex) => (
                <div key={certIndex} className="nested-form">
                  <div className="d-flex align-items-center mb-3">
                    <FaAward className="me-2 text-primary" />
                    <h5 className="mb-0">{cert.title || `Certificate #${certIndex + 1}`}</h5>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="ms-auto btn-icon-sm"
                      onClick={() => removeCertificate(certIndex)}
                      aria-label="Remove certificate"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaFileAlt className="me-2" />
                          Certificate Title
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          value={cert.title} 
                          onChange={(e) => updateCertificate(certIndex, 'title', e.target.value)}
                          placeholder="e.g. AWS Certified Solutions Architect" 
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <FaBuilding className="me-2" />
                          Issuing Organization
                        </Form.Label>
                        <Form.Control 
                          type="text" 
                          value={cert.issuer} 
                          onChange={(e) => updateCertificate(certIndex, 'issuer', e.target.value)} 
                          placeholder="e.g. Amazon Web Services (AWS)"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-0">
                    <Form.Label className="d-flex align-items-center">
                      <FaLink className="me-2" />
                      Certificate URL
                    </Form.Label>
                    <Form.Control 
                      type="url" 
                      value={cert.url} 
                      onChange={(e) => updateCertificate(certIndex, 'url', e.target.value)}
                      placeholder="https://credential.example.com/verify/12345" 
                      required
                    />
                    <Form.Text className="text-muted">
                      <FaInfoCircle className="me-1" />
                      Link to the certificate or credential verification page
                    </Form.Text>
                  </Form.Group>
                </div>
              ))
            ) : (
              <div className="text-center p-4 mb-4 bg-light rounded-3">
                <FaCertificate style={{ fontSize: '2.5rem' }} className="text-muted mb-3" />
                <h5>No certificates added yet</h5>
                <p className="text-muted">Add your professional certifications to showcase your expertise</p>
              </div>
            )}
            
            <Button 
              variant="outline-primary" 
              className="add-item-button w-100" 
              onClick={addCertificate}
              type="button"
            >
              <FaPlus className="me-2" />
              Add New Certificate
            </Button>
            
          </Card.Body>
        </Card>

        <div className="action-buttons">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting || certificates.length === 0}
            className="d-flex align-items-center"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CertificatesForm;

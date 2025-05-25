import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaGripVertical } from 'react-icons/fa';
import { setData, getData } from '../../api';
import DraggableList from '../common/DraggableList';

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

  const handleReorder = (newOrder) => {
    setCertificates(newOrder);
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-3">
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      {status.show && (
        <Alert 
          variant={status.type}
          onClose={() => setStatus({ ...status, show: false })} 
          dismissible
        >
          {status.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <small className="text-muted">Drag certificates to reorder them</small>
        </div>
        
        <DraggableList
          items={certificates}
          onReorder={handleReorder}
          renderItem={(cert, certIndex) => (
            <Card className="mb-4">
              <Card.Header className="d-flex align-items-center">
                <FaGripVertical className="me-2" style={{ cursor: 'grab' }} />
                <span>{cert.title || `Certificate #${certIndex + 1}`}</span>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="ms-auto"
                  onClick={() => removeCertificate(certIndex)}
                >
                  Remove
                </Button>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={cert.title} 
                    onChange={(e) => updateCertificate(certIndex, 'title', e.target.value)} 
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Issuer</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={cert.issuer} 
                    onChange={(e) => updateCertificate(certIndex, 'issuer', e.target.value)} 
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    value={cert.url} 
                    onChange={(e) => updateCertificate(certIndex, 'url', e.target.value)} 
                    required
                  />
                  <Form.Text className="text-muted">
                    Link to the certificate or credential verification page
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          )}
        />

        <Button 
          variant="outline-success" 
          className="add-item-button" 
          onClick={addCertificate}
          type="button"
        >
          Add Certificate
        </Button>

        <div className="d-flex justify-content-end">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CertificatesForm;

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { setData, getData } from '../../api';

const AboutForm = () => {
  const [paragraphs, setParagraphs] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('about');
        setParagraphs(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching about data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (index, value) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => {
    setParagraphs([...paragraphs, '']);
  };

  const removeParagraph = (index) => {
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await setData(paragraphs, 'about');
      setStatus({
        show: true,
        message: 'About information saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving about data:', error);
      setStatus({
        show: true,
        message: 'Failed to save data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>About Information</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">Edit paragraphs that describe you</Card.Subtitle>
            
            {paragraphs.map((paragraph, index) => (
              <div key={index} className="mb-3 position-relative">
                <Form.Group>
                  <Form.Label>Paragraph {index + 1}</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={paragraph}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="ms-2"
                      onClick={() => removeParagraph(index)}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      Remove
                    </Button>
                  </div>
                </Form.Group>
              </div>
            ))}
            
            <Button 
              variant="outline-primary" 
              className="mt-3" 
              onClick={addParagraph}
              type="button"
            >
              Add Paragraph
            </Button>
          </Card.Body>
        </Card>

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

export default AboutForm;

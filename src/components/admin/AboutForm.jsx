import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { 
  FaUserEdit, 
  FaParagraph, 
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaRedo
} from 'react-icons/fa';
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
      <div className="text-center p-5">
        <div className="mb-4">
          <span className="spinner-border spinner-border-lg text-primary" role="status" aria-hidden="true"></span>
        </div>
        <h5 className="text-muted">Loading About Information...</h5>
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
            <div className="d-flex align-items-center mb-3">
              <FaUserEdit className="me-3 text-primary" style={{fontSize: '1.5rem'}} />
              <div>
                <Card.Title className="mb-1">About Information</Card.Title>
                <Card.Subtitle className="mb-0">
                  Edit paragraphs that describe you professionally
                </Card.Subtitle>
              </div>
            </div>
            
            {paragraphs.map((paragraph, index) => (
              <div key={index} className="nested-form">
                <Form.Group>
                  <Form.Label className="d-flex align-items-center">
                    <FaParagraph className="me-2" />
                    Paragraph {index + 1}
                  </Form.Label>
                  <div className="d-flex flex-column flex-md-row">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={paragraph}
                      onChange={(e) => handleChange(index, e.target.value)}
                      placeholder="Write about your experience, skills, or professional journey..."
                      className="flex-grow-1"
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="ms-2 mt-md-0 mt-2 btn-icon-sm"
                      onClick={() => removeParagraph(index)}
                      aria-label="Remove paragraph"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      {paragraph.length} characters
                    </small>
                  </div>
                </Form.Group>
              </div>
            ))}
            
            <Button 
              variant="outline-primary" 
              className="add-item-button w-100" 
              onClick={addParagraph}
              type="button"
            >
              <FaPlus className="me-2" />
              Add New Paragraph
            </Button>
          </Card.Body>
        </Card>

        <div className="action-buttons">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting || paragraphs.length === 0}
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

export default AboutForm;

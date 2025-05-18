import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaGripVertical } from 'react-icons/fa';
import { setData, getData } from '../../api';

const ExperiencesForm = () => {
  const [experiences, setExperiences] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('experiences');
        setExperiences(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching experiences data:", err);
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
      await setData(experiences, 'experiences');
      setStatus({
        show: true,
        message: 'Experiences saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving experiences data:', error);
      setStatus({
        show: true,
        message: 'Failed to save data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: '',
        location: '',
        type: '',
        positions: [
          {
            title: '',
            period: '',
            responsibilities: ['']
          }
        ]
      }
    ]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };

  const addPosition = (experienceIndex) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].positions.push({
      title: '',
      period: '',
      responsibilities: ['']
    });
    setExperiences(updatedExperiences);
  };

  const removePosition = (experienceIndex, positionIndex) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].positions = 
      updatedExperiences[experienceIndex].positions.filter(
        (_, i) => i !== positionIndex
      );
    setExperiences(updatedExperiences);
  };

  const updatePosition = (experienceIndex, positionIndex, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].positions[positionIndex][field] = value;
    setExperiences(updatedExperiences);
  };

  const addResponsibility = (experienceIndex, positionIndex) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].positions[positionIndex].responsibilities.push('');
    setExperiences(updatedExperiences);
  };

  const removeResponsibility = (experienceIndex, positionIndex, respIndex) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].positions[positionIndex].responsibilities =
      updatedExperiences[experienceIndex].positions[positionIndex].responsibilities.filter(
        (_, i) => i !== respIndex
      );
    setExperiences(updatedExperiences);
  };

  const updateResponsibility = (experienceIndex, positionIndex, respIndex, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].positions[positionIndex].responsibilities[respIndex] = value;
    setExperiences(updatedExperiences);
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
        {experiences.map((experience, expIndex) => (
          <Card key={expIndex} className="mb-4">
            <Card.Header className="d-flex align-items-center">
              <FaGripVertical className="me-2 drag-handle" />
              <span>Experience #{expIndex + 1}</span>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-auto"
                onClick={() => removeExperience(expIndex)}
              >
                Remove Experience
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={experience.company} 
                      onChange={(e) => updateExperience(expIndex, 'company', e.target.value)} 
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={experience.location} 
                      onChange={(e) => updateExperience(expIndex, 'location', e.target.value)} 
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={experience.type} 
                      onChange={(e) => updateExperience(expIndex, 'type', e.target.value)} 
                      placeholder="Full-time, Part-time, Internship, etc."
                    />
                  </Form.Group>
                </Col>
              </Row>

              <hr />
              <h5>Positions</h5>

              {experience.positions.map((position, posIndex) => (
                <div key={posIndex} className="nested-form">
                  <h6>Position #{posIndex + 1}</h6>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="remove-button"
                    onClick={() => removePosition(expIndex, posIndex)}
                  >
                    Remove
                  </Button>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={position.title} 
                          onChange={(e) => updatePosition(expIndex, posIndex, 'title', e.target.value)} 
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Period (e.g. "May 2023 - Present")</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={position.period} 
                          onChange={(e) => updatePosition(expIndex, posIndex, 'period', e.target.value)} 
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Responsibilities</Form.Label>
                    {position.responsibilities.map((resp, respIndex) => (
                      <div key={respIndex} className="d-flex mb-2">
                        <Form.Control 
                          type="text" 
                          value={resp}
                          onChange={(e) => updateResponsibility(expIndex, posIndex, respIndex, e.target.value)}
                          required
                        />
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="ms-2"
                          onClick={() => removeResponsibility(expIndex, posIndex, respIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => addResponsibility(expIndex, posIndex)}
                      type="button"
                    >
                      Add Responsibility
                    </Button>
                  </Form.Group>
                </div>
              ))}

              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => addPosition(expIndex)}
                type="button"
                className="mt-2"
              >
                Add Position
              </Button>
            </Card.Body>
          </Card>
        ))}

        <Button 
          variant="outline-success" 
          className="add-item-button" 
          onClick={addExperience}
          type="button"
        >
          Add New Experience
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

export default ExperiencesForm;

import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner, Row, Col, Collapse, Badge } from 'react-bootstrap';
import { 
  FaGraduationCap, 
  FaUniversity, 
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaBookReader,
  FaCalendarAlt, 
  FaTools,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { setData, getData } from '../../api';
import PeriodPicker from '../common/PeriodPicker';

const EducationForm = () => {
  const [education, setEducation] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCards, setOpenCards] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('education');
        setEducation(data || []);
        
        // Initialize all cards as open
        const initialOpenState = (data || []).reduce((acc, _, index) => {
          acc[index] = true;
          return acc;
        }, {});
        setOpenCards(initialOpenState);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching education data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await setData(education, 'education');
      setStatus({
        show: true,
        message: 'Education information saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving education data:', error);
      setStatus({
        show: true,
        message: 'Failed to save data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEducationItem = () => {
    setEducation([
      ...education,
      {
        institution: '',
        degree: '',
        period: '',
        skills: ['']
      }
    ]);
  };

  const removeEducationItem = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const addSkill = (educationIndex) => {
    const updatedEducation = [...education];
    updatedEducation[educationIndex].skills.push('');
    setEducation(updatedEducation);
  };

  const removeSkill = (educationIndex, skillIndex) => {
    const updatedEducation = [...education];
    updatedEducation[educationIndex].skills = 
      updatedEducation[educationIndex].skills.filter((_, i) => i !== skillIndex);
    setEducation(updatedEducation);
  };

  const updateSkill = (educationIndex, skillIndex, value) => {
    const updatedEducation = [...education];
    updatedEducation[educationIndex].skills[skillIndex] = value;
    setEducation(updatedEducation);
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="mb-4">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
        <h5 className="text-muted">Loading Education Information...</h5>
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
    <div className="education-form animate-fade-in">
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
        <h4 className="mb-3"><FaGraduationCap className="me-2" /> Education</h4>
        <p className="text-muted">Manage your educational history and academic qualifications</p>
      </div>

      {education.length === 0 && !isLoading && (
        <div className="text-center p-4 mb-4 empty-state-container">
          <FaGraduationCap style={{ fontSize: '2.5rem' }} className="text-muted mb-3" />
          <h5>No Education Added Yet</h5>
          <p className="mb-3 text-muted">Add your educational background to showcase your academic qualifications.</p>
          <Button 
            variant="primary" 
            onClick={addEducationItem}
            className="animated-button"
          >
            <FaPlus className="me-2" /> Add First Education
          </Button>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {education.map((edu, eduIndex) => (
          <Card key={eduIndex} className="mb-4 form-card hover-effect">
            <Card.Header 
              className="d-flex align-items-center"
              onClick={() => toggleCard(eduIndex)}
              style={{ cursor: 'pointer' }}
            >
              <FaUniversity className="me-2" />
              <span>{edu.institution || `Education #${eduIndex + 1}`}</span>
              <div className="ms-auto d-flex align-items-center">
                {edu.degree && (
                  <Badge bg="light" text="dark" className="me-2">
                    {edu.degree}
                  </Badge>
                )}
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="me-2 btn-icon-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card toggle when clicking remove button
                    removeEducationItem(eduIndex);
                  }}
                  aria-label="Remove education item"
                >
                  <FaTrash /> <span className="d-none d-md-inline">Remove</span>
                </Button>
                {openCards[eduIndex] ? (
                  <FaChevronUp className="text-secondary" />
                ) : (
                  <FaChevronDown className="text-secondary" />
                )}
              </div>
            </Card.Header>
            <Collapse in={openCards[eduIndex]}>
              <div>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaUniversity className="me-1" /> Institution</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={edu.institution} 
                          onChange={(e) => updateEducation(eduIndex, 'institution', e.target.value)} 
                          placeholder="University or school name"
                          className="form-control-modern"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaBookReader className="me-1" /> Degree</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={edu.degree} 
                          onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)} 
                          placeholder="Degree or qualification"
                          className="form-control-modern"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <PeriodPicker
                    value={edu.period}
                    onChange={(value) => updateEducation(eduIndex, 'period', value)}
                    label={<><FaCalendarAlt className="me-1" /> Period</>}
                    required
                  />

                  <Form.Group className="mb-3">
                    <Form.Label><FaTools className="me-1" /> Skills</Form.Label>
                    <div className="skills-container p-3 border rounded mb-2">
                      {edu.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className="d-flex mb-2 align-items-center">
                          <Form.Control 
                            type="text" 
                            value={skill}
                            onChange={(e) => updateSkill(eduIndex, skillIndex, e.target.value)}
                            placeholder="Skill gained during education"
                            className="form-control-modern"
                            required
                          />
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            className="ms-2 btn-icon-sm"
                            onClick={() => removeSkill(eduIndex, skillIndex)}
                            aria-label="Remove skill"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => addSkill(eduIndex)}
                      className="mt-2"
                      type="button"
                    >
                      <FaPlus className="me-1" /> Add Skill
                    </Button>
                  </Form.Group>
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        ))}

        {education.length > 0 && (
          <Button 
            variant="outline-success" 
            className="add-item-button animated-button" 
            onClick={addEducationItem}
            type="button"
          >
            <FaPlus className="me-2" /> Add Education
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

export default EducationForm;

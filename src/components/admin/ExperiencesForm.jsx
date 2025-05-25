import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import { 
  FaBriefcase, 
  FaBuilding, 
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaMapMarkerAlt,
  FaCalendarAlt, 
  FaListUl,
  FaUserTie,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaInfoCircle
} from 'react-icons/fa';
import { setData, getData } from '../../api';
import PeriodPicker from '../common/PeriodPicker';

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
      <div className="text-center p-5">
        <div className="mb-4">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
        <h5 className="text-muted">Loading Work Experience Information...</h5>
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
    <div className="experiences-form animate-fade-in">
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
        <h4 className="mb-3"><FaBriefcase className="me-2" /> Work Experience</h4>
        <p className="text-muted">Manage your professional work history and career progression</p>
      </div>

      {experiences.length === 0 && !isLoading && (
        <div className="text-center p-4 mb-4 empty-state-container">
          <FaBriefcase style={{ fontSize: '2.5rem' }} className="text-muted mb-3" />
          <h5>No Experience Added Yet</h5>
          <p className="mb-3 text-muted">Add your professional experience to showcase your career path.</p>
          <Button 
            variant="primary" 
            onClick={addExperience}
            className="animated-button"
          >
            <FaPlus className="me-2" /> Add First Experience
          </Button>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {experiences.map((experience, expIndex) => (
          <Card key={expIndex} className="mb-4 form-card hover-effect">
            <Card.Header className="d-flex align-items-center">
              <FaBuilding className="me-2" />
              <span>{experience.company || `Experience #${expIndex + 1}`}</span>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-auto btn-icon-sm"
                onClick={() => removeExperience(expIndex)}
                aria-label="Remove experience"
              >
                <FaTrash /> <span className="d-none d-md-inline">Remove</span>
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaBuilding className="me-1" /> Company</Form.Label>
                    <Form.Control
                      type="text"
                      value={experience.company}
                      onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                      placeholder="Company name"
                      className="form-control-modern"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaMapMarkerAlt className="me-1" /> Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={experience.location}
                      onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
                      placeholder="City, Country"
                      className="form-control-modern"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaInfoCircle className="me-1" /> Type</Form.Label>
                    <Form.Select
                      value={experience.type}
                      onChange={(e) => updateExperience(expIndex, 'type', e.target.value)}
                      className="form-control-modern"
                    >
                      <option value="">Select a job type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                      <option value="Student Job">Student Job</option>
                      <option value="Volunteer">Volunteer</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="section-divider mb-1">
                <Badge bg="light" text="dark" className="section-badge">
                  <FaUserTie className="me-1" /> Positions
                </Badge>
              </div>

              {experience.positions?.map((position, posIndex) => (
                <div key={posIndex} className="nested-form mb-4 p-3 border rounded">
                  <div className="d-flex align-items-center mb-3">
                    <h6 className="m-0"><FaUserTie className="me-2" />{position.title || `Position #${posIndex + 1}`}</h6>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-auto btn-icon-sm"
                      onClick={() => removePosition(expIndex, posIndex)}
                      aria-label="Remove position"
                    >
                      <FaTrash />
                    </Button>
                  </div>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaUserTie className="me-1" /> Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={position.title}
                          onChange={(e) => updatePosition(expIndex, posIndex, 'title', e.target.value)}
                          placeholder="Job title"
                          className="form-control-modern"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <PeriodPicker
                        value={position.period}
                        onChange={(value) => updatePosition(expIndex, posIndex, 'period', value)}
                        label={<><FaCalendarAlt className="me-1" /> Period</>}
                        required
                      />
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label><FaListUl className="me-1" /> Responsibilities</Form.Label>
                    <div className="responsibilities-container p-3 border rounded mb-2">
                      {position.responsibilities.map((resp, respIndex) => (
                        <div key={respIndex} className="d-flex mb-2 align-items-center">
                          <Form.Control
                            type="text"
                            value={resp}
                            onChange={(e) => updateResponsibility(expIndex, posIndex, respIndex, e.target.value)}
                            placeholder="Key responsibility or achievement"
                            className="form-control-modern"
                            required
                          />
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="ms-2 btn-icon-sm"
                            onClick={() => removeResponsibility(expIndex, posIndex, respIndex)}
                            aria-label="Remove responsibility"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addResponsibility(expIndex, posIndex)}
                      type="button"
                      className="mt-2"
                    >
                      <FaPlus className="me-1" /> Add Responsibility
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
                <FaPlus className="me-1" /> Add Position
              </Button>
            </Card.Body>
          </Card>
        ))}

        {experiences.length > 0 && (
          <Button
            variant="outline-success"
            className="add-item-button animated-button"
            onClick={addExperience}
            type="button"
          >
            <FaPlus className="me-2" /> Add New Experience
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

export default ExperiencesForm;

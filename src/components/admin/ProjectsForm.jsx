import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, InputGroup, Spinner, Badge, Image } from 'react-bootstrap';
import { 
  FaProjectDiagram, 
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaLink, 
  FaCalendarAlt, 
  FaImage, 
  FaGithub,
  FaUserCog,
  FaEdit,
  FaCode,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaEye
} from 'react-icons/fa';
import { setData, getData } from '../../api';
import YearPicker from '../common/YearPicker';

const ProjectsForm = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('projects');
        setProjects(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects data:", err);
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
      await setData(projects, 'projects');
      setStatus({
        show: true,
        message: 'Projects saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving projects data:', error);
      setStatus({
        show: true,
        message: 'Failed to save data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: '',
        url: '',
        image: '',
        description: '',
        technologies: [''],
        year: new Date().getFullYear().toString(),
        role: '',
        github: ''
      }
    ]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const addTechnology = (projectIndex) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].technologies.push('');
    setProjects(updatedProjects);
  };

  const removeTechnology = (projectIndex, techIndex) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].technologies = 
      updatedProjects[projectIndex].technologies.filter((_, i) => i !== techIndex);
    setProjects(updatedProjects);
  };

  const updateTechnology = (projectIndex, techIndex, value) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].technologies[techIndex] = value;
    setProjects(updatedProjects);
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="mb-4">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
        <h5 className="text-muted">Loading Projects Information...</h5>
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
    <div className="projects-form animate-fade-in">
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
        <h4 className="mb-3"><FaProjectDiagram className="me-2" /> Projects</h4>
        <p className="text-muted">Manage your portfolio projects and showcase your work</p>
      </div>

      {projects.length === 0 && !isLoading && (
        <div className="text-center p-4 mb-4 empty-state-container">
          <FaProjectDiagram style={{ fontSize: '2.5rem' }} className="text-muted mb-3" />
          <h5>No Projects Added Yet</h5>
          <p className="mb-3 text-muted">Add projects to showcase your work and technical skills.</p>
          <Button 
            variant="primary" 
            onClick={addProject}
            className="animated-button"
          >
            <FaPlus className="me-2" /> Add First Project
          </Button>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        
        {projects.map((project, projectIndex) => (
          <Card key={projectIndex} className="mb-4 form-card hover-effect">
            <Card.Header className="d-flex align-items-center">
              <FaProjectDiagram className="me-2" />
              <span>{project.title || `Project #${projectIndex + 1}`}</span>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-auto btn-icon-sm"
                onClick={() => removeProject(projectIndex)}
                aria-label="Remove project"
              >
                <FaTrash /> <span className="d-none d-md-inline">Remove</span>
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaEdit className="me-1" /> Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={project.title} 
                      onChange={(e) => updateProject(projectIndex, 'title', e.target.value)} 
                      placeholder="Project name"
                      className="form-control-modern"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaCalendarAlt className="me-1" /> Year</Form.Label>
                    <YearPicker
                      year={project.year}
                      updateValue={(year) => updateProject(projectIndex, 'year', year)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaLink className="me-1" /> Live URL</Form.Label>
                    <Form.Control 
                      type="url" 
                      value={project.url || ''} 
                      onChange={(e) => updateProject(projectIndex, 'url', e.target.value)} 
                      placeholder="https://yourproject.com"
                      className="form-control-modern"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaGithub className="me-1" /> GitHub URL (optional)</Form.Label>
                    <Form.Control 
                      type="url" 
                      value={project.github || ''} 
                      onChange={(e) => updateProject(projectIndex, 'github', e.target.value)} 
                      placeholder="https://github.com/yourusername/project"
                      className="form-control-modern"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaImage className="me-1" /> Image Path</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">/assets/images/projects/</InputGroup.Text>
                      <Form.Control
                        type="text" 
                        value={project.image ? project.image.replace('/assets/images/projects/', '') : ''} 
                        onChange={(e) => updateProject(projectIndex, 'image', `/assets/images/projects/${e.target.value}`)} 
                        placeholder="image-name.jpg"
                        className="form-control-modern"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      <FaInfo className="me-1" /> Images should be placed in the public/assets/images/projects/ directory
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-center justify-content-center">
                  {project.image && (
                    <div className="image-preview mt-2 text-center">
                      <p><FaEye className="me-1" /> Image Preview</p>
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        thumbnail 
                        style={{ maxHeight: '100px', maxWidth: '100%' }} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://placehold.co/200x150?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label><FaUserCog className="me-1" /> Your Role</Form.Label>
                <Form.Control 
                  type="text" 
                  value={project.role || ''} 
                  onChange={(e) => updateProject(projectIndex, 'role', e.target.value)} 
                  placeholder="e.g., Lead Developer, UI Designer"
                  className="form-control-modern"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><FaEdit className="me-1" /> Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={project.description || ''} 
                  onChange={(e) => updateProject(projectIndex, 'description', e.target.value)} 
                  placeholder="Describe your project, its purpose, and your achievements"
                  className="form-control-modern"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><FaCode className="me-1" /> Technologies</Form.Label>
                <div className="technologies-container p-3 border rounded mb-2">
                  {project.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="d-flex mb-2 align-items-center">
                      <Form.Control 
                        type="text" 
                        value={tech}
                        onChange={(e) => updateTechnology(projectIndex, techIndex, e.target.value)}
                        placeholder="e.g., React, Node.js, MongoDB"
                        className="form-control-modern"
                        required
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="ms-2 btn-icon-sm"
                        onClick={() => removeTechnology(projectIndex, techIndex)}
                        aria-label="Remove technology"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => addTechnology(projectIndex)}
                  type="button"
                >
                  <FaPlus className="me-1" /> Add Technology
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}

        {projects.length > 0 && (
          <Button 
            variant="outline-success" 
            className="add-item-button animated-button" 
            onClick={addProject}
            type="button"
          >
            <FaPlus className="me-2" /> Add New Project
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

const FaInfo = ({ className }) => <span className={`text-muted ${className}`}><small><em>i</em></small></span>;

export default ProjectsForm;

import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, InputGroup, Spinner } from 'react-bootstrap';
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
        
        {projects.map((project, projectIndex) => (
          <Card key={projectIndex} className="mb-4">
            <Card.Header className="d-flex align-items-center">
              <span>{project.title || `Project #${projectIndex + 1}`}</span>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-auto"
                onClick={() => removeProject(projectIndex)}
              >
                Remove Project
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={project.title} 
                      onChange={(e) => updateProject(projectIndex, 'title', e.target.value)} 
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Year</Form.Label>
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
                    <Form.Label>URL</Form.Label>
                    <Form.Control 
                      type="url" 
                      value={project.url || ''} 
                      onChange={(e) => updateProject(projectIndex, 'url', e.target.value)} 
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>GitHub URL (optional)</Form.Label>
                    <Form.Control 
                      type="url" 
                      value={project.github || ''} 
                      onChange={(e) => updateProject(projectIndex, 'github', e.target.value)} 
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Image Path</Form.Label>
                <InputGroup>
                  <InputGroup.Text>/assets/images/projects/</InputGroup.Text>
                  <Form.Control 
                    type="text" 
                    value={project.image ? project.image.replace('/assets/images/projects/', '') : ''} 
                    onChange={(e) => updateProject(projectIndex, 'image', `/assets/images/projects/${e.target.value}`)} 
                    placeholder="image-name.jpg"
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  Images should be placed in the public/assets/images/projects/ directory
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control 
                  type="text" 
                  value={project.role || ''} 
                  onChange={(e) => updateProject(projectIndex, 'role', e.target.value)} 
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  value={project.description || ''} 
                  onChange={(e) => updateProject(projectIndex, 'description', e.target.value)} 
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Technologies</Form.Label>
                {project.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="d-flex mb-2">
                    <Form.Control 
                      type="text" 
                      value={tech}
                      onChange={(e) => updateTechnology(projectIndex, techIndex, e.target.value)}
                      required
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="ms-2"
                      onClick={() => removeTechnology(projectIndex, techIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => addTechnology(projectIndex)}
                  type="button"
                >
                  Add Technology
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}

        <Button 
          variant="outline-success" 
          className="add-item-button" 
          onClick={addProject}
          type="button"
        >
          Add New Project
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

export default ProjectsForm;

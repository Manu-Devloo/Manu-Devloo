import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import resumeData from '../data/resume.json';
import { useTheme } from '../hooks/useTheme';

function Projects() {
  const { isDarkMode } = useTheme();

  const openProjectWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="projects" id="projects">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">Projects</h2>
        </Col>
      </Row>

      <Row>
        {resumeData.projects.map((project, index) => (
          <Col lg={6} className="mb-4" key={index}>
            <Card className="project-card h-100 shadow d-flex flex-column">
              <div className="project-preview">
                <div className="project-image-container">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="project-image"
                      onError={(e) => {
                        // If project image fails, show a colored placeholder
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const textEl = document.createElement('div');
                        textEl.className = 'image-fallback-text';
                        textEl.innerText = project.title;
                        e.target.parentNode.appendChild(textEl);
                      }}
                    />
                  ) : (
                    <div className={`image-placeholder ${isDarkMode ? 'dark' : 'light'}`}>
                      <div className="image-fallback-text">{project.title}</div>
                    </div>
                  )}
                  <div className="preview-overlay">
                    <Button 
                      variant="primary" 
                      onClick={() => openProjectWebsite(project.url)}
                    >
                      Visit Website
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <div className="project-content">
                  <Card.Title className="d-flex justify-content-between align-items-start">
                    {project.title}
                    <Badge bg="secondary">{project.year}</Badge>
                  </Card.Title>
                  
                  <Card.Text>{project.description}</Card.Text>
                </div>
                
                <div className="mt-auto">
                  <div className="mb-3">
                    <strong>Role:</strong> {project.role}
                  </div>
                  
                  <div className="technologies mb-3">
                    {project.technologies.map((tech, i) => (
                      <Badge 
                        key={i} 
                        bg="primary" 
                        className="tech-badge"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-top">
                    <Button 
                      variant={isDarkMode ? "outline-light" : "outline-dark"} 
                      size="sm" 
                      className="me-2"
                      onClick={() => openProjectWebsite(project.url)}
                    >
                      <FaExternalLinkAlt className="me-1" /> Visit
                    </Button>
                    
                    {project.github && (
                      <Button 
                        variant={isDarkMode ? "outline-light" : "outline-dark"} 
                        size="sm"
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub className="me-1" /> Code
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default Projects;
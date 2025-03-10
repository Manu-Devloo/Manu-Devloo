import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';
import resumeData from '../data/resume.json';
import { downloadCV } from '../utils/generateCV';
import downloadFallbackCV from '../utils/downloadFallbackCV';

function Hero() {
  const { name, title, shortBio, github, linkedin, profileImage } = resumeData.personal;
  
  const handleDownloadCV = (e) => {
    e.preventDefault();
    try {
      downloadCV();
    } catch (error) {
      console.error("Error generating CV:", error);
      downloadFallbackCV();
    }
  };
  
  return (
    <section className="hero" id="home">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="hero-content">
            <h1>{name}</h1>
            <h2>{title}</h2>
            <p className="mb-4">
              {shortBio}
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button variant="light" href="#contact">Contact Me</Button>
              <Button variant="outline-light" onClick={handleDownloadCV}>
                <FaFileAlt className="me-2" /> Download CV
              </Button>
              <Button variant="outline-light" href={github} target="_blank">
                <FaGithub className="me-2" /> GitHub
              </Button>
              <Button variant="outline-light" href={linkedin} target="_blank">
                <FaLinkedin className="me-2" /> LinkedIn
              </Button>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <img 
              src={profileImage}
              alt={name}
              className="hero-image img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;

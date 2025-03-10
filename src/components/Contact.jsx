import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaFileAlt } from 'react-icons/fa';
import resumeData from '../data/resume.json';
import { downloadCV } from '../utils/generateCV';
import downloadFallbackCV from '../utils/downloadFallbackCV';
import { useTheme } from '../hooks/useTheme';

function Contact() {
  const { isDarkMode } = useTheme();
  const { address, phone, email, linkedin, github } = resumeData.personal;
  
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
    <section className="contact" id="contact">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">Contact Me</h2>
        </Col>
      </Row>
      
      <Row>
        <Col lg={6}>
          <div className="contact-info">
            <div className="contact-item">
              <FaMapMarkerAlt className="icon" />
              <div>
                <h5>Location</h5>
                <p>{address}</p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaPhone className="icon" />
              <div>
                <h5>Phone</h5>
                <p>{phone}</p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaEnvelope className="icon" />
              <div>
                <h5>Email</h5>
                <p>{email}</p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaFileAlt className="icon" />
              <div>
                <h5>CV / Resume</h5>
                <p>
                  <button 
                    onClick={handleDownloadCV} 
                    className="download-link btn btn-link p-0" 
                    style={{ border: 'none', background: 'none' }}
                  >
                    Download CV <span className="text-muted">(PDF)</span>
                  </button>
                </p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaLinkedin className="icon" />
              <div>
                <h5>LinkedIn</h5>
                <p><a href={linkedin} target="_blank" rel="noopener noreferrer">
                  {linkedin.split('/').slice(-2)[0]}
                </a></p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaGithub className="icon" />
              <div>
                <h5>GitHub</h5>
                <p><a href={github} target="_blank" rel="noopener noreferrer">
                  {github.split('/').pop()}
                </a></p>
              </div>
            </div>
          </div>
        </Col>
        
        <Col lg={6}>
          <Form 
            name="contact" 
            method="POST" 
            data-netlify="true" 
            data-netlify-honeypot="bot-field" 
            className={isDarkMode ? "dark-form" : ""}>
            
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden" style={{ display: 'none' }}>
              <label>Don't fill this out if you're human: <input name="bot-field" /></label>
            </p>
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Your Name" />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Your Email" />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" name="subject" placeholder="Subject" />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" name="message" rows={5} placeholder="Your Message" />
            </Form.Group>
            
            <Button variant={isDarkMode ? "primary" : "primary"} type="submit">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
    </section>
  );
}

export default Contact;

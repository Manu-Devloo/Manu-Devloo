import { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaFileAlt } from 'react-icons/fa';
import { downloadCV } from '../utils/generateCV';
import downloadFallbackCV from '../utils/downloadFallbackCV';
import { useTheme } from '../hooks/useTheme';

function Contact({ resumeData }) {
  const { isDarkMode } = useTheme();
  const { address, phone, email, linkedin, github } = resumeData.personal;
  const [formStatus, setFormStatus] = useState({ show: false, type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleDownloadCV = (e) => {
    e.preventDefault();
    
    // Show feedback to user
    const button = e.target.closest('button');
    const originalText = button.textContent;
    button.textContent = 'Generating...';
    button.disabled = true;
    
    try {
      downloadCV(resumeData);
      
      // Reset button after a delay
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    } catch (error) {
      console.error("Error generating CV:", error);
      
      // Reset button 
      button.textContent = originalText;
      button.disabled = false;
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      
      if (response.ok) {
        // Reset the form
        form.reset();
        setFormStatus({
          show: true,
          type: 'success',
          message: 'Thank you for your message! I will get back to you soon.'
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        show: true,
        type: 'danger',
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
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
                <p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    {address}
                  </a>
                </p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaPhone className="icon" />
              <div>
                <h5>Phone</h5>
                <p>
                  <a 
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="contact-link"
                  >
                    {phone}
                  </a>
                </p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaEnvelope className="icon" />
              <div>
                <h5>Email</h5>
                <p>
                  <a 
                    href={`mailto:${email}`}
                    className="contact-link"
                  >
                    {email}
                  </a>
                </p>
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
                <p><a href={linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
                  {linkedin.split('/').pop()}
                </a></p>
              </div>
            </div>
            
            <div className="contact-item">
              <FaGithub className="icon" />
              <div>
                <h5>GitHub</h5>
                <p><a href={github} target="_blank" rel="noopener noreferrer" className="contact-link">
                  {github.split('/').pop()}
                </a></p>
              </div>
            </div>
          </div>
        </Col>
        
        <Col lg={6}>
          {formStatus.show && (
            <Alert 
              variant={formStatus.type} 
              onClose={() => setFormStatus({...formStatus, show: false})} 
              dismissible
            >
              {formStatus.message}
            </Alert>
          )}
          
          <Form 
            name="contact" 
            method="POST" 
            className={isDarkMode ? "dark-form" : ""}
            onSubmit={handleSubmit}>
            
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden" style={{ display: 'none' }}>
              <label>Don't fill this out if you're human: <input name="bot-field" /></label>
            </p>
            
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="Your Name" required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" placeholder="Your Email" required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" name="subject" placeholder="Subject" required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" name="message" rows={5} placeholder="Your Message" required />
            </Form.Group>
            
            <Button 
              variant={isDarkMode ? "primary" : "primary"} 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </Form>
        </Col>
      </Row>
    </section>
  );
}

export default Contact;

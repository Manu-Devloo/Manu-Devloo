import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaCertificate } from 'react-icons/fa';
import resumeData from '../data/resume.json';
import { useTheme } from '../hooks/useTheme';

function Certificates() {
  const { isDarkMode } = useTheme();
  
  const handleCertificateClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <section className="certificates" id="certificates">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">Certificates</h2>
        </Col>
      </Row>
      
      <Row>
        {resumeData.certificates.map((cert, index) => (
          <Col lg={3} md={6} className="mb-4" key={index}>
            <Card 
              className={`h-100 shadow-sm text-center p-3 ${cert.url ? 'certificate-card' : ''}`} 
              onClick={() => handleCertificateClick(cert.url)}
              style={{ cursor: cert.url ? 'pointer' : 'default' }}
            >
              <Card.Body>
                <FaCertificate className={`${isDarkMode ? 'text-primary' : 'text-primary'} mb-3`} style={{ fontSize: '3rem' }} />
                <Card.Title>                  {cert.title}                </Card.Title>
                <Card.Text className="text-muted">{cert.issuer}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <style jsx>{`
        .certificate-card:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </section>
  );
}

export default Certificates;

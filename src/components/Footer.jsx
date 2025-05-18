import { Container, Row, Col } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

function Footer({ resumeData}) {
  const { email, linkedin, github, name } = resumeData.personal;
  
  return (
    <footer>
      <Container>
        <Row>
          <Col md={6}>
            <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="social-icons">
              <a href={`mailto:${email}`} aria-label="Email">
                <FaEnvelope />
              </a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

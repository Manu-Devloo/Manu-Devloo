import { Row, Col, Card } from 'react-bootstrap';
import { FaCode, FaServer, FaTools, FaCamera, FaMicrosoft, FaLanguage } from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';

function Skills({ resumeData }) {
  const { isDarkMode } = useTheme();
  
  // Icon mapping
  const iconComponents = {
    FaCode: FaCode,
    FaServer: FaServer,
    FaTools: FaTools,
    FaCamera: FaCamera, 
    FaMicrosoft: FaMicrosoft,
    FaLanguage: FaLanguage
  };

  return (
    <section className="skills" id="skills">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">Skills</h2>
        </Col>
      </Row>
      
      <Row>
        {resumeData.skills.map((category, index) => {
          const IconComponent = iconComponents[category.icon];
          
          return (
            <Col lg={4} md={6} className="mb-4" key={index}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className={`${isDarkMode ? 'text-primary' : 'text-primary'} mb-3`} style={{ fontSize: '2rem' }}>
                    {IconComponent && <IconComponent />}
                  </div>
                  <Card.Title>{category.title}</Card.Title>
                  <ul>
                    {category.skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </section>
  );
}

export default Skills;

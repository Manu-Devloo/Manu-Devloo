import { Row, Col } from 'react-bootstrap';

function Education({ resumeData }) {
  return (
    <section className="education" id="education">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">Education</h2>
          
          <div className="timeline">
            {resumeData.education.map((edu, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-date">{edu.period}</div>
                <h4 className="timeline-title">{edu.degree}</h4>
                <div className="timeline-subtitle">{edu.institution}</div>
                <ul className="mt-2">
                  {edu.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default Education;

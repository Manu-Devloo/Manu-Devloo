import React from 'react';
import { Row, Col } from 'react-bootstrap';

function About({resumeData}) {
  return (
    <section className="about" id="about">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">About Me</h2>
          {resumeData.about.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Col>
      </Row>
    </section>
  );
}

export default About;

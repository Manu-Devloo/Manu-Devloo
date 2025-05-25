import { Row, Col } from 'react-bootstrap';

function Education({ resumeData }) {
  const parseEducationPeriodEndDate = (periodString) => {
    const parts = periodString.split(' - ');
    const dateStrToParse = parts.length > 1 ? parts[1].trim() : parts[0].trim();

    if (dateStrToParse.toLowerCase() === 'present') {
      return new Date(); // Uses current date, e.g., May 19, 2025
    }

    const dateParts = dateStrToParse.split(' ');
    if (dateParts.length === 2) {
      const months = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
      };
      const month = months[dateParts[0]];
      const year = parseInt(dateParts[1]);
      if (!isNaN(year) && month !== undefined) {
        return new Date(year, month + 1, 0); // Last day of the month
      }
    }
    
    // Fallback for "YYYY" or other direct date strings
    const parsedDate = new Date(dateStrToParse);
    if (!isNaN(parsedDate)) {
      if (/^\d{4}$/.test(dateStrToParse)) { // Just a year
          return new Date(parseInt(dateStrToParse), 11, 31); // Dec 31 of that year
      }
      return parsedDate;
    }
    return new Date(0); // Epoch for unparseable dates
  };

  const sortedEducation = [...resumeData.education].sort((a, b) => {
    const dateA = parseEducationPeriodEndDate(a.period);
    const dateB = parseEducationPeriodEndDate(b.period);
    return dateB - dateA; // Sort descending (most recent first)
  });

  return (
    <section className="education" id="education">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">Education</h2>
          
          <div className="timeline">
            {sortedEducation.map((edu, index) => (
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

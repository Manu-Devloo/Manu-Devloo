import { Row, Col, Card, Badge } from 'react-bootstrap';

function Experience({ resumeData }) {
  // Helper function to calculate duration between dates
  const calculateDuration = (startPeriod, endPeriod) => {
    // Parse the dates from period strings
    const startDate = parseDate(startPeriod);
    
    // If only one date is given and it's not "Present"
    if (!endPeriod) {
      return '1 month';
    }
    
    const endDate = endPeriod === 'Present' ? new Date() : parseDate(endPeriod);
    
    if (!startDate || !endDate) return '';
    
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    
    // Adjust years and months if end month is earlier than start month
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Format the duration string
    let durationText = '';
    if (years > 0) {
      durationText += years + (years === 1 ? ' year' : ' years');
      if (months > 0) durationText += ', ';
    }
    
    if (months > 0 || years === 0) {
      durationText += months + (months === 1 ? ' month' : ' months');
    }
    
    return durationText;
  };
  
  // Helper function to parse date strings like "May 2023"
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    const parts = dateString.split(' ');
    if (parts.length < 2) return null;
    
    const months = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    const month = months[parts[0]];
    const year = parseInt(parts[1]);
    
    if (isNaN(year) || month === undefined) return null;
    
    return new Date(year, month);
  };
  
  // Helper to get duration for a position
  const getPositionDuration = (position) => {
    const periodParts = position.period.split(' - ');
    if (periodParts.length === 1) {
      // If only one date, either it's still ongoing (Present) or it lasted one month
      return periodParts[0] === 'Present' ? calculateDuration(new Date(), 'Present') : '1 month';
    }
    return calculateDuration(periodParts[0], periodParts[1]);
  };
  
  // Helper to get overall company duration (from earliest to latest position)
  const getCompanyDuration = (positions) => {
    if (!positions || positions.length === 0) return '';
    
    let earliestStart = null;
    let latestEnd = null;
    
    positions.forEach(position => {
      const periodParts = position.period.split(' - ');
      
      // Handle case with only one date
      if (periodParts.length === 1 && periodParts[0] !== 'Present') {
        const date = parseDate(periodParts[0]);
        if (date) {
          // For single-date entries, assume a one-month duration
          const endDate = new Date(date);
          endDate.setMonth(endDate.getMonth() + 1);
          
          if (!earliestStart || date < earliestStart) {
            earliestStart = date;
          }
          
          if (!latestEnd || endDate > latestEnd) {
            latestEnd = endDate;
          }
        }
        return;
      }
      
      const startDate = parseDate(periodParts[0]);
      const endDate = periodParts.length > 1 && periodParts[1] === 'Present' ? 
                       new Date() : 
                       (periodParts.length > 1 ? parseDate(periodParts[1]) : null);
      
      if (startDate) {
        if (!earliestStart || startDate < earliestStart) {
          earliestStart = startDate;
        }
      }
      
      if (endDate) {
        if (!latestEnd || endDate > latestEnd) {
          latestEnd = endDate;
        }
      }
    });
    
    if (!earliestStart || !latestEnd) return '';
    
    // Convert dates back to month-year strings
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const earliestStartStr = months[earliestStart.getMonth()] + ' ' + earliestStart.getFullYear();
    const latestEndStr = latestEnd.getTime() === new Date().setDate(1) ? 'Present' : months[latestEnd.getMonth()] + ' ' + latestEnd.getFullYear();
    
    return calculateDuration(earliestStartStr, latestEndStr);
  };
  
  // Updated helper to get the latest end date for an experience entry
  const getLatestDateForExperience = (positions) => {
    if (!positions || positions.length === 0) return new Date(0); // Return epoch if no positions

    let overallLatestDate = new Date(0);

    positions.forEach(position => {
      const periodParts = position.period.split(' - ');
      let currentPositionEndDate;

      if (periodParts.length > 1) { // Format "Date1 - Date2" or "Date1 - Present"
        const endDateStr = periodParts[1].trim();
        if (endDateStr.toLowerCase() === 'present') {
          currentPositionEndDate = new Date(); // Current date, e.g., May 19, 2025
        } else {
          currentPositionEndDate = parseDate(endDateStr); // Parses to first day of month
          if (currentPositionEndDate) {
            // Set to last day of the month for consistent sorting
            currentPositionEndDate = new Date(currentPositionEndDate.getFullYear(), currentPositionEndDate.getMonth() + 1, 0);
          }
        }
      } else { // Single date format "Month Year"
        currentPositionEndDate = parseDate(periodParts[0].trim());
        if (currentPositionEndDate) {
          // Set to last day of the month
          currentPositionEndDate = new Date(currentPositionEndDate.getFullYear(), currentPositionEndDate.getMonth() + 1, 0);
        }
      }
      
      currentPositionEndDate = currentPositionEndDate || new Date(0); // Fallback if parsing failed

      if (currentPositionEndDate > overallLatestDate) {
        overallLatestDate = currentPositionEndDate;
      }
    });
    return overallLatestDate;
  };
  
  const sortedExperiences = [...resumeData.experiences].sort((a, b) => {
    const dateA = getLatestDateForExperience(a.positions);
    const dateB = getLatestDateForExperience(b.positions);
    return dateB - dateA; // Sort descending (most recent first)
  });

  return (
    <section className="experience" id="experience">
      <Row>
        <Col lg={12}>
          <h2 className="section-title">Work Experience</h2>
          
          <div className="timeline">
            {sortedExperiences.map((exp, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-date">
                  {exp.positions[0].period}
                  {' '}
                  ({getCompanyDuration(exp.positions)})
                </div>
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h4 className="timeline-title">
                          {exp.company}
                          {exp.type && <Badge bg="secondary" className="ms-2">{exp.type}</Badge>}
                        </h4>
                        <div className="text-muted mb-3">{exp.location}</div>
                      </div>
                    </div>

                    {/* Career progression within company */}
                    {exp.positions.map((position, idx) => (
                      <div key={idx} className="position-item mb-3">
                        <div className="d-flex justify-content-between">
                          <h5 className="mb-1">{position.title}</h5>
                          <span className="text-muted">
                            {position.period}
                            {' '}
                            ({getPositionDuration(position)})
                          </span>
                        </div>
                        {position.responsibilities && (
                          <ul className="small">
                            {position.responsibilities.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {idx < exp.positions.length - 1 && (
                          <div className="promotion-indicator">
                            <i className="fas fa-arrow-up text-success"></i>
                            <span className="small text-success"> Promotion</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default Experience;

import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { setData, getData } from '../../api';
import PeriodPicker from '../common/PeriodPicker';

const EducationForm = () => {
  const [education, setEducation] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('education');
        setEducation(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching education data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await setData(education, 'education');
      setStatus({
        show: true,
        message: 'Education information saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving education data:', error);
      setStatus({
        show: true,
        message: 'Failed to save data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEducationItem = () => {
    setEducation([
      ...education,
      {
        institution: '',
        degree: '',
        period: '',
        skills: ['']
      }
    ]);
  };

  const removeEducationItem = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const addSkill = (educationIndex) => {
    const updatedEducation = [...education];
    updatedEducation[educationIndex].skills.push('');
    setEducation(updatedEducation);
  };

  const removeSkill = (educationIndex, skillIndex) => {
    const updatedEducation = [...education];
    updatedEducation[educationIndex].skills = 
      updatedEducation[educationIndex].skills.filter((_, i) => i !== skillIndex);
    setEducation(updatedEducation);
  };

  const updateSkill = (educationIndex, skillIndex, value) => {
    const updatedEducation = [...education];
    updatedEducation[educationIndex].skills[skillIndex] = value;
    setEducation(updatedEducation);
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">
        {error}
        <div className="mt-3">
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      {status.show && (
        <Alert 
          variant={status.type}
          onClose={() => setStatus({ ...status, show: false })} 
          dismissible
        >
          {status.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {education.map((edu, eduIndex) => (
          <Card key={eduIndex} className="mb-4">
            <Card.Header className="d-flex align-items-center">
              <span>{edu.institution || `Education #${eduIndex + 1}`}</span>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-auto"
                onClick={() => removeEducationItem(eduIndex)}
              >
                Remove
              </Button>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Institution</Form.Label>
                <Form.Control 
                  type="text" 
                  value={edu.institution} 
                  onChange={(e) => updateEducation(eduIndex, 'institution', e.target.value)} 
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Degree</Form.Label>
                <Form.Control 
                  type="text" 
                  value={edu.degree} 
                  onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)} 
                  required
                />
              </Form.Group>

              <PeriodPicker
                value={edu.period}
                onChange={(value) => updateEducation(eduIndex, 'period', value)}
                label="Period"
                required
              />

              <Form.Group className="mb-3">
                <Form.Label>Skills</Form.Label>
                {edu.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="d-flex mb-2">
                    <Form.Control 
                      type="text" 
                      value={skill}
                      onChange={(e) => updateSkill(eduIndex, skillIndex, e.target.value)}
                      required
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="ms-2"
                      onClick={() => removeSkill(eduIndex, skillIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => addSkill(eduIndex)}
                  type="button"
                >
                  Add Skill
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}

        <Button 
          variant="outline-success" 
          className="add-item-button" 
          onClick={addEducationItem}
          type="button"
        >
          Add Education
        </Button>

        <div className="d-flex justify-content-end">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EducationForm;

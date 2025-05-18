import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaGripVertical } from 'react-icons/fa';
import { setData, getData } from '../../api';

const SkillsForm = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('skills');
        // In resume.json it's "skillCategories" but in the API it's "skills"
        setSkillCategories(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching skills data:", err);
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
      await setData(skillCategories, 'skills');
      setStatus({
        show: true,
        message: 'Skills saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving skills data:', error);
      setStatus({
        show: true,
        message: 'Failed to save data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCategory = () => {
    setSkillCategories([
      ...skillCategories,
      {
        title: '',
        icon: 'FaCode',
        skills: ['']
      }
    ]);
  };

  const removeCategory = (index) => {
    setSkillCategories(skillCategories.filter((_, i) => i !== index));
  };

  const updateCategory = (index, field, value) => {
    const updatedCategories = [...skillCategories];
    updatedCategories[index][field] = value;
    setSkillCategories(updatedCategories);
  };

  const addSkill = (categoryIndex) => {
    const updatedCategories = [...skillCategories];
    updatedCategories[categoryIndex].skills.push('');
    setSkillCategories(updatedCategories);
  };

  const removeSkill = (categoryIndex, skillIndex) => {
    const updatedCategories = [...skillCategories];
    updatedCategories[categoryIndex].skills = 
      updatedCategories[categoryIndex].skills.filter((_, i) => i !== skillIndex);
    setSkillCategories(updatedCategories);
  };

  const updateSkill = (categoryIndex, skillIndex, value) => {
    const updatedCategories = [...skillCategories];
    updatedCategories[categoryIndex].skills[skillIndex] = value;
    setSkillCategories(updatedCategories);
  };

  const iconOptions = [
    'FaCode', 'FaServer', 'FaTools', 'FaCamera', 'FaMicrosoft', 'FaLanguage'
  ];

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
        {skillCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="mb-4">
            <Card.Header className="d-flex align-items-center">
              <FaGripVertical className="me-2 drag-handle" />
              <span>{category.title || `Skill Category #${categoryIndex + 1}`}</span>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-auto"
                onClick={() => removeCategory(categoryIndex)}
              >
                Remove Category
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={category.title} 
                      onChange={(e) => updateCategory(categoryIndex, 'title', e.target.value)} 
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Icon</Form.Label>
                    <Form.Select 
                      value={category.icon} 
                      onChange={(e) => updateCategory(categoryIndex, 'icon', e.target.value)}
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Skills</Form.Label>
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="d-flex mb-2">
                    <Form.Control 
                      type="text" 
                      value={skill}
                      onChange={(e) => updateSkill(categoryIndex, skillIndex, e.target.value)}
                      required
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="ms-2"
                      onClick={() => removeSkill(categoryIndex, skillIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => addSkill(categoryIndex)}
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
          onClick={addCategory}
          type="button"
        >
          Add New Skill Category
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

export default SkillsForm;

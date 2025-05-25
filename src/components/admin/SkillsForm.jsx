import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaGripVertical } from 'react-icons/fa';
import { setData, getData } from '../../api';
import DraggableList from '../common/DraggableList';
import * as FaIcons from 'react-icons/fa';

const SkillsForm = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // List of available Font Awesome icons that can be used
  const iconOptions = [
    'FaCode', 'FaServer', 'FaTools', 'FaCamera', 'FaMicrosoft', 'FaLanguage',
    'FaDatabase', 'FaCloud', 'FaMobile', 'FaDesktop', 'FaBrain', 'FaPencilAlt',
    'FaLaptopCode', 'FaNetworkWired', 'FaRobot', 'FaSitemap', 'FaUserCog'
  ];
  
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
    const updatedSkillCategories = [...skillCategories];
    updatedSkillCategories[index][field] = value;
    setSkillCategories(updatedSkillCategories);
  };

  const addSkill = (categoryIndex) => {
    const updatedSkillCategories = [...skillCategories];
    updatedSkillCategories[categoryIndex].skills.push('');
    setSkillCategories(updatedSkillCategories);
  };

  const removeSkill = (categoryIndex, skillIndex) => {
    const updatedSkillCategories = [...skillCategories];
    updatedSkillCategories[categoryIndex].skills = 
      updatedSkillCategories[categoryIndex].skills.filter((_, i) => i !== skillIndex);
    setSkillCategories(updatedSkillCategories);
  };

  const updateSkill = (categoryIndex, skillIndex, value) => {
    const updatedSkillCategories = [...skillCategories];
    updatedSkillCategories[categoryIndex].skills[skillIndex] = value;
    setSkillCategories(updatedSkillCategories);
  };

  const handleReorder = (newOrder) => {
    setSkillCategories(newOrder);
  };

  const handleSkillsReorder = (categoryIndex, newSkills) => {
    const updatedSkillCategories = [...skillCategories];
    updatedSkillCategories[categoryIndex].skills = newSkills;
    setSkillCategories(updatedSkillCategories);
  };

  // Render the selected icon for preview
  const renderIconPreview = (iconName) => {
    const IconComponent = FaIcons[iconName];
    return IconComponent ? <IconComponent size={24} className="me-2" /> : null;
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
        <div className="mb-3">
          <small className="text-muted">Drag categories to reorder them</small>
        </div>

        <DraggableList
          items={skillCategories}
          onReorder={handleReorder}
          renderItem={(category, catIndex) => (
            <Card className="mb-4">
              <Card.Header className="d-flex align-items-center">
                <FaGripVertical className="me-2" style={{ cursor: 'grab' }} />
                <span>{category.title || `Category #${catIndex + 1}`}</span>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="ms-auto"
                  onClick={() => removeCategory(catIndex)}
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
                        value={category.title || ''} 
                        onChange={(e) => updateCategory(catIndex, 'title', e.target.value)} 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Icon</Form.Label>
                      <div className="d-flex align-items-center">
                        {category.icon && renderIconPreview(category.icon)}
                        <Form.Select
                          value={category.icon || 'FaCode'}
                          onChange={(e) => updateCategory(catIndex, 'icon', e.target.value)}
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Skills</Form.Label>
                  <div className="mb-2">
                    <small className="text-muted">Drag skills to reorder them</small>
                  </div>
                  
                  <DraggableList
                    items={category.skills || []}
                    onReorder={(newSkills) => handleSkillsReorder(catIndex, newSkills)}
                    renderItem={(skill, skillIndex) => (
                      <div className="d-flex mb-2 align-items-center">
                        <FaGripVertical className="me-2" style={{ cursor: 'grab' }} />
                        <Form.Control 
                          type="text" 
                          value={skill}
                          onChange={(e) => updateSkill(catIndex, skillIndex, e.target.value)}
                          required
                        />
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="ms-2"
                          onClick={() => removeSkill(catIndex, skillIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  />
                  
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => addSkill(catIndex)}
                    type="button"
                    className="mt-2"
                  >
                    Add Skill
                  </Button>
                </Form.Group>
              </Card.Body>
            </Card>
          )}
        />

        <Button 
          variant="outline-success" 
          className="add-item-button" 
          onClick={addCategory}
          type="button"
        >
          Add Category
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

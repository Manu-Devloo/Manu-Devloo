import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { setData, getData } from '../../api';
import * as FaIcons from 'react-icons/fa';
import { 
  FaCode, 
  FaListAlt,
  FaLayerGroup,
  FaTrash, 
  FaPlus, 
  FaSave, 
  FaEye,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo
} from 'react-icons/fa';

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

  // Render the selected icon for preview
  const renderIconPreview = (iconName) => {
    const IconComponent = FaIcons[iconName];
    return IconComponent ? <IconComponent size={24} className="me-2 text-primary" /> : null;
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="mb-4">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
        <h5 className="text-muted">Loading Skills Information...</h5>
        <p className="text-muted mb-0">Please wait while we fetch your data</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger" className="text-center p-4">
        <div className="mb-3">
          <FaExclamationTriangle style={{fontSize: '2rem'}} />
        </div>
        <h5>Oops! Something went wrong</h5>
        <p className="mb-3">{error}</p>
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          <FaRedo className="me-2" />
          Try Again
        </Button>
      </Alert>
    );
  }

  return (
    <div className="skills-form animate-fade-in">
      {status.show && (
        <Alert 
          variant={status.type}
          onClose={() => setStatus({ ...status, show: false })} 
          dismissible
          className="d-flex align-items-center"
        >
          {status.type === 'success' ? (
            <FaCheckCircle className="me-2" />
          ) : (
            <FaExclamationTriangle className="me-2" />
          )}
          <div>{status.message}</div>
        </Alert>
      )}

      <div className="section-header mb-4">
        <h4 className="mb-3"><FaLayerGroup className="me-2" /> Skills</h4>
        <p className="text-muted">Manage your technical skills and categorize them for better presentation</p>
      </div>

      {skillCategories.length === 0 && !isLoading && (
        <div className="text-center p-4 mb-4 empty-state-container">
          <FaCode style={{ fontSize: '2.5rem' }} className="text-muted mb-3" />
          <h5>No Skills Added Yet</h5>
          <p className="mb-3 text-muted">Add skill categories to showcase your technical capabilities.</p>
          <Button 
            variant="primary" 
            onClick={addCategory}
            className="animated-button"
          >
            <FaPlus className="me-2" /> Add First Category
          </Button>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {skillCategories.map((category, catIndex) => (
          <Card key={catIndex} className="mb-4 form-card hover-effect">
            <Card.Header className="d-flex align-items-center">
              {category.icon && renderIconPreview(category.icon)}
              <span>{category.title || `Category #${catIndex + 1}`}</span>
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="ms-auto btn-icon-sm"
                onClick={() => removeCategory(catIndex)}
                aria-label="Remove category"
              >
                <FaTrash /> <span className="d-none d-md-inline">Remove</span>
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="align-items-end">
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaListAlt className="me-1" /> Category Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={category.title || ''} 
                      onChange={(e) => updateCategory(catIndex, 'title', e.target.value)} 
                      placeholder="e.g., Programming Languages, Frameworks"
                      className="form-control-modern"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaInfoCircle className="me-1" /> Icon</Form.Label>
                    <div className="icon-selector d-flex align-items-center">
                      <Form.Select
                        value={category.icon || 'FaCode'}
                        onChange={(e) => updateCategory(catIndex, 'icon', e.target.value)}
                        className="form-control-modern"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </Form.Select>
                      <div className="icon-preview ms-3">
                        {renderIconPreview(category.icon || 'FaCode')}
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label><FaCode className="me-1" /> Skills</Form.Label>
                <div className="skills-container p-3 border rounded mb-2">
                  {(category.skills || []).map((skill, skillIndex) => (
                    <div key={skillIndex} className="d-flex mb-2 align-items-center">
                      <Form.Control 
                        type="text" 
                        value={skill}
                        onChange={(e) => updateSkill(catIndex, skillIndex, e.target.value)}
                        placeholder="e.g., JavaScript, React, Node.js"
                        className="form-control-modern"
                        required
                      />
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="ms-2 btn-icon-sm"
                        onClick={() => removeSkill(catIndex, skillIndex)}
                        aria-label="Remove skill"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => addSkill(catIndex)}
                  type="button"
                  className="mt-2"
                >
                  <FaPlus className="me-1" /> Add Skill
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>
        ))}

        {skillCategories.length > 0 && (
          <Button 
            variant="outline-success" 
            className="add-item-button animated-button" 
            onClick={addCategory}
            type="button"
          >
            <FaPlus className="me-2" /> Add Category
          </Button>
        )}

        <div className="d-flex justify-content-end mt-4">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2"
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SkillsForm;

import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { setData, getData } from '../../api';

const PersonalForm = () => {
  const [personalData, setPersonalData] = useState({
    name: '',
    title: '',
    profileImage: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    linkedin: '',
    github: '',
    shortBio: ''
  });
  const [status, setStatus] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData('personal');
        if (data) {
          setPersonalData(data);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching personal data:", err);
        setError("Failed to load personal data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setPersonalData({ ...personalData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await setData(personalData, 'personal');
      setStatus({
        show: true,
        message: 'Personal information saved successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving personal data:', error);
      setStatus({
        show: true,
        message: 'Failed to save personal data. Please try again.',
        type: 'danger'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Loading personal data...</p>
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
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Personal Information</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">Edit your personal details</Card.Subtitle>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={personalData.name} 
                    onChange={(e) => handleChange('name', e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title/Position</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={personalData.title} 
                    onChange={(e) => handleChange('title', e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control 
                type="url" 
                value={personalData.profileImage} 
                onChange={(e) => handleChange('profileImage', e.target.value)} 
                required
              />
              <Form.Text className="text-muted">
                Direct link to your profile image (GitHub avatar, LinkedIn photo, etc.)
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control 
                type="text" 
                value={personalData.address} 
                onChange={(e) => handleChange('address', e.target.value)} 
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control 
                    type="tel" 
                    value={personalData.phone} 
                    onChange={(e) => handleChange('phone', e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={personalData.email} 
                    onChange={(e) => handleChange('email', e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control 
                type="url" 
                value={personalData.website} 
                onChange={(e) => handleChange('website', e.target.value)} 
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>https://www.linkedin.com/in/</InputGroup.Text>
                    <Form.Control 
                      type="text" 
                      value={personalData.linkedin.replace('https://www.linkedin.com/in/', '')} 
                      onChange={(e) => handleChange('linkedin', `https://www.linkedin.com/in/${e.target.value}`)} 
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>https://github.com/</InputGroup.Text>
                    <Form.Control 
                      type="text" 
                      value={personalData.github.replace('https://github.com/', '')} 
                      onChange={(e) => handleChange('github', `https://github.com/${e.target.value}`)} 
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Short Bio</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={personalData.shortBio} 
                onChange={(e) => handleChange('shortBio', e.target.value)} 
                required
              />
              <Form.Text className="text-muted">
                A brief summary that will appear in the hero section
              </Form.Text>
            </Form.Group>
          </Card.Body>
        </Card>

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

export default PersonalForm;

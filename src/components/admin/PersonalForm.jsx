import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { 
  FaUserCircle, 
  FaIdCard, 
  FaUser, 
  FaBriefcase, 
  FaImage, 
  FaLink, 
  FaAddressBook, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaShareAlt, 
  FaLinkedin, 
  FaGithub, 
  FaQuoteLeft, 
  FaPen, 
  FaSave, 
  FaInfoCircle, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaRedo 
} from 'react-icons/fa';
import { setData, getData } from "../../api";

const PersonalForm = () => {
  const [personalData, setPersonalData] = useState({
    name: "",
    title: "",
    profileImage: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    github: "",
    shortBio: "",
  });
  const [status, setStatus] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData("personal");
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
      await setData(personalData, "personal");
      setStatus({
        show: true,
        message: "Personal information saved successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving personal data:", error);
      setStatus({
        show: true,
        message: "Failed to save personal data. Please try again.",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="mb-4">
          <span className="spinner-border spinner-border-lg text-primary" role="status" aria-hidden="true"></span>
        </div>
        <h5 className="text-muted">Loading Personal Information...</h5>
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
    <div className="fade-in">
      {status.show && (
        <Alert
          variant={status.type}
          onClose={() => setStatus({ ...status, show: false })}
          dismissible
          className="slide-in"
        >
          <div className="d-flex align-items-center">
            {status.type === 'success' ? <FaCheckCircle className="me-2" /> : <FaExclamationTriangle className="me-2" />}
            {status.message}
          </div>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex align-items-center mb-4">
              <FaUserCircle className="me-3 text-primary" style={{fontSize: '1.5rem'}} />
              <div>
                <Card.Title className="mb-1">Personal Information</Card.Title>
                <Card.Subtitle className="mb-0">
                  Edit your personal details and contact information
                </Card.Subtitle>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center">
                <FaIdCard className="me-2" />
                Basic Information
              </h6>
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="me-2" />
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={personalData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaBriefcase className="me-2" />
                      Title/Position
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={personalData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g. Full Stack Developer"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Profile Image Section */}
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center">
                <FaImage className="me-2" />
                Profile Image
              </h6>
              <Row>
                <Col lg={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaLink className="me-2" />
                      Profile Image URL
                    </Form.Label>
                    <Form.Control
                      type="url"
                      value={personalData.profileImage}
                      onChange={(e) =>
                        handleChange("profileImage", e.target.value)
                      }
                      placeholder="https://example.com/your-image.jpg"
                      required
                    />
                    <Form.Text className="text-muted">
                      <FaInfoCircle className="me-1" />
                      Direct link to your profile image (GitHub avatar, LinkedIn photo, etc.)
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col lg={4}>
                  {personalData.profileImage && (
                    <div className="text-center">
                      <img
                        src={personalData.profileImage}
                        alt="Profile Preview"
                        className="img-fluid"
                        style={{ 
                          maxWidth: "120px", 
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "16px",
                          border: "3px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                      />
                      <p className="text-muted mt-2 mb-0">
                        <small>Preview</small>
                      </p>
                    </div>
                  )}
                </Col>
              </Row>
            </div>

            {/* Contact Information Section */}
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center">
                <FaAddressBook className="me-2" />
                Contact Information
              </h6>
              
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaMapMarkerAlt className="me-2" />
                  Address
                </Form.Label>
                <Form.Control
                  type="text"
                  value={personalData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="City, Country"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaPhone className="me-2" />
                      Phone
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      value={personalData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaEnvelope className="me-2" />
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={personalData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaGlobe className="me-2" />
                  Website
                </Form.Label>
                <Form.Control
                  type="url"
                  value={personalData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </Form.Group>
            </div>

            {/* Social Media Section */}
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center">
                <FaShareAlt className="me-2" />
                Social Media
              </h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaLinkedin className="me-2" />
                      LinkedIn
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        https://www.linkedin.com/in/
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={personalData.linkedin.replace(
                          "https://www.linkedin.com/in/",
                          ""
                        )}
                        onChange={(e) =>
                          handleChange(
                            "linkedin",
                            `https://www.linkedin.com/in/${e.target.value}`
                          )
                        }
                        placeholder="your-linkedin-username"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaGithub className="me-2" />
                      GitHub
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        https://github.com/
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={personalData.github.replace(
                          "https://github.com/",
                          ""
                        )}
                        onChange={(e) =>
                          handleChange(
                            "github",
                            `https://github.com/${e.target.value}`
                          )
                        }
                        placeholder="your-github-username"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Bio Section */}
            <div className="mb-4">
              <h6 className="text-uppercase text-muted mb-3 d-flex align-items-center">
                <FaQuoteLeft className="me-2" />
                Professional Bio
              </h6>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaPen className="me-2" />
                  Short Bio
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={personalData.shortBio}
                  onChange={(e) => handleChange("shortBio", e.target.value)}
                  placeholder="Write a brief summary about yourself that will appear in the hero section..."
                  required
                />
                <div className="d-flex justify-content-between mt-2">
                  <Form.Text className="text-muted">
                    <FaInfoCircle className="me-1" />
                    A brief summary that will appear in the hero section
                  </Form.Text>
                  <small className="text-muted">
                    {personalData.shortBio.length} characters
                  </small>
                </div>
              </Form.Group>
            </div>
          </Card.Body>
        </Card>

        <div className="action-buttons">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
            className="d-flex align-items-center"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PersonalForm;

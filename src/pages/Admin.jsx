import React, { useState } from 'react';
import { Container, Tab, Tabs, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { removeToken } from '../utils/auth';
import PersonalForm from '../components/admin/PersonalForm';
import AboutForm from '../components/admin/AboutForm';
import ExperiencesForm from '../components/admin/ExperiencesForm';
import ProjectsForm from '../components/admin/ProjectsForm';
import SkillsForm from '../components/admin/SkillsForm';
import EducationForm from '../components/admin/EducationForm';
import CertificatesForm from '../components/admin/CertificatesForm';
import '../styles/Admin.scss';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <Container className="admin-container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Panel</h2>
        <Button variant="outline-danger" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" />
          Logout
        </Button>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="personal" title="Personal">
          {activeTab === 'personal' && <PersonalForm />}
        </Tab>
        <Tab eventKey="about" title="About">
          {activeTab === 'about' && <AboutForm />}
        </Tab>
        <Tab eventKey="experiences" title="Experiences">
          {activeTab === 'experiences' && <ExperiencesForm />}
        </Tab>
        <Tab eventKey="projects" title="Projects">
          {activeTab === 'projects' && <ProjectsForm />}
        </Tab>
        <Tab eventKey="skills" title="Skills">
          {activeTab === 'skills' && <SkillsForm />}
        </Tab>
        <Tab eventKey="education" title="Education">
          {activeTab === 'education' && <EducationForm />}
        </Tab>
        <Tab eventKey="certifications" title="Certificates">
          {activeTab === 'certifications' && <CertificatesForm />}
        </Tab>
      </Tabs>
    </Container>
  );
}

'use client';

import React, { useState } from "react";
import { Container, Tab, Tabs, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaUserEdit,
  FaBriefcase,
  FaCode,
  FaStar,
  FaGraduationCap,
  FaCertificate,
} from "react-icons/fa";
import { removeToken } from "../../utils/auth";
import PersonalForm from "../../components/admin/PersonalForm";
import AboutForm from "../../components/admin/AboutForm";
import ExperiencesForm from "../../components/admin/ExperiencesForm";
import ProjectsForm from "../../components/admin/ProjectsForm";
import SkillsForm from "../../components/admin/SkillsForm";
import EducationForm from "../../components/admin/EducationForm";
import CertificatesForm from "../../components/admin/CertificatesForm";
import ProtectedRoute from "../../components/ProtectedRoute";
import "../../styles/Admin.scss";

function AdminContent() {
  const [activeTab, setActiveTab] = useState("personal");
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  return (
    <Container fluid className="admin-container py-4 py-md-5">
      <div className="admin-header mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div className="mb-3 mb-md-0 d-flex align-items-center">
            <div className="admin-logo me-3">
              <FaSignOutAlt
                className="text-primary"
                style={{ fontSize: "1.75rem" }}
              />
            </div>
            <div>
              <h2 className="mb-0">Admin Dashboard</h2>
              <p className="text-muted mb-0">Manage your portfolio content</p>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-primary"
              onClick={() => router.push("/")}
              className="me-3 view-portfolio-button"
            >
              <FaSignOutAlt className="me-2" />
              View Portfolio
            </Button>
            <Button
              variant="outline-danger"
              onClick={handleLogout}
              className="logout-button"
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="admin-tabs-container">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          variant="pills"
        >
          <Tab
            eventKey="personal"
            title={
              <span className="d-flex align-items-center">
                <FaUserCircle className="me-md-2" />
                <span className="d-none d-md-inline">Personal</span>
              </span>
            }
          >
            {activeTab === "personal" && <PersonalForm />}
          </Tab>
          <Tab
            eventKey="about"
            title={
              <span className="d-flex align-items-center">
                <FaUserEdit className="me-md-2" />
                <span className="d-none d-md-inline">About</span>
              </span>
            }
          >
            {activeTab === "about" && <AboutForm />}
          </Tab>
          <Tab
            eventKey="experiences"
            title={
              <span className="d-flex align-items-center">
                <FaBriefcase className="me-md-2" />
                <span className="d-none d-md-inline">Experience</span>
              </span>
            }
          >
            {activeTab === "experiences" && <ExperiencesForm />}
          </Tab>
          <Tab
            eventKey="projects"
            title={
              <span className="d-flex align-items-center">
                <FaCode className="me-md-2" />
                <span className="d-none d-md-inline">Projects</span>
              </span>
            }
          >
            {activeTab === "projects" && <ProjectsForm />}
          </Tab>
          <Tab
            eventKey="skills"
            title={
              <span className="d-flex align-items-center">
                <FaStar className="me-md-2" />
                <span className="d-none d-md-inline">Skills</span>
              </span>
            }
          >
            {activeTab === "skills" && <SkillsForm />}
          </Tab>
          <Tab
            eventKey="education"
            title={
              <span className="d-flex align-items-center">
                <FaGraduationCap className="me-md-2" />
                <span className="d-none d-md-inline">Education</span>
              </span>
            }
          >
            {activeTab === "education" && <EducationForm />}
          </Tab>
          <Tab
            eventKey="certifications"
            title={
              <span className="d-flex align-items-center">
                <FaCertificate className="me-md-2" />
                <span className="d-none d-md-inline">Certificates</span>
              </span>
            }
          >
            {activeTab === "certifications" && <CertificatesForm />}
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}

import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Skills from '../components/Skills';
import Certificates from '../components/Certificates';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

import { Container, Spinner, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getData } from '../api';

const Home = () => {
  const [resumeData, setResumeData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setResumeData(data);
    };
    
    fetchData();
  }, []);
  
  if (!resumeData) {
    return (
      <div className="loading-container d-flex flex-column justify-content-center align-items-center vh-100">
        <Card className="loading-card text-center p-5 shadow-sm" style={{ maxWidth: '600px' }}>
          <Spinner animation="border" role="status" variant="primary" className="mb-4">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h3 className="mb-3">Generating Portfolio</h3>
          <p className="mb-4">
            This page is being generated on the fly with up-to-date information.
            Pulling the latest data to present my most current work and achievements.
          </p>
          <p className="text-muted mb-0">Made with ❤️ by Manu Devloo</p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="App">
      <Header resumeData={resumeData} />
      <Hero resumeData={resumeData} />
      <Container>
        <About resumeData={resumeData} />
        <Experience resumeData={resumeData} />
        <Education resumeData={resumeData} />
        <Skills resumeData={resumeData} />
        <Certificates resumeData={resumeData} />
        <Projects resumeData={resumeData} />
        <Contact resumeData={resumeData} />
      </Container>
      <Footer resumeData={resumeData} />
    </div>
  );
};

export default Home;

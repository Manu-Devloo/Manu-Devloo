'use client';

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

import { Container } from 'react-bootstrap';

export default function PortfolioContent({ resumeData }) {
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
}

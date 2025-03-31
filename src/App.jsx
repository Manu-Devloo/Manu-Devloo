import React from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Hero />
        <Container>
          <About />
          <Experience />
          <Education />
          <Skills />
          <Certificates />
          <Projects />
          <Contact />
        </Container>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

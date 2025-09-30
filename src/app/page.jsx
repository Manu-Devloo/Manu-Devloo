import PortfolioContent from './PortfolioContent';
import { getResumeData } from './getResumeData';
import { Suspense } from 'react';
import { Container, Spinner, Card } from 'react-bootstrap';

// Generate dynamic metadata based on resume data
export async function generateMetadata() {
  try {
    const resumeData = await getResumeData();
    const personal = resumeData?.personal || {};
    
    return {
      title: `${personal.name || 'Manu Devloo'} | Portfolio`,
      description: personal.bio || 'Portfolio website showcasing projects, experience, and contact information.',
    };
  } catch (error) {
    return {
      title: 'Manu Devloo | Portfolio',
      description: 'Portfolio website showcasing projects, experience, and contact information.',
    };
  }
}

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <div className="loading-container d-flex flex-column justify-content-center align-items-center vh-100">
      <Card className="loading-card text-center p-5 shadow-sm" style={{ maxWidth: '600px' }}>
        <Spinner animation="border" role="status" variant="primary" className="mb-4">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h3 className="mb-3">Generating Portfolio</h3>
        <p className="mb-4">
          This page is being generated on the server with up-to-date information.
          Pulling the latest data to present my most current work and achievements.
        </p>
        <p className="text-muted mb-0">Made with ❤️ by Manu Devloo</p>
      </Card>
    </div>
  );
}

// This is now a Server Component - it runs on the server
export default async function Home() {
  // Fetch data on the server
  const resumeData = await getResumeData();
  
  return (
    <Suspense fallback={<LoadingState />}>
      <PortfolioContent resumeData={resumeData} />
    </Suspense>
  );
}

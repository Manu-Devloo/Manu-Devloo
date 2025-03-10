import resumeData from '../data/resume.json';

/**
 * Downloads the fallback static CV when dynamic generation fails
 */
export function downloadFallbackCV() {
  const { name } = resumeData.personal;
  const fileName = `${name.replace(/\s+/g, '_')}_CV.pdf`;
  const link = document.createElement('a');
  link.href = `/assets/cv/${fileName}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default downloadFallbackCV;

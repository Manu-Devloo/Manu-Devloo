/**
 * CV Generator Utility
 * 
 * This script generates a PDF CV from the resume.json data using jsPDF.
 * All required dependencies are already included in package.json.
 */

import { jsPDF } from 'jspdf';
import resumeData from '../data/resume.json';

/**
 * Generates a PDF CV from the resume data
 * @returns {jsPDF} The PDF document object
 */
export function generateCV() {
  const { personal, about, experiences, education, certificates, skillCategories } = resumeData;
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Set document properties
  doc.setProperties({
    title: `${personal.name} - CV`,
    subject: 'Curriculum Vitae',
    author: personal.name,
    creator: 'Portfolio CV Generator'
  });
  
  // Add profile image if available
  if (personal.profileImage) {
    try {
      // Calculate position for the image (right side of the header)
      const imgX = doc.internal.pageSize.getWidth() - 60;
      const imgY = 20; // 20mm from top
      const imgSize = 40; // 30mm width/height
      
      // Add the actual image first
      doc.addImage(personal.profileImage, 'JPEG', imgX, imgY, imgSize, imgSize, undefined, 'FAST');
      
      // Now draw a white circular border inside the image
      doc.setDrawColor(255, 255, 255); // White color
      doc.setLineWidth(10); // Border width
      
      // Draw white circle border - slightly smaller than the image dimensions
      const innerSize = imgSize + 10; //
      const centerX = imgX + imgSize/2;
      const centerY = imgY + imgSize/2;
      doc.circle(centerX, centerY, innerSize/2, 'S');
      
    } catch (error) {
      console.error('Failed to add profile image to CV:', error);
      // Continue without the image if there's an error
    }
  }
  
  // Add header with name and title
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // primary-color
  doc.text(personal.name, 20, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(personal.title, 20, 30);
  
  // Add contact information
  doc.setFontSize(10);
  doc.setTextColor(80);
  let contactY = 40;
  
  [
    `Address: ${personal.address}`,
    `Phone: ${personal.phone}`,
    `Email: ${personal.email}`,
    `LinkedIn: ${personal.linkedin}`,
    `GitHub: ${personal.github}`
  ].forEach(line => {
    doc.text(line, 20, contactY);
    contactY += 5;
  });
  
  // About section
  contactY += 10;
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138); // secondary-color
  doc.text('About Me', 20, contactY);
  
  doc.setFontSize(10);
  doc.setTextColor(80);
  contactY += 8;
  about.forEach(paragraph => {
    const lines = doc.splitTextToSize(paragraph, 170);
    doc.text(lines, 20, contactY);
    contactY += lines.length * 5 + 5;
  });
  
  // Work Experience
  contactY += 5;
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Work Experience', 20, contactY);
  contactY += 10;
  
  experiences.forEach(exp => {
    // Check if we need a new page
    if (contactY > 250) {
      doc.addPage();
      contactY = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`${exp.company} ${exp.type ? `(${exp.type})` : ''}`, 20, contactY);
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(exp.location, 20, contactY + 5);
    
    let posY = contactY + 10;
    exp.positions.forEach(pos => {
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(`${pos.title} (${pos.period})`, 25, posY);
      
      posY += 5;
      if (pos.responsibilities && pos.responsibilities.length > 0) {
        pos.responsibilities.forEach(resp => {
          doc.setFontSize(10);
          doc.setTextColor(80);
          const respLines = doc.splitTextToSize(`• ${resp}`, 160);
          doc.text(respLines, 30, posY);
          posY += respLines.length * 5;
        });
      }
      posY += 3;
    });
    
    contactY = posY + 5;
  });
  
  // Check if we need a new page
  if (contactY > 250) {
    doc.addPage();
    contactY = 20;
  }
  
  // Education
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Education', 20, contactY);
  contactY += 10;
  
  education.forEach(edu => {
    // Check if we need a new page
    if (contactY > 250) {
      doc.addPage();
      contactY = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(edu.degree, 20, contactY);
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`${edu.institution} (${edu.period})`, 20, contactY + 5);
    
    contactY += 10;
    
    // Add skills if they exist
    if (edu.skills && edu.skills.length > 0) {
      contactY += 3;
      doc.text('Key Skills:', 25, contactY);
      contactY += 5;
      
      edu.skills.forEach(skill => {
        const skillLines = doc.splitTextToSize(`• ${skill}`, 160);
        doc.text(skillLines, 30, contactY);
        contactY += skillLines.length * 5;
      });
    }
    
    contactY += 5;
  });
  
  // Skills
  if (contactY > 220) {
    doc.addPage();
    contactY = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Skills', 20, contactY);
  contactY += 10;
  
  skillCategories.forEach(category => {
    // Check page break
    if (contactY > 270) {
      doc.addPage();
      contactY = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(category.title, 20, contactY);
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    const skillText = category.skills.join(', ');
    const skillLines = doc.splitTextToSize(skillText, 160);
    doc.text(skillLines, 20, contactY + 5);
    
    contactY += skillLines.length * 5 + 10;
  });
  
  // Certificates
  if (contactY > 250) {
    doc.addPage();
    contactY = 20;
  }
  
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text('Certificates', 20, contactY);
  contactY += 10;
  
  certificates.forEach(cert => {
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`${cert.title} - ${cert.issuer}`, 20, contactY);
    contactY += 7;
  });
  
  // Add page numbers only (removed "Generated from" text)
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    
    // Only show page numbers
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 20,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  return doc;
}

/**
 * Generates and saves the CV as a PDF file
 */
export function downloadCV() {
  const doc = generateCV();
  const fileName = `${resumeData.personal.name.replace(/\s+/g, '_')}_CV.pdf`;
  doc.save(fileName);
}

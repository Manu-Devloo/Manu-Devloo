import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import downloadFallbackCV from './downloadFallbackCV';

/**
 * Generates a PDF CV from the resume data
 * @returns The PDF document object
 */
export function generateCV(resumeData) {
  const { personal, about, experiences, education, certifications, skills } = resumeData;

  // Create a container element for the CV
  const cvContainer = document.createElement('div');
  cvContainer.className = 'cv-container';
  cvContainer.style.cssText = `
    width: 210mm;
    min-height: 297mm;
    font-family: 'Arial', sans-serif;
    color: #333;
    background: white;
    position: absolute;
    top: -9999px;
    left: -9999px;
    overflow: visible;
    display: flex;
    page-break-after: always;
  `;

  // Add CSS to the document head
  const style = document.createElement('style');
  style.textContent = `
    .cv-container {
      font-size: 12px;
      line-height: 1.5;
      display: flex;
      padding: 0;
      margin: 0;
    }
    .cv-left-column {
      width: 33%;
      background: linear-gradient(160deg, #4c5760 80%, #6c7983 100%);
      box-shadow: 2px 0 16px 0 rgba(44,62,80,0.08);
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      color: white;
      padding: 20px;
      box-sizing: border-box;
      position: relative;
      min-height: 297mm; /* A4 height */
      height: 100%;
      /* Ensure sidebar extends to full height */
      display: flex;
      flex-direction: column;
    }
    .cv-right-column {
      width: 67%;
      background: #f8f9fa;
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      box-shadow: 0 2px 16px 0 rgba(44,62,80,0.08);
      padding: 20px;
      box-sizing: border-box;
      min-height: 297mm; /* A4 height */
      height: 100%;
    }
    .cv-photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 18px auto 18px auto;
      display: block;
      object-fit: cover;
      border: 4px solid #ffd166;
      box-shadow: 0 2px 8px 0 rgba(44,62,80,0.10);
      background-color: #fff;
    }
    .cv-name {
      font-size: 30px;
      font-weight: 700;
      margin: 0 0 8px 0;
      text-align: center;
      color: #fff;
      letter-spacing: 1px;
    }
    .cv-title {
      font-size: 16px;
      color: #ffd166;
      margin: 0 0 18px 0;
      text-align: center;
      font-weight: 500;
    }
    .cv-contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 13px;
      border-radius: 6px;
      padding: 6px 8px;
      background: rgba(255,255,255,0.08);
      transition: background 0.2s;
    }
    .cv-contact-item:hover {
      background: rgba(255,255,255,0.18);
    }
    .cv-contact-icon {
      width: 20px;
      margin-right: 8px;
      font-weight: bold;
      text-align: center;
      font-size: 15px;
      color: #ffd166;
    }
    .cv-section {
      margin: 32px 0 0 0;
      padding-bottom: 8px;
    }
    .cv-left-section-title, .cv-right-section-title {
      letter-spacing: 1px;
      font-size: 17px;
      font-weight: 700;
      border: none;
      background: none;
      padding: 0 0 8px 0;
      margin-bottom: 12px;
      border-left: 4px solid #e0e0e0;
      padding-left: 10px;
      border-radius: 2px;
      background: none;
    }
    .cv-left-section-title {
      color: #fff;
      border-left: 4px solid #ffd166;
    }
    .cv-right-section-title {
      color: #4c5760;
      border-left: 4px solid #4c5760;
    }
    .cv-profile {
      text-align: justify;
      font-size: 13px;
      line-height: 1.6;
      background: rgba(255,255,255,0.10);
      border-radius: 6px;
      padding: 10px 12px;
      color: #fff;
      margin-bottom: 8px;
    }
    .cv-language {
      margin-bottom: 8px;
    }
    .cv-language-name {
      display: inline-block;
      width: 100px;
      font-size: 14px;
    }
    .cv-language-level {
      display: inline-flex;
    }
    .cv-dot {
      height: 10px;
      width: 10px;
      background: #ffd166;
      border: 1px solid #fff;
      border-radius: 50%;
      margin-right: 5px;
      opacity: 1;
    }
    .cv-dot.empty {
      background: #fff;
      border: 1px solid #ffd166;
      opacity: 0.3;
    }
    .cv-reference, .cv-interest {
      background: rgba(255,255,255,0.10);
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }
    .cv-reference-name, .cv-interest-name {
      color: #ffd166;
      font-size: 14px;
      margin-bottom: 2px;
    }
    .cv-reference-position, .cv-reference-contact {
      color: #fff;
      font-size: 12px;
    }
    .cv-experience-item, .cv-education-item {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px 0 rgba(44,62,80,0.06);
      padding: 16px 18px;
      margin-bottom: 18px;
      border-left: 4px solid #ffd166;
    }
    .cv-experience-header, .cv-education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }
    .cv-company-name, .cv-institution-name {
      color: #4c5760;
      font-size: 16px;
      font-weight: 700;
    }
    .cv-period {
      font-style: italic;
      color: #888;
      font-size: 13px;
    }
    .cv-position-title {
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 14px;
      color: #222;
    }
    .cv-location {
      font-style: italic;
      color: #555;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .cv-responsibilities {
      margin-top: 5px;
      padding-left: 20px;
    }
    .cv-responsibilities li {
      margin-bottom: 3px;
      font-size: 13px;
      color: #444;
    }
    .cv-skills-group {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px 0 rgba(44,62,80,0.06);
      padding: 10px 14px;
      margin-bottom: 12px;
      border-left: 4px solid #ffd166;
    }
    .cv-skills-title {
      font-weight: 700;
      margin-bottom: 4px;
      font-size: 14px;
      color: #4c5760;
    }
    .cv-skills-items {
      padding-left: 0;
      margin-top: 5px;
    }
    .cv-skills-items li {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 5px;
      font-size: 13px;
      color: #222;
    }
    .cv-certificates-list {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px 0 rgba(44,62,80,0.06);
      padding: 10px 14px;
      border-left: 4px solid #ffd166;
    }
    .cv-certificate-item {
      margin-bottom: 8px;
      font-size: 13px;
    }
    .cv-certificate-link {
      color: #4c5760;
      text-decoration: none;
      font-weight: 500;
    }
    .cv-certificate-link:hover {
      text-decoration: underline;
      color: #ffd166;
    }
  `;
  document.head.appendChild(style);
  
  // Create the left column
  const leftColumn = document.createElement('div');
  leftColumn.className = 'cv-left-column';

  // Add name and title at top of left column
  const name = document.createElement('h1');
  name.className = 'cv-name';
  name.textContent = personal.name;
  leftColumn.appendChild(name);
  
  const title = document.createElement('div');
  title.className = 'cv-title';
  title.textContent = personal.title;
  leftColumn.appendChild(title);
  
  // Add profile photo
  if (personal.profileImage) {
    const photo = document.createElement('img');
    photo.className = 'cv-photo';
    photo.crossOrigin = 'anonymous'; // Enable CORS for the image
    photo.src = personal.profileImage;
    photo.alt = personal.name;
    photo.onload = () => console.log('Profile image loaded successfully');
    photo.onerror = (e) => console.error('Error loading profile image', e);
    leftColumn.appendChild(photo);
  }
  
  // Add contact information with icons
  const contactSection = document.createElement('div');
  contactSection.className = 'cv-section';
  
  // Email
  const emailItem = document.createElement('div');
  emailItem.className = 'cv-contact-item';
  const emailIcon = document.createElement('span');
  emailIcon.className = 'cv-contact-icon';
  emailIcon.innerHTML = '✉️';
  emailItem.appendChild(emailIcon);
  const emailText = document.createElement('span');
  emailText.innerHTML = `<a href='mailto:${personal.email}' style='color:inherit;text-decoration:none;'>${personal.email}</a>`;
  emailItem.appendChild(emailText);
  contactSection.appendChild(emailItem);
  
  // Phone
  const phoneItem = document.createElement('div');
  phoneItem.className = 'cv-contact-item';
  const phoneIcon = document.createElement('span');
  phoneIcon.className = 'cv-contact-icon';
  phoneIcon.innerHTML = '📞';
  phoneItem.appendChild(phoneIcon);
  const phoneText = document.createElement('span');
  phoneText.innerHTML = `<a href='tel:${personal.phone.replace(/\s+/g, '')}' style='color:inherit;text-decoration:none;'>${personal.phone}</a>`;
  phoneItem.appendChild(phoneText);
  contactSection.appendChild(phoneItem);
  
  // Location
  const locationItem = document.createElement('div');
  locationItem.className = 'cv-contact-item';
  const locationIcon = document.createElement('span');
  locationIcon.className = 'cv-contact-icon';
  locationIcon.innerHTML = '📍';
  locationItem.appendChild(locationIcon);
  const locationText = document.createElement('span');
  locationText.textContent = personal.address.split(',').pop().trim();
  locationItem.appendChild(locationText);
  contactSection.appendChild(locationItem);
  
  // Website
  const websiteItem = document.createElement('div');
  websiteItem.className = 'cv-contact-item';
  const websiteIcon = document.createElement('span');
  websiteIcon.className = 'cv-contact-icon';
  websiteIcon.innerHTML = '🌐';
  websiteItem.appendChild(websiteIcon);
  const websiteText = document.createElement('span');
  websiteText.innerHTML = `<a href='https://${personal.website.replace(/^(https?:\/\/)?/, '')}' target='_blank' style='color:inherit;text-decoration:none;'>${personal.website}</a>`;
  websiteItem.appendChild(websiteText);
  contactSection.appendChild(websiteItem);
  
  // LinkedIn
  const linkedinItem = document.createElement('div');
  linkedinItem.className = 'cv-contact-item';
  const linkedinIcon = document.createElement('span');
  linkedinIcon.className = 'cv-contact-icon';
  linkedinIcon.innerHTML = 'in';
  linkedinItem.appendChild(linkedinIcon);
  const linkedinText = document.createElement('span');
  linkedinText.innerHTML = `<a href='${personal.linkedin}' target='_blank' style='color:inherit;text-decoration:none;'>${personal.linkedin.replace('https://www.', '').replace('https://', '').replace('linkedin.com/in/', 'linkedin.com/in/')}</a>`;
  linkedinItem.appendChild(linkedinText);
  contactSection.appendChild(linkedinItem);
  
  // GitHub
  const githubItem = document.createElement('div');
  githubItem.className = 'cv-contact-item';
  const githubIcon = document.createElement('span');
  githubIcon.className = 'cv-contact-icon';
  githubIcon.innerHTML = 'gh';
  githubItem.appendChild(githubIcon);
  const githubText = document.createElement('span');
  githubText.innerHTML = `<a href='${personal.github}' target='_blank' style='color:inherit;text-decoration:none;'>${personal.github.replace('https://www.', '').replace('https://', '')}</a>`;
  githubItem.appendChild(githubText);
  contactSection.appendChild(githubItem);
  
  leftColumn.appendChild(contactSection);
  
  // Create the right column
  const rightColumn = document.createElement('div');
  rightColumn.className = 'cv-right-column';
  
  // About section for left column
  if (about && about.length) {
    const aboutSection = document.createElement('div');
    aboutSection.className = 'cv-section';
    
    const aboutTitle = document.createElement('h2');
    aboutTitle.className = 'cv-left-section-title';
    aboutTitle.textContent = 'Profile';
    aboutTitle.innerHTML = '👤 ' + aboutTitle.innerHTML;
    aboutSection.appendChild(aboutTitle);
    
    const aboutText = document.createElement('div');
    aboutText.className = 'cv-profile';
    aboutText.textContent = about.join(' ');
    aboutSection.appendChild(aboutText);
    
    leftColumn.appendChild(aboutSection);
  }

  // Languages section for left column
  const languageSection = document.createElement('div');
  languageSection.className = 'cv-section';
  
  const languageTitle = document.createElement('h2');
  languageTitle.className = 'cv-left-section-title';
  languageTitle.innerHTML = '🌐 Languages';
  languageSection.appendChild(languageTitle);

  // Add languages from skills
  const languagesSkill = skills.find(category => category.title === 'Languages');
  if (languagesSkill && languagesSkill.skills.length) {
    languagesSkill.skills.forEach(lang => {
      const language = document.createElement('div');
      language.className = 'cv-language';
      
      const langName = document.createElement('span');
      langName.className = 'cv-language-name';
      langName.textContent = lang.split('(')[0].trim();
      language.appendChild(langName);
      
      // Add language level dots
      const langLevel = document.createElement('div');
      langLevel.className = 'cv-language-level';
      
      const isNative = lang.includes('native');
      const isFluent = lang.includes('fluent');
      
      // Create 5 dots, fill them based on language level
      for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div');
        dot.className = 'cv-dot';
        
        if (isNative) {
          // All dots filled for native
        } else if (isFluent && i >= 4) {
          // 4 dots for fluent (last one empty)
          dot.className += ' empty';
        } else if (!isNative && !isFluent) {
          // Default case - assume basic proficiency (3 dots)
          if (i >= 3) {
            dot.className += ' empty';
          }
        }
        
        langLevel.appendChild(dot);
      }
      
      language.appendChild(langLevel);
      languageSection.appendChild(language);
    });
  }
  
  leftColumn.appendChild(languageSection);
  
  // References section (dynamic, pretty)
  if (resumeData.references && resumeData.references.length) {
    const referenceSection = document.createElement('div');
    referenceSection.className = 'cv-section';
    const referenceTitle = document.createElement('h2');
    referenceTitle.className = 'cv-left-section-title';
    referenceTitle.innerHTML = '📋 References';
    referenceSection.appendChild(referenceTitle);
    resumeData.references.forEach(ref => {
      const reference = document.createElement('div');
      reference.className = 'cv-reference';
      const refName = document.createElement('div');
      refName.className = 'cv-reference-name';
      refName.textContent = ref.name;
      reference.appendChild(refName);
      if (ref.position) {
        const refPosition = document.createElement('div');
        refPosition.className = 'cv-reference-position';
        refPosition.textContent = ref.position;
        reference.appendChild(refPosition);
      }
      if (ref.contact) {
        const refContact = document.createElement('div');
        refContact.className = 'cv-reference-contact';
        refContact.textContent = ref.contact;
        reference.appendChild(refContact);
      }
      referenceSection.appendChild(reference);
    });
    leftColumn.appendChild(referenceSection);
  }

  // Interests section (dynamic, pretty)
  if (resumeData.interests && resumeData.interests.length) {
    const interestSection = document.createElement('div');
    interestSection.className = 'cv-section';
    const interestTitle = document.createElement('h2');
    interestTitle.className = 'cv-left-section-title';
    interestTitle.innerHTML = '🎯 Interests';
    interestSection.appendChild(interestTitle);
    resumeData.interests.forEach(interestObj => {
      const interest = document.createElement('div');
      interest.className = 'cv-interest';
      const interestName = document.createElement('div');
      interestName.className = 'cv-interest-name';
      interestName.textContent = interestObj.name;
      interest.appendChild(interestName);
      if (interestObj.details) {
        const interestDetails = document.createElement('div');
        interestDetails.textContent = interestObj.details;
        interest.appendChild(interestDetails);
      }
      interestSection.appendChild(interest);
    });
    leftColumn.appendChild(interestSection);
  }
  
  // Professional Experience section for right column
  if (experiences && experiences.length) {
    const expSection = document.createElement('div');
    expSection.className = 'cv-section';
    
    const expTitle = document.createElement('h2');
    expTitle.className = 'cv-right-section-title';
    expTitle.innerHTML = '💼 Professional Experience';
    expSection.appendChild(expTitle);
    
    experiences.forEach(exp => {
      const expItem = document.createElement('div');
      expItem.className = 'cv-experience-item';
      
      const expHeader = document.createElement('div');
      expHeader.className = 'cv-experience-header';
      
      const companyName = document.createElement('div');
      companyName.className = 'cv-company-name';
      companyName.textContent = exp.company + (exp.type ? ` (${exp.type})` : '');
      
      const expPeriod = document.createElement('div');
      expPeriod.className = 'cv-period';
      const position = exp.positions[0]; // Get the first/latest position
      expPeriod.textContent = position.period;
      
      expHeader.appendChild(companyName);
      expHeader.appendChild(expPeriod);
      expItem.appendChild(expHeader);
      
      exp.positions.forEach(position => {
        const positionTitle = document.createElement('div');
        positionTitle.className = 'cv-position-title';
        positionTitle.textContent = position.title;
        expItem.appendChild(positionTitle);
        
        if (position.responsibilities && position.responsibilities.length) {
          const respList = document.createElement('ul');
          respList.className = 'cv-responsibilities';
          
          position.responsibilities.forEach(resp => {
            const respItem = document.createElement('li');
            respItem.textContent = resp;
            respList.appendChild(respItem);
          });
          
          expItem.appendChild(respList);
        }
      });
      
      expSection.appendChild(expItem);
    });
    
    rightColumn.appendChild(expSection);
  }
  
  // Education section for right column
  if (education && education.length) {
    const eduSection = document.createElement('div');
    eduSection.className = 'cv-section';
    
    const eduTitle = document.createElement('h2');
    eduTitle.className = 'cv-right-section-title';
    eduTitle.innerHTML = '🎓 Education';
    eduSection.appendChild(eduTitle);
    
    education.forEach(edu => {
      const eduItem = document.createElement('div');
      eduItem.className = 'cv-education-item';
      
      const eduHeader = document.createElement('div');
      eduHeader.className = 'cv-education-header';
      
      const institution = document.createElement('div');
      institution.className = 'cv-institution-name';
      institution.textContent = edu.institution;
      eduHeader.appendChild(institution);
      
      const period = document.createElement('div');
      period.className = 'cv-period';
      period.textContent = edu.period;
      eduHeader.appendChild(period);
      
      eduItem.appendChild(eduHeader);
      
      const degree = document.createElement('div');
      degree.className = 'cv-position-title';
      degree.textContent = edu.degree;
      eduItem.appendChild(degree);
      
      eduSection.appendChild(eduItem);
    });
    
    rightColumn.appendChild(eduSection);
  }
  
  // Skills section for right column
  if (skills && skills.length) {
    const skillsSection = document.createElement('div');
    skillsSection.className = 'cv-section';
    
    const skillsTitle = document.createElement('h2');
    skillsTitle.className = 'cv-right-section-title';
    skillsTitle.innerHTML = '🔧 Skills';
    skillsSection.appendChild(skillsTitle);
    
    // Filter out the Languages category as it's displayed separately
    const technicalSkills = skills.filter(category => category.title !== 'Languages');
    
    technicalSkills.forEach(category => {
      const skillGroup = document.createElement('div');
      skillGroup.className = 'cv-skills-group';
      
      const groupTitle = document.createElement('div');
      groupTitle.className = 'cv-skills-title';
      groupTitle.textContent = category.title;
      skillGroup.appendChild(groupTitle);
      
      if (category.skills && category.skills.length) {
        const skillsList = document.createElement('ul');
        skillsList.className = 'cv-skills-items';
        
        category.skills.forEach(skill => {
          const skillItem = document.createElement('li');
          skillItem.textContent = skill;
          skillsList.appendChild(skillItem);
        });
        
        skillGroup.appendChild(skillsList);
      }
      
      skillsSection.appendChild(skillGroup);
    });
    
    rightColumn.appendChild(skillsSection);
  }
  
  // Certifications section for right column
  if (certifications && certifications.length) {
    const certSection = document.createElement('div');
    certSection.className = 'cv-section';
    
    const certTitle = document.createElement('h2');
    certTitle.className = 'cv-right-section-title';
    certTitle.innerHTML = '🏆 Certificates';
    certSection.appendChild(certTitle);
    
    const certList = document.createElement('ul');
    certList.className = 'cv-certificates-list';
    
    certifications.forEach(cert => {
      const certItem = document.createElement('li');
      certItem.className = 'cv-certificate-item';
      
      const certLink = document.createElement('a');
      certLink.className = 'cv-certificate-link';
      certLink.href = cert.url;
      certLink.target = '_blank';
      certLink.textContent = `${cert.title} - ${cert.issuer}`;
      
      certItem.appendChild(certLink);
      certList.appendChild(certItem);
    });
    
    certSection.appendChild(certList);
    rightColumn.appendChild(certSection);
  }
  
  cvContainer.appendChild(leftColumn);
  cvContainer.appendChild(rightColumn);
  
  // Add the CV container to the document body temporarily
  document.body.appendChild(cvContainer);
  
  // Create the PDF using html2canvas and jsPDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
    floatPrecision: 16 // For better text precision
  });
  
  return new Promise((resolve, reject) => {
    // Try to use a local image instead of external URLs to avoid CORS issues
    try {
      // Use local profile image from public folder
      const localImage = '/assets/images/profile.jpeg';
      const img = cvContainer.querySelector('.cv-photo');
      if (img) {
        // Create a new Image to preload
        const preloadImg = new Image();
        preloadImg.crossOrigin = 'Anonymous';
        preloadImg.onload = function() {
          // Once loaded, set the src on the actual CV photo
          img.src = preloadImg.src;
          console.log('Preloaded profile image successfully');
        };
        preloadImg.onerror = function() {
          console.warn('Failed to preload local image, falling back to original');
        };
        preloadImg.src = localImage;
      }
    } catch (err) {
      console.error('Error setting local profile image:', err);
    }
    
    // Create event handlers for waiting until image is loaded
    const profileImg = cvContainer.querySelector('.cv-photo');
    const imagePromise = profileImg ? new Promise((imgResolve) => {
      if (profileImg.complete) {
        imgResolve();
      } else {
        profileImg.onload = imgResolve;
        profileImg.onerror = () => {
          console.warn('Failed to load profile image, continuing without it');
          profileImg.style.display = 'none'; // Hide the image if it fails to load
          imgResolve();
        };
        
        // Set a timeout just in case the image never loads
        setTimeout(imgResolve, 3000);
      }
    }) : Promise.resolve();
    
    // Wait for image to load before rendering
    imagePromise.then(() => {
      // Ensure the PDF has proper font support
      doc.setFont('helvetica');

      html2canvas(cvContainer, {
        scale: 2, // Higher scale for better quality
        logging: true, // Enable logging to see any issues
        useCORS: true,
        allowTaint: true,
        imageTimeout: 5000, // 5 second timeout for images
        backgroundColor: '#FFFFFF', // Ensure white background
      }).then(canvas => {
        try {
          // Calculate page size and split if needed
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          const pxFullHeight = canvas.height;
          const pxPageHeight = Math.floor(canvas.width * pageHeight / pageWidth);
          const nPages = Math.ceil(pxFullHeight / pxPageHeight);

          for (let i = 0; i < nPages; i++) {
            if (i > 0) doc.addPage();
            const srcY = pxPageHeight * i;
            const sHeight = Math.min(pxPageHeight, pxFullHeight - srcY);
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = sHeight;
            const ctx = pageCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, srcY, canvas.width, sHeight, 0, 0, canvas.width, sHeight);
            const imgData = pageCanvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
          }

          // Remove the temporary CV container from the DOM
          if (cvContainer.parentNode) cvContainer.parentNode.removeChild(cvContainer);

          console.log('PDF generation successful');
          resolve(doc);
        } catch (error) {
          if (cvContainer.parentNode) cvContainer.parentNode.removeChild(cvContainer);
          console.error('Error in PDF creation:', error);
          reject(error);
        }
      }).catch(error => {
        if (cvContainer.parentNode) cvContainer.parentNode.removeChild(cvContainer);
        console.error('Error generating canvas:', error);
        reject(error);
      });
    }).catch(error => {
      if (cvContainer.parentNode) cvContainer.parentNode.removeChild(cvContainer);
      console.error('Image loading error:', error);
      reject(error);
    });
  });
}

/**
 * Generates and saves the CV as a PDF file
 */
export function downloadCV(resumeData) {
  if (!resumeData) {
    console.error('Resume data is required for CV generation');
    throw new Error('Resume data is required for CV generation');
  }

  // Show a loading indicator
  const loadingToast = document.createElement('div');
  loadingToast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #2c3e50;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  loadingToast.textContent = 'Generating CV...';
  document.body.appendChild(loadingToast);

  // Set a timeout to handle cases where generation takes too long
  const timeoutId = setTimeout(() => {
    console.warn('CV generation taking too long, using fallback method...');
    document.body.removeChild(loadingToast);
    downloadFallbackCV();
  }, 15000); // 15 seconds timeout

  generateCV(resumeData)
    .then(doc => {
      // Clear the timeout as generation completed successfully
      clearTimeout(timeoutId);
      
      const fileName = `${resumeData.personal.name.replace(/\s+/g, '_')}_CV.pdf`;
      doc.save(fileName);
      
      // Remove loading indicator and show success message
      document.body.removeChild(loadingToast);
      
      const successToast = document.createElement('div');
      successToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 10px 20px;
      border-radius: 4px;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    successToast.textContent = 'CV downloaded successfully!';
    document.body.appendChild(successToast);
    
    setTimeout(() => {
      document.body.removeChild(successToast);
    }, 3000);
  })
    .catch(error => {
      // Clear the timeout as generation completed (with error)
      clearTimeout(timeoutId);
      
      console.error('Error generating CV:', error);
      
      // Only try to remove if it's still in the DOM
      try {
        document.body.removeChild(loadingToast);
      } catch (e) {
        // Element might have been removed already
      }
      
      const errorToast = document.createElement('div');
      errorToast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #c0392b;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      `;
      errorToast.textContent = 'CV generation failed. Using fallback method...';
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        document.body.removeChild(errorToast);
      }, 3000);
      
      // Fall back to the static PDF download
      downloadFallbackCV();
    });
}

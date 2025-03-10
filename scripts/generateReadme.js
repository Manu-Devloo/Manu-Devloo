const fs = require('fs');
const path = require('path');
const resumeData = require('../src/data/resume.json');

// Calculate age function
const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const generateReadme = () => {
  const { personal, about, experiences, education, certificates, skillCategories } = resumeData;
  const age = calculateAge('2005-12-16');

  // Generate skills section
  const skillsSection = skillCategories.map(category => {
    return `
### ${category.title}
${category.skills.join(' • ')}
`;
  }).join('\n');

  // Generate experience section
  const experienceSection = experiences.map(exp => {
    const positions = exp.positions.map(pos => {
      return `
#### ${pos.title} (${pos.period})
${pos.responsibilities.map(r => `- ${r}`).join('\n')}
`;
    }).join('\n');

    return `
### ${exp.company} - ${exp.location}
*${exp.type}*
${positions}
`;
  }).join('\n');

  // Generate education section
  const educationSection = education.map(edu => {
    return `
### ${edu.institution}
**${edu.degree}** (${edu.period})
${edu.skills ? edu.skills.map(skill => `- ${skill}`).join('\n') : ''}
`;
  }).join('\n');

  // Generate certificates section
  const certificatesSection = certificates.map(cert => {
    return `- [${cert.title}](${cert.url}) - ${cert.issuer}`;
  }).join('\n');

  const readmeContent = `
# ${personal.name}

**${personal.title}** | Age: ${age} | ${personal.location || personal.address}

## About Me

${about.join('\n\n')}

## Contact

- 📧 Email: [${personal.email}](mailto:${personal.email})
- 📱 Phone: ${personal.phone}
- 💼 LinkedIn: [${personal.linkedin.split('/').pop()}](${personal.linkedin})
- 🌐 GitHub: [${personal.github.split('/').pop()}](${personal.github})
${personal.website ? `- 🔗 Website: [${personal.website}](${personal.website})` : ''}

## Skills
${skillsSection}

## Experience
${experienceSection}

## Education
${educationSection}

## Certificates
${certificatesSection}

## Projects

- **Rak Sunakh Website**: [thai-ridgeback.eu](https://thai-ridgeback.eu)
- **DevKin Website**: [devkin.be](https://devkin.be)
`;

  fs.writeFileSync(path.join(__dirname, '../README.md'), readmeContent.trim());
};

generateReadme();
// Regenerates README.md from src/data/resume.json.
// Invoked via `npm run generate-readme` (and the GitHub Action).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'src/data/resume.json');
const README_PATH = path.join(ROOT, 'README.md');
const BIRTHDATE = '2005-12-16';

const calculateAge = (iso) => {
  const today = new Date();
  const birth = new Date(iso);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const resume = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const { personal, about, experiences, education, certifications, skills, projects } = resume;
const age = calculateAge(BIRTHDATE);

const skillsSection = skills
  .map((c) => `\n### ${c.title}\n${c.skills.join(' • ')}\n`)
  .join('\n');

const experienceSection = experiences
  .map((exp) => {
    const positions = exp.positions
      .map(
        (p) =>
          `- **${p.title}** — ${p.period}\n${p.responsibilities.map((r) => `  - ${r}`).join('\n')}`,
      )
      .join('\n');
    const type = exp.type ? ` _(${exp.type})_` : '';
    return `\n### ${exp.company}${type} — ${exp.location}\n${positions}\n`;
  })
  .join('\n');

const educationSection = education
  .map((e) => {
    const skillLines = e.skills ? e.skills.map((s) => `- ${s}`).join('\n') : '';
    return `\n### ${e.institution}\n**${e.degree}** (${e.period})\n${skillLines}\n`;
  })
  .join('\n');

const certificationsSection = certifications
  .map((c) => `- [${c.title}](${c.url}) — ${c.issuer}`)
  .join('\n');

const projectsSection = projects
  .map((p) => {
    const gh = p.github ? ` · [source](${p.github})` : '';
    return `- **${p.title}** (${p.year}) — [${new URL(p.url).host}](${p.url})${gh}\n  ${p.description}`;
  })
  .join('\n');

const linkedinSlug = personal.linkedin.split('/').filter(Boolean).pop();
const githubSlug = personal.github.split('/').filter(Boolean).pop();

const location = personal.address
  ? personal.address.split(',').slice(-3).join(',').trim()
  : '';

const content = `# ${personal.name}

**${personal.title}** · Age ${age} · ${location}

> ${personal.shortBio}

## About

${about.join('\n\n')}

## Contact

- Email · [${personal.email}](mailto:${personal.email})
- Phone · ${personal.phone}
- LinkedIn · [${linkedinSlug}](${personal.linkedin})
- GitHub · [${githubSlug}](${personal.github})
- Website · [${personal.website.replace(/^https?:\/\//, '')}](${personal.website})

## Experience
${experienceSection}

## Skills
${skillsSection}

## Education
${educationSection}

## Certifications

${certificationsSection}

## Selected Projects

${projectsSection}

---

_This README is auto-generated from [\`src/data/resume.json\`](src/data/resume.json). Edit the JSON, run \`npm run generate-readme\`, commit._
`;

const current = fs.existsSync(README_PATH)
  ? fs.readFileSync(README_PATH, 'utf-8').trim()
  : '';

if (current === content.trim()) {
  console.log('README is up to date.');
  process.exit(0);
}

fs.writeFileSync(README_PATH, content.trim() + '\n');
console.log('README.md regenerated.');

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.scss';
import { ThemeProvider } from '../contexts/ThemeContext';

export const metadata = {
  metadataBase: new URL('https://manudevloo.com'),
  title: 'Manu Devloo | Portfolio',
  description: 'Portfolio website of Manu Devloo, showcasing projects, experience, and contact information. Web Developer & Software Engineer specializing in JavaScript, React, and Node.js.',
  keywords: 'Manu Devloo, Portfolio, Web Developer, Software Engineer, JavaScript, React, Node.js, Backend, Frontend, Projects, CV, Resume, GitHub, LinkedIn, Software Development',
  authors: [{ name: 'Manu Devloo' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Manu Devloo | Portfolio',
    description: 'Explore Manu Devloo\'s portfolio, featuring projects, experience, and contact details. Web Developer & Software Engineer.',
    type: 'website',
    url: 'https://manudevloo.com/',
    images: ['/assets/images/hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manu Devloo | Portfolio',
    description: 'Portfolio website of Manu Devloo, Web Developer & Software Engineer.',
    images: ['/assets/images/hero.png'],
  },
  alternates: {
    canonical: 'https://manudevloo.com/',
  },
}

export const viewport = {
  themeColor: '#000000',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Manu Devloo",
              "url": "https://manudevloo.com/",
              "image": "https://manudevloo.com/assets/images/hero.png",
              "sameAs": [
                "https://github.com/Manu-Devloo",
                "https://www.linkedin.com/in/manu-devloo/"
              ],
              "jobTitle": "Web Developer & Software Engineer",
              "description": "Portfolio website of Manu Devloo, Web Developer & Software Engineer. View projects, experience, and contact information."
            })
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

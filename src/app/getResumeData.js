// Server-side data fetching utility
export async function getResumeData() {
  try {
    const baseURL = process.env.NEXT_PUBLIC_NETLIFY_API_URL || 'http://localhost:8888/.netlify';
    const url = `${baseURL}/functions/getData`;
    
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data (SSR)
      // Or use: cache: 'force-cache' for static generation
      // Or use: next: { revalidate: 60 } for ISR (revalidate every 60 seconds)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching resume data:', error);
    // Return fallback data or throw
    throw error;
  }
}

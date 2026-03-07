// src/app/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// 1. Define the structure of your frontmatter
interface ShowcaseFrontmatter {
  winner_title: string;
  winner_image: string;
  winner_description: string;
  body?: string; 
}

async function getShowcaseData() {
  const filePath = path.join(process.cwd(), 'content/showcase/showcase.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // 2. Cast the frontmatter to your interface
  const { data, content } = matter(fileContent);
  const frontmatter = data as ShowcaseFrontmatter;
  
  return { ...frontmatter, body: content };
}

export default async function Home() {
  const showcase = await getShowcaseData();

  return (
    <div>
      <main style={{ padding: '2rem' }}>
        <h1>Welcome to the Projects Portal</h1>
        
        {/* Displaying Showcase Data */}
        <section style={{ marginTop: '2rem', padding: '1rem' }}>
          <h2>{showcase.winner_title}</h2>
          {showcase.winner_image && <img src={showcase.winner_image} alt="Winner" width="300" />}
          <p>{showcase.winner_description}</p>
          <div>{showcase.body}</div>
        </section>
      </main>
    </div>
  );
}
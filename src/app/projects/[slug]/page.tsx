// src/app/projects/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

interface ProjectData {
  title: string;
  body: string;
  preview_image?: string;
  team?: string[];
  // Add other fields as defined in your config.yml
}

async function getProjectData(slug: string) {
  const filePath = path.join(process.cwd(), 'content/projects', slug, 'index.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const { data, content } = matter(fileContent);
  
  // Convert Markdown body to HTML
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();
  
  return { ...data, body: contentHtml } as ProjectData;
}

export default async function ProjectDetailsPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params; // Await the promise!
  const project = await getProjectData(slug);

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{project.title}</h1>
      {project.preview_image && (
        <img src={project.preview_image} alt={project.title} style={{ width: '100%', borderRadius: '8px' }} />
      )}
      
      <div dangerouslySetInnerHTML={{ __html: project.body }} />
      
      {project.team && (
        <div>
          <h3>Team Members</h3>
          <ul>{project.team.map((member, i) => <li key={i}>{member}</li>)}</ul>
        </div>
      )}
    </main>
  );
}
import styles from "../../styles/projects.module.css";

// src/app/projects/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// Define the shape of your project data
interface Project {
  title: string;
  preview_image: string;
  slug: string;
}

async function getProjects() {
  const projectsDir = path.join(process.cwd(), 'content/projects');
  // Read all folders in the content/projects directory
  const folders = fs.readdirSync(projectsDir);

  return folders.map((folder) => {
    // Assuming each project has an index.md inside its folder
    const fileContent = fs.readFileSync(path.join(projectsDir, folder, 'index.md'), 'utf-8');
    const { data } = matter(fileContent);
    return {
      title: data.title,
      preview_image: data.preview_image,
      slug: folder,
    };
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>All Projects</h1>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {projects.map((project) => (
          <div key={project.slug} style={{ border: '1px solid #ddd', padding: '1rem' }}>
            <img src={project.preview_image} alt={project.title} style={{ width: '100%' }} />
            <h2>{project.title}</h2>
            <Link href={`/projects/${project.slug}`}>View Details</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
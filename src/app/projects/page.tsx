import styles from "../../styles/projects.module.css";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ProjectsClient from '../../components/ProjectsClient';

interface Project {
  title: string;
  preview_image: string;
  team: string[];
  team_leader?: string;
  start_date: string;
  type: string;
  status: 'active' | 'planned' | 'past';
  body: string;
  slug: string;
}

async function getProjects(): Promise<Project[]> {
  const projectsDir = path.join(process.cwd(), 'content/projects');

  if (!fs.existsSync(projectsDir)) {
    console.warn('No content/projects directory found');
    return [];
  }

  const folders = fs.readdirSync(projectsDir)
    .filter(folder =>
      fs.statSync(path.join(projectsDir, folder)).isDirectory()
    );

  return folders.map((folder) => {
    const filePath = path.join(projectsDir, folder, 'index.md');

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      title: data.title,
      preview_image: data.preview_image,
      team: data.team,
      team_leader: data.team_leader,
      start_date: data.start_date instanceof Date ? data.start_date.toISOString() : String(data.start_date ?? ''),
      type: data.type,
      status: data.status,
      body: content,
      slug: folder,
    };
  }).filter(Boolean) as Project[];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className={styles.container}>
      <h1 className={styles.page_title}>Project Entries</h1>
      <ProjectsClient projects={projects} />
    </main>
  );
}
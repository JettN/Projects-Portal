import styles from "../../styles/projects.module.css";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface Project {
  title: string;
  preview_image: string;
  team: string[];
  start_date: string;
  type: string;
  status: 'active' | 'planned' | 'past';
  keywords: string[];
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
    const { data } = matter(fileContent);

    return {
      title: data.title,
      preview_image: data.preview_image,
      team: data.team,
      start_date: data.start_date,
      type: data.type,
      status: data.status,
      keywords: data.keywords,
      slug: folder,
    };
  }).filter(Boolean) as Project[];
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'planned');
  const pastProjects = projects.filter(p => p.status === 'past');

  return (
    <main className={styles.container}>
      <h1 className={styles.page_title}>Project Entries</h1>

      <section className={styles.search_section}>
        <input type="search" name="q" placeholder="Search keywords..." 
        className={styles.search_input}/>
        <button className={styles.search_button}>Search</button>
      </section>

      <section className="current projects">
        <h2 className={styles.title}>Active and Planned Projects</h2>
        <ul className={styles.grid}>
          {activeProjects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`}>
                <article className={styles.card}>
                  <img src={project.preview_image} alt={project.title} />
                  <h3>{project.title}</h3>
                  <p>{project.team?.join(', ')}</p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="past projects">
        <h2 className={styles.title}>Past Projects</h2>
        <ul className={styles.grid}>
          {pastProjects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`}>
                <article className={styles.card}>
                  <img src={project.preview_image} alt={project.title} />
                  <h3>{project.title}</h3>
                  <p>{project.team?.join(', ')}</p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from '../styles/projects.module.css';

interface Project {
  title: string;
  preview_image: string;
  team: string[];
  start_date: string;
  type: string;
  status: 'active' | 'planned' | 'past';
  body: string;
  slug: string;
}

interface ProjectsClientProps {
  projects: Project[];
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <p className={styles.no_results}>No projects match your search.</p>;
  }

  return (
    <ul className={styles.grid}>
      {projects.map((project) => (
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
  );
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((p) => {
      return (
        p.title?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        p.team?.some((member) => member.toLowerCase().includes(q)) ||
        p.body?.toLowerCase().includes(q)
      );
    });
  }, [query, projects]);

  const activeProjects = filtered.filter((p) => p.status === 'active');
  const pastProjects = filtered.filter((p) => p.status === 'past');

  return (
    <>
      <section className={styles.search_section}>
        <input
          type="search"
          name="q"
          placeholder="Search by title, keyword, type, or team member…"
          className={styles.search_input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search projects"
        />
        {query && (
          <button
            className={styles.search_clear}
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </section>

      {query && (
        <p className={styles.results_count}>
          {filtered.length === 0
            ? 'No results found'
            : `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      )}

      <section className="current projects">
        <h2 className={styles.title}>Active Projects</h2>
        <ProjectGrid projects={activeProjects} />
      </section>

      <section className="past projects">
        <h2 className={styles.title}>Past Projects</h2>
        <ProjectGrid projects={pastProjects} />
      </section>
    </>
  );
}

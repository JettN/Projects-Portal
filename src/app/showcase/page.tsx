import Image from "next/image";
import styles from "../../styles/showcase.module.css";
import ShowcaseSlideshow from "../../components/ShowcaseSlideshow";
import FAQSection from "../../components/FAQ";
import ExpandableImage from "../../components/ExpandableImage";

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
}

interface Sponsor {
  logo?: string;
}

interface Showcase {
  showcase_description: string;
  date: string;
  location: string;
  winner_blurb: string;
  location_link: string;
  location_image: string;
  faqs: FAQ[];
  sponsors: (string | Sponsor)[];
}

async function getShowcaseData() {
  const filePath = path.join(process.cwd(), 'content/showcase/showcase.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  return {
    showcase_description: data.showcase_description,
    date: data.date,
    location: data.location,
    winner_blurb: data.winner_blurb,
    location_link: data.location_link,
    location_image: data.location_image,
    faqs: data.faqs || [],
    sponsors: (data.sponsors || []) as (string | Sponsor)[],
  };
}

interface Project {
  title: string;
  description: string;
  preview_image: string;
  team: string[];
  slug: string;
  status: 'active' | 'planned' | 'past';
  winner_status: 'winner' | 'not winner';
}

async function getProjects() {
  const projectsDir = path.join(process.cwd(), 'content/projects');
  const folders = fs.readdirSync(projectsDir);

  return folders.map((folder) => {
    const filePath = path.join(projectsDir, folder, 'index.md');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      title: data.title,
      description: content,
      preview_image: data.preview_image,
      team: data.team,
      slug: folder,
      status: data.status,
      winner_status: data.winner_status,
    };
  });
}

export default async function ShowcasePage() {
  const showcase = await getShowcaseData();
  const projects = await getProjects();
  const activeProjects = projects.filter(p => p.status === 'active');
  const winnerProject = projects.filter(p => p.winner_status === 'winner');
  
  return (
    <div className={styles.page}>

      <ShowcaseSlideshow 
        date={showcase.date}
        location={showcase.location}
      />

      <main className={styles.mainContent}>

        <div className={styles.sectionContainer}>
          <h3 className={styles.title}>What is Project Showcase?</h3>
          <p className={styles.subtitle}>{showcase.showcase_description}</p>
          <h3 className={styles.title}>Last Year&#39;s Winner</h3>
          {winnerProject.map((project) => (
            <div key={project.slug} className={styles.project}>
              <Image className={styles.image} 
                src={project.preview_image} alt={project.title}
                width={200} height={140}
              />
              <div className={styles.projectDetailsContainer}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDetails}>{project.description}</p>
                <button className={styles.btn}>
                  View Details
                  <Link href={`/projects/${project.slug}`}></Link>
                </button>
              </div>
            </div>
          ))}
          <p className={styles.subtitle}>{showcase.winner_blurb}</p>
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeadingContainer}>
            <h3 className={styles.title}>Showcase Location</h3>
            <p className={styles.subtitle}>Price Center Ballroom West A</p>
          </div>
          <div className={styles.mapContainer}>
            <iframe
              className={styles.map}
              src={showcase.location_link}
              width="100%"
              height="350"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <ExpandableImage 
              src={showcase.location_image}
              alt={"Showcase Location Image"}
              width={400}
              height={300} 
            />
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeadingContainer}>
            <h3 className={styles.title}>Showcasing Projects</h3>
            <p className={styles.subtitle}>FYI: These are only HKN projects, but other individual projects will also be showcased.</p>
          </div>
          <div className={styles.projectsContainer}>
            {activeProjects.map((project) => (
              <div key={project.slug} className={styles.project}>
                <Image className={styles.image} 
                  src={project.preview_image} alt={project.title}
                  width={200} height={140}
                />
                <div className={styles.projectDetailsContainer}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDetails}>{project.description}</p>
                  <Link href={`/projects/${project.slug}`}>
                    <button className={styles.btn}>View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <h3 className={styles.title}>FAQs</h3>

          <FAQSection faqs={showcase.faqs} />
          
        </div>

         <div className={styles.sectionContainer}>
          <h3 className={styles.title}>Past Sponsors</h3>
          <div className={styles.sponsorsContainer}>
            {showcase.sponsors.length > 0 ? (
              showcase.sponsors.map((sponsor, index) => {
                // Sponsors may be stored as plain strings or as {logo: string} objects
                const src = typeof sponsor === 'string' ? sponsor : sponsor.logo;
                if (!src) return null;
                return (
                  <div key={index} className={styles.sponsor}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Sponsor ${index + 1}`}
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                  </div>
                );
              })
            ) : (
              <p style={{ opacity: 0.6 }}>No sponsors listed yet.</p>
            )}
          </div>
        </div>


      </main>
    </div>
  );
}
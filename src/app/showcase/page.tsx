import Image from "next/image";
import styles from "../../styles/showcase.module.css";
import ShowcaseSlideshow from "../../components/ShowcaseSlideshow";
import FAQSection from "../../components/FAQ";
import ExpandableImage from "../../components/ExpandableImage";

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface Showcase {
  showcase_description: string;
  winner_title: string;
  winner_description: string;
  winner_image: string;
}

async function getShowcaseData() {
  const filePath = path.join(process.cwd(), 'content/showcase/showcase.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    showcase_description: content,
    winner_title: data.winner_title,
    winner_description: data.winner_description,
    winner_image: data.winner_image,
  };
}

interface Project {
  title: string;
  description: string;
  preview_image: string;
  team: string[];
  slug: string;
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
    };
  });
}

export default async function ShowcasePage() {
  const showcase = await getShowcaseData();
  const projects = await getProjects();

  return (
    <div className={styles.page}>

      <ShowcaseSlideshow />

      <main className={styles.mainContent}>

        <div className={styles.sectionContainer}>
          <h3 className={styles.title}>What is Project Showcase?</h3>
          <p className={styles.subtitle}>{showcase.showcase_description}</p>
          <h3 className={styles.title}>Last Year&#39;s Winner</h3>
          <div className={styles.project}>
            <Image className={styles.image} 
              src={showcase.winner_image} alt={showcase.winner_title}
              width={250} height={180}
            />
            <div className={styles.projectDetailsContainer}>
              <h3 className={styles.projectTitle}>{showcase.winner_title}</h3>
              <p className={styles.projectDetails}>{showcase.winner_description}</p>
              <button className={styles.btn}>
                View Details
              </button>
            </div>
          </div>
          <p className={styles.subtitle}>{"VP's blurb about how many votes it got, etc."}</p>
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeadingContainer}>
            <h3 className={styles.title}>Showcase Location</h3>
            <p className={styles.subtitle}>Price Center Ballroom West A</p>
          </div>
          <div className={styles.mapContainer}>
            <iframe
              className={styles.map}
              src="https://www.google.com/maps?q=UCSD%20Price%20Center%20West&output=embed"
              width="100%"
              height="350"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <ExpandableImage 
              src={"/PC_MasterFloorPlanLevel2.jpg"}
              alt={"Price Center Master Floor Plan Level 2"}
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
            {projects.map((project) => (
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
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <h3 className={styles.title}>FAQs</h3>

          <FAQSection />
          
        </div>

         <div className={styles.sectionContainer}>
          <h3 className={styles.title}>Past Sponsors</h3>
          <div className={styles.sponsorsContainer}>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
          </div>
        </div>


      </main>
    </div>
  );
}
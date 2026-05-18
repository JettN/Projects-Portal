import styles from "../styles/home.module.css";
import HeroSlideshow from "../components/HeroSlideshow";
import FeaturedCarousel, { type FeaturedCarouselCard } from "../components/FeaturedCarousel";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

// The page reads the list of featured projects from the home page config file,
// then reads each project's title and preview image from its markdown file to
// create the carousel cards
type FeaturedProjectEntry = string | { project?: string };

interface HomeFrontmatter {
  featured_projects?: FeaturedProjectEntry[];
  about_subtitle?: string;
  about_body?: string;
}

// Normalize project slugs by removing .md extension, /index suffix, and converting backslashes to forward slashes
function normalizeProjectSlug(value: string): string {
  return value.replace(/\/index$/i, "");
}

// Structure for individual project markdown files (only extracts necessary fields)
interface ProjectFrontmatter {
  title?: string;
  preview_image?: string;
}

// Reads the home page config to get the list of featured projects, then reads
// each project's markdown file to get the title and preview image for the
// carousel cards
async function getFeaturedProjects(): Promise<FeaturedCarouselCard[]> {
  const projectsDir = path.join(process.cwd(), "content/projects");
  const homeConfigPath = path.join(process.cwd(), "content/home/homepage.md");

  // If the projects directory or home config file doesn't exist, return an empty list
  if (!fs.existsSync(projectsDir) || !fs.existsSync(homeConfigPath)) {
    return [];
  }

  // Parse the home page config file to get the list of featured projects (as slugs)
  const homeConfigContent = fs.readFileSync(homeConfigPath, "utf-8");
  const { data } = matter(homeConfigContent);
  const frontmatter = data as HomeFrontmatter;
  const rawFeaturedProjects = frontmatter.featured_projects ?? [];
  const featuredSlugs = rawFeaturedProjects
    .map((entry) => (typeof entry === "string" ? entry : entry.project))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => normalizeProjectSlug(slug));

  // For each featured project slug, read the corresponding markdown file to get
  // the title and preview image for the carousel card
  const cards = featuredSlugs
    .map((slug): FeaturedCarouselCard | null => {
      const projectFilePath = path.join(projectsDir, slug, "index.md");
      if (!fs.existsSync(projectFilePath)) {
        return null;
      }
      
      const projectFileContent = fs.readFileSync(projectFilePath, "utf-8");
      const { data: projectData } = matter(projectFileContent);
      const projectFrontmatter = projectData as ProjectFrontmatter;

      // Skip this project if it doesn't have the necessary fields
      if (!projectFrontmatter.title || !projectFrontmatter.preview_image) {
        return null;
      }

      // Create a carousel card for this project
      return {
        id: 0,
        name: projectFrontmatter.title,
        slug,
        image: projectFrontmatter.preview_image,
      };
    })
    .filter((project): project is FeaturedCarouselCard => project !== null)
    .map((project, index) => ({ ...project, id: index }));

  return cards;
}

async function getHomeContent(): Promise<{ about_subtitle: string; about_body: string }> {
  const homeConfigPath = path.join(process.cwd(), "content/home/homepage.md");
  if (!fs.existsSync(homeConfigPath)) {
    return { about_subtitle: "", about_body: "" };
  }
  const { data } = matter(fs.readFileSync(homeConfigPath, "utf-8"));
  const frontmatter = data as HomeFrontmatter;
  return {
    about_subtitle: frontmatter.about_subtitle ?? "",
    about_body: frontmatter.about_body ?? "",
  };
}

// Home Page
export default async function Home() {
  const [featuredProjects, homeContent] = await Promise.all([
    getFeaturedProjects(),
    getHomeContent(),
  ]);

  return (
    <div className={styles.page}>
      {/* Full-viewport image slideshow with page title and subtitle*/}
      <HeroSlideshow />

      <main className={styles.mainContent}>
        {/* What is HKN Projects? */}
        <section className={styles.aboutSection}>
          <h2 className={styles.sectionTitle}>What is HKN Projects?</h2>
          <div className={styles.aboutGrid}>
            {/* Image */}
            <img
              src="/hero_slideshow/hab_outreach_tour.png"
              className={styles.aboutImage}
            />

            {/* Section text */}
            <div className={styles.aboutTextWrapper}>
              <h3 className={styles.aboutHeading}>
                {homeContent.about_subtitle || "Hands-On Engineering Experience"}
              </h3>
              <p className={styles.aboutBody}>
                {homeContent.about_body || ""}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <FeaturedCarousel cards={featuredProjects} />
        </section>
      </main>
    </div>
  );
}
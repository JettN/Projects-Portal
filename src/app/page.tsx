import styles from "../styles/home.module.css";
import HeroSlideshow from "../components/HeroSlideshow";
import FeaturedCarousel, { type FeaturedCarouselCard } from "../components/FeaturedCarousel";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

interface HomeFrontmatter {
  about_subtitle?: string;
  about_body?: string;
  slideshow_images?: unknown[];
}

// Structure for individual project markdown files (only extracts necessary fields)
interface ProjectFrontmatter {
  title?: string;
  preview_image?: string;
  featured?: boolean;
}

// Scans all projects and returns those with featured: true
async function getFeaturedProjects(): Promise<FeaturedCarouselCard[]> {
  const projectsDir = path.join(process.cwd(), "content/projects");

  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const folders = fs.readdirSync(projectsDir).filter((folder) =>
    fs.statSync(path.join(projectsDir, folder)).isDirectory()
  );

  const cards = folders
    .map((slug): FeaturedCarouselCard | null => {
      const projectFilePath = path.join(projectsDir, slug, "index.md");
      if (!fs.existsSync(projectFilePath)) return null;

      const { data } = matter(fs.readFileSync(projectFilePath, "utf-8"));
      const frontmatter = data as ProjectFrontmatter;

      if (!frontmatter.featured) return null;
      if (!frontmatter.title || !frontmatter.preview_image) return null;

      return {
        id: 0,
        name: frontmatter.title,
        slug,
        image: frontmatter.preview_image,
      };
    })
    .filter((card): card is FeaturedCarouselCard => card !== null)
    .map((card, index) => ({ ...card, id: index }));

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

async function getSlideshowImages(): Promise<string[]> {
  const homePath = path.join(process.cwd(), "content/home/homepage.md");
  if (!fs.existsSync(homePath)) return [];
  const { data } = matter(fs.readFileSync(homePath, "utf-8"));
  const raw = data.slideshow_images ?? [];
  return Array.isArray(raw)
    ? raw.map((x: unknown) => (typeof x === 'string' ? x : (x as { image?: string })?.image ?? '')).filter(Boolean)
    : [];
}

// Home Page
export default async function Home() {
  const [featuredProjects, homeContent, slideshowImages] = await Promise.all([
    getFeaturedProjects(),
    getHomeContent(),
    getSlideshowImages(),
  ]);

  return (
    <div className={styles.page}>
      {/* Full-viewport image slideshow with page title and subtitle*/}
      <HeroSlideshow slideshowImages={slideshowImages} />

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
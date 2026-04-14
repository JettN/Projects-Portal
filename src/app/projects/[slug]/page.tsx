import styles from "../../../styles/single.project.module.css";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { notFound } from "next/navigation";
import FeaturedCarousel, {
  type FeaturedCarouselCard,
} from "../../../components/FeaturedCarousel";

interface ProjectFrontmatter {
  title?: string;
  team?: string[];
  preview_image?: string;
  carousel_images?: unknown;
}

function docCarouselCards(
  slug: string,
  frontmatter: ProjectFrontmatter
): FeaturedCarouselCard[] {
  const raw = frontmatter.carousel_images;
  const fromList = Array.isArray(raw)
    ? raw.map((x) => String(x).trim()).filter(Boolean)
    : [];
  const urls =
    fromList.length > 0
      ? fromList
      : frontmatter.preview_image
        ? [String(frontmatter.preview_image).trim()]
        : [];

  return urls.map((image, index) => ({
    id: index,
    name: frontmatter.title || slug,
    slug,
    image,
  }));
}

/** Demo: repeat the same image set twice more so arrow clicks show more slides. */
function triplicateCarouselCards(
  cards: FeaturedCarouselCard[]
): FeaturedCarouselCard[] {
  if (cards.length === 0) return cards;
  return [...cards, ...cards, ...cards].map((card, index) => ({
    ...card,
    id: index,
  }));
}

export default async function Entry({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectPath = path.join(
    process.cwd(),
    "content/projects",
    slug,
    "index.md"
  );

  if (!fs.existsSync(projectPath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(projectPath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as ProjectFrontmatter;
  const testCards = triplicateCarouselCards(docCarouselCards(slug, frontmatter));

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>
          {frontmatter.title || "Project Name"}
        </h1>

        <section>
          <h2 className={styles.sectionTitle}>Project Overview</h2>
          <div className={styles.overviewBox}>
            <p>{content}</p>
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Documentation</h2>
          {testCards.length > 0 ? (
            <FeaturedCarousel cards={testCards} />
          ) : (
            <p style={{ opacity: 0.85 }}>No preview images for this project.</p>
          )}
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Project Members</h2>
          <div className={styles.membersContent}>
            <div
              className={styles.memberPhoto}
              style={
                frontmatter.preview_image
                  ? {
                      backgroundImage: `url(${frontmatter.preview_image})`,
                    }
                  : undefined
              }
            />

            <div className={styles.memberList}>
              <h3>Team:</h3>
              {frontmatter.team?.length ? (
                frontmatter.team.map((member, index) => (
                  <p key={index}>{member}</p>
                ))
              ) : (
                <p>No members listed.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

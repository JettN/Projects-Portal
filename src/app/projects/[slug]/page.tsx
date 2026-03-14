import styles from "../../../styles/single.project.module.css";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import FeaturedCarousel, {
  type FeaturedCarouselCard,
} from "../../../components/FeaturedCarousel";

interface ProjectFrontmatter {
  title?: string;
  team?: string[];
  preview_image?: string;
}

export default async function Entry() {
  const projectPath = path.join(process.cwd(), "content/projects/test-2/index.md");
  const fileContent = fs.readFileSync(projectPath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as ProjectFrontmatter;

  const testCards: FeaturedCarouselCard[] = [
    {
      id: 0,
      name: "Manual v1",
      slug: "test-2",
      image: frontmatter.preview_image || "",
    },
    {
      id: 1,
      name: "Main Preview",
      slug: "test-2",
      image: frontmatter.preview_image || "",
    },
    {
      id: 2,
      name: "Schematics",
      slug: "test-2",
      image: frontmatter.preview_image || "",
    },
  ];

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
          <FeaturedCarousel cards={testCards} />
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Project Members</h2>
          <div className={styles.membersContent}>
            <div className={styles.memberPhoto} />

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
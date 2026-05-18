"use client";

import { useState, useEffect } from "react";
import styles from "../../../styles/single.project.module.css";
import FeaturedCarousel, {
  type FeaturedCarouselCard,
} from "../../../components/FeaturedCarousel";

interface ProjectFrontmatter {
  title?: string;
  team?: string[]
  team_leader?: string;
  team_photo?: string;
  preview_image?: string;
  carousel_images?: unknown;
  doc_link?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
}

interface Props {
  frontmatter: ProjectFrontmatter;
  content: string;
  carouselCards: FeaturedCarouselCard[];
}

export default function ProjectEntryClient({ frontmatter, content, carouselCards }: Props) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedImage(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>
          {frontmatter.title || "Project Name"}
        </h1>

        {/* Date range under title */}
        {frontmatter.start_date && (
          <p className={styles.projectDateline}>
            {new Date(frontmatter.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {frontmatter.end_date
              ? ` – ${new Date(frontmatter.end_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
              : ' – Present'}
          </p>
        )}

        <section>
          <h2 className={styles.sectionTitle}>Project Overview</h2>
          <div className={styles.overviewBox}>
            <p>{content}</p>
          </div>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Documentation</h2>

          {frontmatter.doc_link && (
            <div className={styles.docLinkWrapper}>
              <a
                href={frontmatter.doc_link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.docLink}
              >
                View Documentation →
              </a>
            </div>
          )}

          {carouselCards.length > 0 ? (
            <>
              <h3 className={styles.galleryTitle}>Project Gallery</h3>
              <FeaturedCarousel
                cards={carouselCards}
                onExpandImage={setExpandedImage}
              />
            </>
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
                frontmatter.team_photo
                  ? { backgroundImage: `url(${frontmatter.team_photo})` }
                  : undefined
              }
            />

            <div className={styles.memberList}>
              {frontmatter.team_leader && (
                <>
                  <h3>Team Leader:</h3>
                  <p className={styles.teamLeader}>{frontmatter.team_leader}</p>
                </>
              )}

              <h3>Team:</h3>
              {frontmatter.team?.length ? (
                frontmatter.team.map((member, index) => (
                  <p key={index}>{member}</p>
                ))
              ) : (
                <p>No members listed.</p>
              )}

              {frontmatter.type && (
                <>
                  <h3>Majors Involved:</h3>
                  <p>{frontmatter.type}</p>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox modal */}
      {expandedImage && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setExpandedImage(null)}
        >
          <button
            className={styles.lightboxClose}
            onClick={() => setExpandedImage(null)}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={expandedImage}
            alt="Expanded project image"
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
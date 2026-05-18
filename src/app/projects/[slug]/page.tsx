import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { notFound } from "next/navigation";
import { type FeaturedCarouselCard } from "../../../components/FeaturedCarousel";
import ProjectEntryClient from "./ProjectEntryClient";

interface ProjectFrontmatter {
  title?: string;
  team?: string[];
  team_leader?: string;
  team_photo?: string;
  preview_image?: string;
  carousel_images?: unknown;
  doc_link?: string;
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
  const carouselCards = docCarouselCards(slug, frontmatter);

  return (
    <ProjectEntryClient
      frontmatter={frontmatter}
      content={content}
      carouselCards={carouselCards}
    />
  );
}
import styles from "../../styles/resources.module.css";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ResourceLink {
  label: string;
  url: string;
  description?: string;
}

interface ResourceCategory {
  title: string;
  links: ResourceLink[];
}

async function getResourcesData() {
  const filePath = path.join(process.cwd(), 'content/resources/resources.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  return {
    resource_categories: (data.resource_categories ?? []) as ResourceCategory[],
    contact_email: (data.contact_email ?? '') as string,
    contact_linkedin: (data.contact_linkedin ?? '') as string,
    contact_instagram: (data.contact_instagram ?? '') as string,
  };
}

export default async function ResourcesPage() {
  const { resource_categories, contact_email, contact_linkedin, contact_instagram } = await getResourcesData();

  return (
    <main className={styles.container}>
      <h1 className={styles.page_title}>Resources</h1>

      <div className={styles.columns}>
        <div className={styles.links_column}>
          {resource_categories.map((category) => (
            <div key={category.title} className={styles.resource_card}>
              <div className={styles.resource_card_title}>{category.title}</div>
              {category.links.map((link, i) => (
                <div key={i} className={styles.resource_link_item}>
                  <a href={link.url} className={styles.resource_link}>{link.label}</a>
                  {link.description && <p className={styles.resource_link_description}>{link.description}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>

        <aside className={styles.contact_aside}>
          <div className={styles.contact_title}>Contact Info</div>
          {contact_email && <a href={`mailto:${contact_email}`} className={styles.contact_item}>{contact_email}</a>}
          {contact_linkedin && <a href={contact_linkedin} className={styles.contact_item} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {contact_instagram && <a href={contact_instagram} className={styles.contact_item} target="_blank" rel="noopener noreferrer">Instagram</a>}
        </aside>
      </div>
    </main>
  );
}

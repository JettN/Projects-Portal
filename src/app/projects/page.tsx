import styles from "../../styles/projects.module.css";
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.page_title}>Project Entries</h1>
      <form action="/search" method="get">
        <input type="search" name="q" placeholder="Search keywords..."/>
        <button>Search</button>
      </form>
      <section className="current projects">
        <h2 className={styles.title}>Active and Planned Projects</h2>
        <ul className={styles.grid}>
          <li>
            <Link href='projects/indiv_project'>
              <article className={styles.card}>
                <img alt='Project Preview'/>
                <h3>Project Title</h3>
                <p>Group Members</p>
              </article>
            </Link>
          </li>
          <li>
            <Link href='projects/indiv_project'>
              <article className={styles.card}>
                <img alt='Project Preview'/>
                <h3>Project Title</h3>
                <p>Group Members</p>
              </article>
            </Link>
          </li>
          <li>
            <Link href='projects/indiv_project'>
              <article className={styles.card}>
                <img alt='Project Preview'/>
                <h3>Project Title</h3>
                <p>Group Members</p>
              </article>
            </Link>
          </li>
        </ul>
      </section>
      <section className="past projects">
        <h2 className={styles.title}>Past Projects</h2>
        <ul className={styles.grid}>
          <li>
            <Link href='projects/indiv_project'>
              <article className={styles.card}>
                <img alt='Project Preview'/>
                <h3>Project Title</h3>
                <p>Group Members</p>
              </article>
            </Link>
          </li>
          <li>
            <Link href='projects/indiv_project'>
              <article className={styles.card}>
                <img alt='Project Preview'/>
                <h3>Project Title</h3>
                <p>Group Members</p>
              </article>
            </Link>
          </li>
          <li>
            <Link href='projects/indiv_project'>
              <article className={styles.card}>
                <img alt='Project Preview'/>
                <h3>Project Title</h3>
                <p>Group Members</p>
              </article>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
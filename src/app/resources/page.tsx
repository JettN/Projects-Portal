import styles from "../../styles/resources.module.css";

export default function ResourcesPage() {
  return (
    <div className={styles.bodyBg}>
      {/* <header className={styles.headerBar}>
        <img src="#" alt="HKN Logo" className={styles.logo} />
        <nav className={styles.navLinks}>
          <a href="#" className={styles.navLink}>About</a>
          <a href="#" className={styles.navLink}>Projects</a>
          <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>Resources</a>
          <a href="#" className={styles.navLink}>Project Showcase</a>
        </nav>
      </header> */}
      <main className={styles.mainContent}>
        <section className={styles.resourcesSection}>
          <h1 className={styles.resourcesTitle}>Resources</h1>
          <div className={styles.columns}>
            {/* Left column: Links and resources */}
            <div className={styles.linksColumn}>
              <section className={styles.resourceBox}>
                <div className={styles.resourceLabel}>HKN@UCSD</div>
                <div className={styles.resourceLabel}>&lt;link&gt;</div>
              </section>
              <section className={styles.resourceBox}>
                <div className={styles.resourceLabel}>HKN Portal</div>
                <div className={styles.resourceLabel}>&lt;link&gt;</div>
              </section>
              <section className={styles.resourceBox}>
                <div className={styles.resourceLabel}>Other Sites/Resources</div>
                <div className={styles.resourceLabel}>&lt;link&gt;</div>
                <div className={styles.resourceLabel}>&lt;link&gt;</div>
                <div className={styles.resourceLabel}>&lt;link&gt;</div>
              </section>
            </div>
            {/* Right column: Contact info */}
            <aside className={styles.contactAside}>
              <div className={styles.contactTitle}>Contact Info</div>
              <div className={styles.contactDetails}>&lt;email&gt;, &lt;linkedIn&gt;, &lt;Insta&gt;</div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
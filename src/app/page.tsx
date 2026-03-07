import styles from "../styles/home.module.css";
import HeroSlideshow from "../components/HeroSlideshow";
import FeaturedCarousel from "../components/FeaturedCarousel";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Full-viewport image slideshow with page title and subtitle*/}
      <HeroSlideshow />

      <main className={styles.mainContent}>
        {/* What is HKN Projects? */}
        <section className={styles.aboutSection}>
          <h2 className={styles.sectionTitle}>What is HKN Projects?</h2>
          <div className={styles.aboutGrid}>
            {/* Image placeholder */}
            <div className={styles.aboutImagePlaceholder} />

            {/* Section text */}
            <div className={styles.aboutTextWrapper}>
              <h3 className={styles.aboutHeading}>
                Hands-On Engineering Experience
              </h3>
              <p className={styles.aboutBody}>
                Body text for your whole article or post. We&apos;ll put in some
                lorem ipsum to show how a filled-out page might look:
              </p>
              <p className={styles.aboutBody}>
                Excepteur efficient emerging, minim veniam anim aute carefully
                curated Ginza conversation exquisite perfect nostrud nisi
                intricate Content. Qui  international first-class nulla ut.
                Punctual adipisicing, essential lovely queen tempor eiusmod
                irure. Exclusive izakaya charming Scandinavian impeccable aute
                quality of life soft power pariatur Melbourne occaecat
                discerning. Qui wardrobe aliquip, et Porter destination Toto
                remarkable officia Helsinki excepteur Basset hound. Zürich
                sleepy perfect consectetur.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <FeaturedCarousel />
        </section>
      </main>
    </div>
  );
}

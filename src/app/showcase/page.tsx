import Image from "next/image";
import styles from "../../styles/showcase.module.css";

export default function ShowcasePage() {
  return (
    <div className={styles.page}>
      <main className={styles.container}>

        <div className={styles.heroContainer}>
          <h1 className={styles.heading}>HKN Project Showcase</h1>
          <p className={styles.subheading}>MM/DD/YYYY at [location]</p>
          <h2 className={styles.heading}>DD:HH:MM:SS</h2>
        </div>

        <div className={styles.sectionContainer}>
          <h3 className={styles.title}>What is Project Showcase?</h3>
          <p className={styles.subtitle}>[Description of project showcase...]</p>
          <h4 className={styles.title}>Last Year&#39;s Winner</h4>
          <p className={styles.subtitle}>[Description of last year&#39;s winner...]</p>
          <div className={styles.imageContainer}>
            <Image className={styles.image}
              src="/hab_and_dev_team_photo.jpg"
              alt="hab and dev team photo"
              width={400}
              height={300}
            />
            <Image className={styles.image}
              src="/hab_hdsi_conference1.png"
              alt="hab hdsi conference 1"
              width={400}
              height={300}
            />
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeadingContainer}>
            <h3 className={styles.title}>Showcase Location</h3>
            <p className={styles.subtitle}>[Specific location address]</p>
          </div>
          <div className={styles.mapContainer}>
            <div className={styles.map}></div>
            <div className={styles.map}></div>
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeadingContainer}>
            <h3 className={styles.title}>Showcasing Projects</h3>
            <p className={styles.subtitle}>FYI: These are only HKN projects, but other individual projects will also be showcased.</p>
          </div>
          <div className={styles.projectsContainer}>
            <div className={styles.project}>
              <Image className={styles.image}
                src="/hab_and_dev_team_photo.jpg"
                alt="hab and dev team photo"
                width={200}
                height={160}
              />
              <div className={styles.projectDetailsContainer}>
                <h3 className={styles.projectTitle}>Project Title</h3>
                <p className={styles.projectDetails}>Short project description...</p>
                <p className={styles.projectDetails}>Team Members: [name 1], [name 2], ...</p>
                <button className={styles.btn}>more details</button>
              </div>
            </div>
            <div className={styles.project}>
              <Image className={styles.image}
                src="/hab_and_dev_team_photo.jpg"
                alt="hab and dev team photo"
                width={200}
                height={160}
              />
              <div className={styles.projectDetailsContainer}>
                <h3 className={styles.projectTitle}>Project Title</h3>
                <p className={styles.projectDetails}>Short project description...</p>
                <p className={styles.projectDetails}>Team Members: [name 1], [name 2], ...</p>
                <button className={styles.btn}>more details</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <h3 className={styles.title}>FAQs</h3>
          <div className={styles.faqsContainer}>
            <div className={styles.faq}>
              <p className={styles.faqQues}>Question...?</p>
              <p className={styles.faqAns}>Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.</p>
            </div>
            <div className={styles.faq}>
              <p className={styles.faqQues}>Question...?</p>
              <p className={styles.faqAns}>Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.</p>
            </div>
            <div className={styles.faq}>
              <p className={styles.faqQues}>Question...?</p>
              <p className={styles.faqAns}>Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.</p>
            </div>
          </div>
        </div>

         <div className={styles.sectionContainer}>
          <h3 className={styles.title}>Past Sponsors</h3>
          <div className={styles.sponsorsContainer}>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
            <div className={styles.sponsor}></div>
          </div>
        </div>


      </main>
    </div>
  );
}
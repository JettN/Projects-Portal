import styles from "../../../styles/single.project.module.css";
export default async function Entry() {
  
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        
        <h1 style={{ textAlign: "center", marginBottom: "50px" }}>Project Name</h1>

        {/* PROJECT OVERVIEW */}
        <section>
          <h2 className={styles.sectionTitle}>Project Overview</h2>
          <div className={styles.overviewBox} />
        </section>

        {/* DOCUMENTATION CAROUSEL */}
        <section className={styles.carouselWrapper}>
          <button className={styles.arrowBtn}>&lsaquo;</button>

          <div className={styles.carouselTrack}>
            {/* Left Card */}
            <div className={styles.card}>
              <div className={styles.cardImage} />
              <p className={styles.cardLabel}>Documentation Name</p>
            </div>

            {/* Middle (Active) Card */}
            <div className={`${styles.card} ${styles.activeCard}`}>
              <div className={styles.cardImage} style={{ background: "#eee" }} />
              <p className={styles.cardLabel} style={{ fontWeight: "bold" }}>
                Documentation Name
              </p>
            </div>

            {/* Right Card */}
            <div className={styles.card}>
              <div className={styles.cardImage} />
              <p className={styles.cardLabel}>Documentation Name</p>
            </div>
          </div>

          <button className={styles.arrowBtn}>&rsaquo;</button>
        </section>

        {/* MEMBERS */}
        <section>
          <h2 className={styles.sectionTitle}>Project Members</h2>
          <div className={styles.membersContent}>
            <div className={styles.memberPhoto} />
            
            <div className={styles.memberList}>
              <h3>Lead:</h3>
              <p>Name - Major - Class</p>
              
              <h3>Members:</h3>
              <p>Name - Major - Class</p>
              <p>Name - Major - Class</p>
              <p>Name - Major - Class</p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
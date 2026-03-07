import styles from "../../../styles/single.project.module.css";

interface Props {
  params: { slug: string };
}

export default function SingleProjectPage({ params }: Props) {
  return (
    <main className={styles.page}>

      {/* TITLE */}
      <section className={styles.titleSection}>
        <h1>{params.slug}</h1>
      </section>

      {/* PROJECT OVERVIEW */}
      <section>
        <h2>Project Overview</h2>
        <div
          style={{
            background: "#ddd",
            height: "250px",
            padding: "20px",
          }}
        >
          Project overview text goes here.
        </div>
      </section>

      {/* DOCUMENTATION CAROUSEL (static for now) */}
      <section style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          
          <button type="button">{"<"}</button>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ width: "200px", height: "200px", background: "#ccc" }}>
              Documentation
            </div>

            <div style={{ width: "200px", height: "200px", background: "#ccc" }}>
              Documentation
            </div>

            <div style={{ width: "200px", height: "200px", background: "#ccc" }}>
              Documentation
            </div>
          </div>

          <button type="button">{">"}</button>
        </div>
      </section>

      {/* MEMBERS */}
      <section style={{ marginTop: "80px" }}>
        <h2>Project Members</h2>

        <div style={{ display: "flex", gap: "40px" }}>
          
          <div
            style={{
              width: "300px",
              height: "300px",
              background: "#ddd",
            }}
          />

          <div>
            <p>Lead:</p>
            <p>Name - Major - Class</p>
            <p>Members:</p>
            <p>Name - Major - Class</p>
            <p>Name - Major - Class</p>
            <p>Name - Major - Class</p>
          </div>
        </div>
      </section>
    </main>
  );
}
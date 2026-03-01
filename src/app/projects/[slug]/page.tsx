import styles from "../../../styles/single.project.module.css";

interface Props {
  params: { slug: string };
}

export default function SingleProjectPage({ params }: Props) {
  return (
    <main>
      <h1>{params.slug}</h1>
      <p>Project details here.</p>
    </main>
  );
}
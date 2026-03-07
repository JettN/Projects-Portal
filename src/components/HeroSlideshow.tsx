"use client";

import { useState, useEffect } from "react";
import styles from "../styles/home.module.css";

// Image slides
const slides = [
  { bg: "url(/hero_slideshow/heroSlideshow1.png)" },
  { bg: "url(/hero_slideshow/heroSlideshow2.jpg)" },
  { bg: "url(/hero_slideshow/heroSlideshow3.JPG)" },
  { bg: "url(/hero_slideshow/heroSlideshow4.png)" },
];

export default function HeroSlideshow() {
  // Index of the currently active slide
  const [current, setCurrent] = useState(0);

  // Change slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Slide backgrounds */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`${styles.heroSlide} ${i === current ? styles.heroSlideActive : ""}`}
          style={{ backgroundImage: slide.bg }}
        />
      ))}

      {/* Dark tint over images */}
      <div className={styles.heroTint} />

      {/* Text */}
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>HKN Projects</h1>
        <p className={styles.heroSubtitle}>
          The intersection of hardware, software, and community
        </p>
      </div>
    </section>
  );
}

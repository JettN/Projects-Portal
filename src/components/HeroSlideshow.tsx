"use client";

import { useState, useEffect } from "react";
import styles from "../styles/home.module.css";

const FALLBACK_SLIDES = [
  "/hero_slideshow/heroSlideshow1.png",
  "/hero_slideshow/heroSlideshow2.jpg",
  "/hero_slideshow/heroSlideshow3.JPG",
  "/hero_slideshow/heroSlideshow4.png",
];

interface HeroSlideshowProps {
  slideshowImages?: string[];
}

export default function HeroSlideshow({ slideshowImages = [] }: HeroSlideshowProps) {
  const images = slideshowImages.length > 0 ? slideshowImages : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className={styles.hero}>
      {/* Slide backgrounds */}
      {images.map((src, i) => (
        <div
          key={i}
          className={`${styles.heroSlide} ${i === current ? styles.heroSlideActive : ""}`}
          style={{ backgroundImage: `url(${src})` }}
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
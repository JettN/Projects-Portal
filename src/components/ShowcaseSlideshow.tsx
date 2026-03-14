"use client";

import { useState, useEffect } from "react";
import styles from "../styles/showcase.module.css";

// Set the event date and location here
const TARGET_DATE = "2026-04-01T18:00:00";  // e.g. April 1, 2026 at 6:00 PM
const LOCATION = "Henry Booker Room";

// Image slides
const slides = [
  { bg: "url(/hero_slideshow/heroSlideshow1.png)" },
  { bg: "url(/hero_slideshow/heroSlideshow2.jpg)" },
  { bg: "url(/hero_slideshow/heroSlideshow3.JPG)" },
  { bg: "url(/hero_slideshow/heroSlideshow4.png)" },
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ShowcaseSlideshow() {
  // Index of the currently active slide
  const [current, setCurrent] = useState(0);

  // Date formatting
  const eventDate = new Date(TARGET_DATE);  
  // Formats to "MM/DD/YYYY"
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  // Formats to "h:mm A" (e.g. 6:00 PM)
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Countdown calculation
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(TARGET_DATE) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, "0");

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
        <h1 className={styles.heroTitle}>HKN Project Showcase</h1>
        <p className={styles.heroSubtitle}>
          {formattedDate} at {formattedTime} | {LOCATION}
        </p>
        {/* Countdown Display */}
        <h2 className={styles.countdown}>
          {format(timeLeft.days)}D:{format(timeLeft.hours)}H:{format(timeLeft.minutes)}M:{format(timeLeft.seconds)}S
        </h2>
      </div>
    </section>
  );
}

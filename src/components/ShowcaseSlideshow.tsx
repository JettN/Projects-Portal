"use client";

import { useState, useEffect } from "react";
import styles from "../styles/showcase.module.css";

type ShowcaseSlideshowProps = {
  date: string;
  location: string;
};

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

export default function ShowcaseSlideshow({
  date, 
  location,
}: ShowcaseSlideshowProps) {
  // Index of the currently active slide
  const [current, setCurrent] = useState(0);

  // Date formatting
  // Parse the date as Pacific Time by using Intl to get the correct UTC offset.
  // Strip any existing timezone info and reinterpret as America/Los_Angeles.
  const parseDateAsPacific = (dateStr: string): Date => {
    // Remove any trailing Z or offset so we treat it as a naive local string
    const naive = dateStr.replace(/Z|[+-]\d{2}:\d{2}$/, '');
    // Use Intl to find the UTC offset for Pacific Time at that moment
    const tempDate = new Date(naive + 'Z'); // parse as UTC first to get a Date
    const pacificFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
    // Re-parse using the naive string interpreted in PT by finding the offset
    const parts = pacificFormatter.formatToParts(tempDate);
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? '0';
    const ptNow = new Date(`${get('year')}-${get('month')}-${get('day')}T${get('hour') === '24' ? '00' : get('hour')}:${get('minute')}:${get('second')}Z`);
    const offsetMs = tempDate.getTime() - ptNow.getTime();
    return new Date(new Date(naive).getTime() - offsetMs);
  };

  const eventDate = parseDateAsPacific(date);  
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
    const difference = +parseDateAsPacific(date) - +new Date();
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
          {formattedDate} at {formattedTime} | {location}
        </p>
        {/* Countdown Display */}
        <h2 className={styles.countdown}>
          {format(timeLeft.days)}d:{format(timeLeft.hours)}h:{format(timeLeft.minutes)}m:{format(timeLeft.seconds)}s
        </h2>
      </div>
    </section>
  );
}